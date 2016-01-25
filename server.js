"use strict";
import koa from 'koa';
import convert from 'koa-convert';
import bodyParser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import cors from 'koa-cors';
import _ from 'lodash';
import path from 'path';

import mock from './lib/middlewares/mock';
import api from './lib/middlewares/api';

const app = new koa();
app.use(convert(cors()));
app.use(async (ctx, next) => {
  let start = _.now();
  await next();
  const ms = _.now() - start;
  console.log('%s %s - %s', ctx.method, ctx.url, ms);
})

const staticPath = path.resolve(__dirname, './lib/client');
app.use(convert(koaStatic(staticPath)));
app.use(convert(bodyParser()));

app.use(mock);
app.use(api);

app.listen(process.env.PORT || 3003);
