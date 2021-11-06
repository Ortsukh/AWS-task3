
const dotenv = require('dotenv');
dotenv.config();
const generatePolicy = (principalId, resource, effect) => ({
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  });


module.exports.handler = async (event, ctx, callback) => {
    console.log('event', event);
  
    try {
      const { authorizationToken, type, methodArn } = event;
  
      if (type !== 'TOKEN') {
        callback('Unauthorized');
      }
  
      let encodeToken = authorizationToken.split(' ')[1];
      console.log('token', encodeToken);
  
      const bufferValue = Buffer.from(encodeToken, 'base64');
      const passToken = bufferValue.toString('utf-8').split(':');
      console.log(passToken);
      const  password = passToken[1].trim();
      const storedUserPassword = process.env.token;
      const isPasswordCorrect = storedUserPassword && storedUserPassword === password;
      const effect = isPasswordCorrect ? 'Allow' : 'Deny';
      const policy = generatePolicy('user', methodArn, effect);
  
      callback(null, policy);
    } catch (error) {
      console.log(error, error.message);
    }
  };