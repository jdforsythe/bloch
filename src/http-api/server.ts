import * as Koa from 'koa';
import * as Router from '@koa/router';

import { getJsonBodyParseMiddleware, getAddChainToContextMiddleware } from './middleware';
import { Blockchain, Block, SignedTransaction } from '../chain/interface';

/**
 * Server configuration
 */
export interface ServerConfig {
  host: string;
  port: number;
  chain: Blockchain;
  controllers: {
    getBalance(): number;
    getBlocks(): Block[];
    getMempool(): SignedTransaction[];
    getPublicKey(): string;
    sendTransaction(dest: string, amount: number): void;
  };
}

/**
 * Starts up HTTP API and configures controllers
 */
export const listen = (cfg: ServerConfig, listenCallback: () => void) => {
  const app = new Koa();

  const router = new Router<{}, {}>();

  // middleware to add the chain to incoming requests
  router.use(getAddChainToContextMiddleware(cfg.chain));

  router.get('/balance', (ctx) => {
    const balance = cfg.controllers.getBalance();

    ctx.body = { balance };
  });

  router.get('/blocks', (ctx) => {
    const blocks = cfg.controllers.getBlocks();

    ctx.body = { blocks };
  });

  router.get('/mempool', (ctx) => {
    const pool = cfg.controllers.getMempool();

    ctx.body = { pool };
  });

  router.get('/address', (ctx) => {
    const address = cfg.controllers.getPublicKey();

    ctx.body = { address };
  });

  router.post('/transaction', getJsonBodyParseMiddleware<{ destAddress: string; amount: number }>(), (ctx) => {
    const { destAddress, amount } = ctx.request.body;

    const address = cfg.controllers.getPublicKey();

    if (address === destAddress) {
      return ctx.throw(400, new Error('Cannot send coins to yourself!'));
    }

    try {
      cfg.controllers.sendTransaction(destAddress, amount);

      return ctx.body = { success: true };
    }
    catch (ex) {
      return ctx.throw(400, ex);
    }
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  const { host, port } = cfg;

  return app.listen(port, host, listenCallback);
};
