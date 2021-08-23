const  products  = require('../productList.json');


const handleResponse = (products = {}, status = 200) => ({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*',
  },
  statusCode: status,
  body: JSON.stringify(products),
});

module.exports.handler = async event => {
  const { productId } = event.pathParameters || {};

  if (!productId) {
    return handleResponse({ message: "There is no product with such ip" }, 400);
  }

  const product = products.find(({ id }) => id === productId);

  if (!product) {
    return handleResponse({ message: "There is no such product" }, 400);
  }

  return handleResponse({ ...product }, 200);
};