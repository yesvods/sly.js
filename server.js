"use strict";
import fs from 'fs';
import koa from 'koa';
import convert from 'koa-convert';
import bodyParser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import session from 'koa-session';
import passport from 'koa-passport';
import cors from 'koa-cors';
import route from 'koa-route';
import _ from 'lodash';
import path from 'path';

import policy from './lib/middlewares/policy';
import mock from './lib/middlewares/mock';
import api from './lib/middlewares/api';

import './lib/strategy';

const app = new koa();
app.use(convert(cors()));
app.use(async (ctx, next) => {
  let start = _.now();
  await next();
  const ms = _.now() - start;
  console.log('%s %s - %s', ctx.method, ctx.url, ms);
})

app.keys = ['json-server'];
app.use(convert(session(app)));
app.use(convert(bodyParser()));

app.use(passport.initialize());
app.use(passport.session());
app.use(policy);

app.use(async (ctx, next) => {
  if(ctx.path === '/'){
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./lib/client/index.html');
  }
  await next();
})
const staticPath = path.resolve(__dirname, './lib/client');
app.use(convert(koaStatic(staticPath)));

app.use(mock);
app.use(api);

app.listen(process.env.PORT || 3003);
