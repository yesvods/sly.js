import passport from 'koa-passport';
import LocalStrategy from 'passport-local';

const sampleUser = {id: 1, username: 'test'};
passport.serializeUser((user, done) => done(null, sampleUser.id));
passport.deserializeUser((id, done) => done(null, user));

passport.use(new LocalStrategy.Strategy((username, password, done) => {
  if(username === 'test' && password === 'test'){
    done(null, sampleUser);
  }else {
    done(null, false);
  }
}));