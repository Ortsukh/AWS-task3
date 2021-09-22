
const { S3 } = require('aws-sdk') ;


const BUCKET = 'node-aws-course';
let status = 200;

module.exports.handler = async event => {
  console.log('[REQUEST]: import products file');
  console.log(
    `[Request parameters]: ${JSON.stringify(event.queryStringParameters)}`
  );
  const s3 = new S3({ region: 'eu-west-1' });
  const params = {
    Bucket: BUCKET,
    Key: `uploaded/${event.queryStringParameters.name}`,
    Expires: 60,
    ContentType: 'text/csv',
  };

  let url;

  try {
    url = await s3.getSignedUrlPromise('putObject', params);
  } catch (error) {
    console.error(error);
    status = 500;
  }

  return {
    statusCode: status,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ url }),
  };
};
