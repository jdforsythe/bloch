import { Request, Context, Next } from 'koa';
import { json } from 'co-body';
import { Blockchain } from '../chain/interface';

/**
 * New shape of the context with the parsed object in the request body
 */
export interface JsonBodyRequestContext<T> extends Context {
  request: Request & { body: T | undefined };
}

/**
 * Parse request bodies as JSON
 */
export const getJsonBodyParseMiddleware = <T>() => {
  return async (ctx: JsonBodyRequestContext<T>, next: Next): Promise<void> => {
    ctx.request.body = await json(ctx.req, { limit: '2mb', strict: true });

    if (!ctx.request.body) {
      ctx.status = 400; // Bad Request
      ctx.body = 'Bad Request';

      return;
    }

    return next();
  };
};

/**
 * Get middleware to add the chain to the context
 */
export const getAddChainToContextMiddleware = (chain: Blockchain) => {
  return async (ctx: Context, next: Next) => {
    ctx.state.chain = chain;

    return next();
  };
};
