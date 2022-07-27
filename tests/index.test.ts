import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Context } from 'aws-lambda/handler';
import httpErrors from 'http-errors';
import { httpPathRouteHandler } from '../src';
import { makeEvent } from './event.mock';

const CONTEXT = {} as unknown as Context;

describe('Routing', () => {
  const handler = middy<APIGatewayProxyEvent, APIGatewayProxyResult>().handler(
    httpPathRouteHandler([
      {
        method: 'PUT',
        path: '/api/shows/:show',
        handler: async (event) => {
          const show = event.pathParameters?.show ?? 'undefined';
          return {
            statusCode: 200,
            body: `/api/shows/${show}`,
          };
        },
      },
      {
        method: 'GET',
        path: '/api/shows/:show/:details',
        handler: async (event) => {
          const show = event.pathParameters?.show ?? 'undefined';
          const details = event.pathParameters?.details ?? 'undefined';
          return {
            statusCode: 200,
            body: `/api/shows/${show}/${details}`,
          };
        },
      },
      {
        method: 'GET',
        path: '/api/shows',
        handler: async () => {
          return {
            statusCode: 200,
            body: '/api/shows',
          };
        },
      },
    ]),
  );

  it('raises 404 when no route found', async () => {
    await expect(() => {
      return handler(makeEvent('GET', '/not-exist'), CONTEXT);
    }).rejects.toThrow(new httpErrors.NotFound());
  });
  it('raises 404 for unhandled method', async () => {
    await expect(() => {
      return handler(makeEvent('POST', '/api/shows'), CONTEXT);
    }).rejects.toThrow(new httpErrors.NotFound());
  });
  it('handles static routes', async () => {
    const result = await handler(makeEvent('GET', '/api/shows'), CONTEXT);

    expect(result.body).toBe('/api/shows');
  });
  it('provides param for dynamic route', async () => {
    const result = await handler(makeEvent('PUT', '/api/shows/house'), CONTEXT);

    expect(result.body).toBe('/api/shows/house');
  });
  it('provides params for dynamic route', async () => {
    const result = await handler(makeEvent('GET', '/api/shows/house/cast'), CONTEXT);

    expect(result.body).toBe('/api/shows/house/cast');
  });
});
