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

module.exports.handler = async event => {

  console.log(`[${new Date().toLocaleString()}]`);
  console.log('[REQUEST]: add a product');
  console.log(event.body);
  

  const client = new Client(dbOptions);


  const { title, description, price, count } = JSON.parse(event.body)  ;
  if (!title || price < 0 || count < 0) {
    return handleResponse({
      message: 'Bad request',
    }, 400);
  }
  try {
    await client.connect();
    await client.query('BEGIN');
    await client.query(
    `insert into products(title, description, price) values ($1, $2, ${price}) returning id`,
    [title, description]
    );

    const { rows: addedProduct } = await client.query(`
    select
      id
    from products
    where title = '${title}'
    `);
    const id = addedProduct[0].id;
await client.query(
    `insert into stocks(product_id, count) values ($1, ${count})`,
    [id]
  );
    await client.query('COMMIT');
    return handleResponse({
      message: 'Product added.',
    });
  } catch (error) {
      console.log(error);
    return handleResponse
        ({ message: `Something went terribly wrong.${error}`}, 500);
      
      
    ;
  } finally {
    client.end();
  }
};


  
