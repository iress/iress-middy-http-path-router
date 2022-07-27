import { APIGatewayProxyEvent } from 'aws-lambda';

const baseEvent: APIGatewayProxyEvent = {
  httpMethod: '',
  path: '',
  body: '',
  headers: {
    'content-type': 'application/json',
  },
  multiValueHeaders: {
    'content-type': ['application/json'],
  },
  isBase64Encoded: false,
  pathParameters: {},
  queryStringParameters: {},
  multiValueQueryStringParameters: {},
  stageVariables: {},
  resource: '/{proxy+}',
  requestContext: {
    accountId: '123456789012',
    apiId: 'wt6mne2s9k',
    authorizer: null,
    protocol: 'HTTP',
    httpMethod: '',
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: '',
      cognitoAuthenticationType: '',
      cognitoIdentityId: '',
      cognitoIdentityPoolId: '',
      principalOrgId: null,
      sourceIp: '192.168.100.12',
      user: '',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36 OPR/39.0.2256.48',
      userArn: '',
    },
    path: '',
    stage: 'test',
    requestId: '41b45ea3-70b5-11e6-b7bd-69b5aaebc7d9',
    requestTimeEpoch: 123,
    resourceId: 'us4z18',
    resourcePath: '/{proxy+}',
  },
};

export const makeEvent = (httpMethod: string, path: string): APIGatewayProxyEvent => {
  return {
    ...baseEvent,
    path,
    httpMethod,
    requestContext: {
      ...baseEvent.requestContext,
      path,
      httpMethod,
    },
  };
};
