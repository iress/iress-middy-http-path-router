import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Handler } from 'aws-lambda/handler';
import { APIGatewayProxyEventPathParameters } from 'aws-lambda/trigger/api-gateway-proxy';
import httpErrors from 'http-errors';
import RouteRecognizer from 'route-recognizer';

type Route = {
  method: string;
  path: string;
  handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>;
};

type RouterMatch = {
  isDynamic: boolean;
  params: APIGatewayProxyEventPathParameters;
  handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>;
};

const registerRoute =
  (methodRouter: Map<string, RouteRecognizer>) =>
  (route: Route): void => {
    const method = route.method.toUpperCase();
    let router = methodRouter.get(method);
    if (router == null) {
      router = new RouteRecognizer();
      methodRouter.set(method, router);
    }
    router.add([
      {
        path: route.path,
        handler: route.handler,
      },
    ]);
  };

const findMatchingRoute = (methodRouter: Map<string, RouteRecognizer>, event: APIGatewayProxyEvent): RouterMatch => {
  const router = methodRouter.get(event.httpMethod.toUpperCase());
  if (router == undefined) {
    throw new httpErrors.NotFound();
  }

  const matchedRoutes = router.recognize(event.path);
  const route = matchedRoutes?.length ? matchedRoutes[0] : undefined;
  if (route == null || route.handler == null) {
    throw new httpErrors.NotFound();
  }
  return route as RouterMatch;
};

const updateEventPathParameters = (route: RouterMatch, event: APIGatewayProxyEvent): APIGatewayProxyEvent => {
  if (!route.isDynamic) {
    return event;
  }

  return {
    ...event,
    pathParameters: {
      ...(event.pathParameters || {}),
      ...route.params,
    },
  };
};

const httpPathRouteHandler = (routes: Route[]): Handler<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const methodRouter: Map<string, RouteRecognizer> = new Map();
  routes.forEach(registerRoute(methodRouter));

  return (event, context, callback): void | Promise<APIGatewayProxyResult> => {
    const route = findMatchingRoute(methodRouter, event);
    const updatedEvent = updateEventPathParameters(route, event);

    return route.handler(updatedEvent, context, callback);
  };
};

export { httpPathRouteHandler, Route };
