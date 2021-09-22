
const csv = require('csv-parser');
const { S3 } = require('aws-sdk');

handleResponse = (products = {}, status = 200) => ({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*',
  },
  statusCode: status,
  body: JSON.stringify(products),
}); 

module.exports.handler = async event => { 
  console.log(event);
  for (const record of event.Records) {
  try {
    const { s3: eventS3 } = record;
    const { bucket, object } = eventS3 || {};
    console.log('s3', eventS3);

    const params = {
      Bucket: bucket.name,
      Key: object.key,
    };

    const s3 = new S3({ region: 'eu-west-1' });
    const s3Stream = s3.getObject(params).createReadStream();

    const result = await new Promise((resolve, reject) => {
      s3Stream.pipe(csv())
        .on('data', data => {
          console.log('data', data);
        })
        .on('error', error => {
          reject(error);
        })
        .on('end', () => {
          resolve({ message: 'File is successfully parsed' });
        });
    });
    console.log('result', result);

    await s3
      .copyObject({
        Bucket: bucket.name,
        CopySource: `${bucket.name}/${object.key}`,
        Key: object.key.replace('uploaded', 'parsed'),
      })
      .promise();
    console.log('Object had been copied');

    await s3.deleteObject(params).promise();
    console.log('Object had been deleted');

    return handleResponse(null, 204);
  } catch (error) {
    console.log('ERROR', error);
    return handleResponse({ message: error.message }, 500);
  }}
};