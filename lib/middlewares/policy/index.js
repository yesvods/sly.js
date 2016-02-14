import _ from 'lodash';
import passport from 'koa-passport';

export default async (ctx, next) => {
  if(ctx.path == '/'){
    console.log('ctx')
    passport.authenticate('local', async (user, info, status) => {
      if(user === false){
        console.log('auth false')
        ctx.status = 401;
        ctx.body = { auth: false }
        return ;
      }
      await next();
    })(ctx, next);
  }else {
    await next();
  }
}