const AWS = require('aws-sdk');
const { Client } = require('pg') ;


handleResponse = (products = {}, status = 200) => ({
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: status,
    body: JSON.stringify(products),
  }); 

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  user: PG_USERNAME,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: PG_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

module.exports.handler = async event => { 
  const client = new Client(dbOptions);
  client.connect();
  let isFileParsed = false;

  try {
    const messages = event.Records.map(({ body }) => body);

    for (let message of messages) {
      const { title, description, price, count, status } = JSON.parse(message);

      if (status) {
        isFileParsed = true;
        break;
      }

      const hasAllParams = !!(title && description && price && count);

      if (!hasAllParams) {
        throw Error("wrong attributes");
      }

      await client.query('BEGIN');
      const insertProductsText =
      `insert into products(title, description, price) values ($1, $2, $3) returning id`;
      const productsResponse = await client.query(insertProductsText, [title, description, price]);
      console.log('productsResponse', productsResponse);
      const { id: id } = productsResponse.rows[0];
      const insertStocksText = 'insert into stocks(product_id, count) VALUES ($1, $2)';
      await client.query(insertStocksText, [id,count]);
      await client.query('COMMIT');
    }

    const sns = new AWS.SNS({ region: 'eu-west-1' });

    const params = {
      Subject: 'End of file parsing',
      Message: isFileParsed ? 'Parsing is in process' : 'File has been parsed',
      TopicArn: process.env.SNS_ARN,
      MessageAttributes: {
        status: {
          DataType: 'String',
          StringValue: isFileParsed ? 'In process' : 'Done',
        },
      },
    };

    const result = await sns.publish(params).promise();
    return handleResponse(result);
  } catch (error) {
    console.log('error', error.message);
    if (error.message !== "wrong attributes") {
      await client.query('ROLLBACK');
      return handleResponse({ message: "simething wrong" }, 500);
    }

    return handleResponse({ message: error.message }, 400);
  } finally {
    await client.end();
  }
};