# iress-middy-http-path-router
`@iress/middy-http-path-router` is middleware for [Middy](https://middy.js.org/) 
that routes API Gateway events to handlers based on static and dynamic paths.
For dynamic paths it will include the parameters within the `event.pathParameters`.

## Install
```shell
npm install @iress/middy-http-path-router
# or
yarn add @iress/middy-http-path-router
```

## Usage
```typescript
import { httpPathRouteHandler, Route } from '@iress/middy-http-path-router';

const routes: Route[] = [{
  method: 'GET',
  path: '/api/hello/:name',
  handler: (event: APIGatewayProxyEvent): APIGatewayProxyResult => {
    return {
      statusCode: 200,
      body: event.pathParameters?.name ?? 'anonymous'
    }
  }
}];

const handler = middy()
  .handler(httpPathRouteHandler(routes));
```

## More about routing
The responsibility for recognising routes and parameters is handled by 
[route-recognizer](https://github.com/tildeio/route-recognizer).
