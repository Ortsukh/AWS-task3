
const  products  = require('../productList.json');
const { Client } = require('pg') ;


const {
  PG_HOST,
  PG_PORT,
  PG_DATABASE,
  PG_USERNAME,
  PG_PASSWORD,
} = process.env;

const dbOptions = {
  host : PG_HOST,
  port: +PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

handleResponse = (products = {}, status = 200) => ({
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: status,
    body: JSON.stringify(products),
  });
getProductsList = async (event) => {
  console.log(12);
  console.log(dbOptions);
  const client = new Client(dbOptions);
    try {
      await client.connect();
      const { rows: products } = await client.query(`
      select
        products.id as id,
        stocks.count as count,
        products.title as title,
        products.description as description,
        products.price as price
      from products
      join stocks
      on products.id = stocks.product_id
      `);
      return handleResponse(products);
    } catch (error) {
      console.log(error);
    } finally {
      client.end();
    }
  };
module.exports.handler = async event => getProductsList();