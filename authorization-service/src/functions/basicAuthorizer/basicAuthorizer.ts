const { GITHUB_ACCOUNT_LOGIN, TEST_PASSWORD } = process.env;

export enum Effect {
  Allow = 'Allow',
  Deny = 'Deny'
}

const generatePolicy = (principalId, effect, resource) => (
  {
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
  }
);

const basicAuthorizer = (event, _context, callback) => {
  const headers = event?.headers || {};
  /** Check if the Authorization header is present in the request.*/
  if (!headers.Authorization) {
    return callback('Unauthorized', { statusCode: 401 });
  }

  /** Extract the credentials from the Authorization header.*/
  const authHeader = headers.Authorization;
  const [, credentials] = authHeader.split(' ');
  const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');

  /** Check if the credentials match the expected format: 'username:password'.*/
  const [username, password] = decodedCredentials.split(':');

  /** Verify if the provided credentials match your environment variables.*/
  const isAuthorized = (username === GITHUB_ACCOUNT_LOGIN && password === TEST_PASSWORD);
  const effect = isAuthorized ? Effect.Allow : Effect.Deny;
  const authorizationText = isAuthorized ? 'Authorized' : 'Unauthorized';
  return callback(authorizationText, generatePolicy(username, effect, event.methodArn));
};

export { basicAuthorizer };
