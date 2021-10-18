
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
  
      let credentialsChunk = authorizationToken.split(' ')[1];
      console.log('token', credentialsChunk);
  
      const credentialsBuffer = Buffer.from(credentialsChunk, 'base64');
      const plainCredentials = credentialsBuffer.toString('utf-8').split(':');
      const  password = plainCredentials[0].trim();
      const storedUserPassword = process.env.Ortsukh;
      const isPasswordCorrect = storedUserPassword && storedUserPassword === password;
      const effect = isPasswordCorrect ? 'Allow' : 'Deny';
      const policy = generatePolicy('user', methodArn, effect);
  
      callback(null, policy);
    } catch (error) {
      console.log(error, error.message);
    }
  };