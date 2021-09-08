
const  products  = require('../productList.json');
console.log(products);
handleResponse = (products = {}, status = 200) => ({
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: status,
    body: JSON.stringify(products),
  });

module.exports.handler = async event => handleResponse(products);