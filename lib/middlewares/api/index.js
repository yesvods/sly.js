import db, {mockKey} from '../../db';
import Route from 'route-parser';
import _ from 'lodash';
import Mock from 'mockjs';
import faker from 'faker';

//ES6 template format
_.templateSettings.interpolate = /\${([\s\S]+?)}/g;

const pathKey = 'jsonServerPathKey';
export default async (ctx, next) => {
  await next();
  const {path} = ctx;
  const mockApi = db(mockKey);
  
  const api = db(mockKey).find(api => {
    //without pathKey
    let routePath = api[pathKey];
    if(_.isEmpty(routePath) || !_.isString(routePath)) return false;
    
    //without data key
    if(!api.data || !_.isPlainObject(api.data) || _.isEmpty(api.data)) return false;

    //not match
    const route = new Route(routePath);
    const matchResult = route.match(path);
    
    if(_.isBoolean(matchResult)&&!matchResult) return false;

    return true;
  })

  if(!_.isEmpty(api)){
    //get match result
    const routePath = api[pathKey];
    const route = new Route(routePath);
    const matchResult = route.match(path);

    //complile template
    const compliled = _.template(JSON.stringify(api.data));
    let mockTmp = compliled({
      ...matchResult,
      faker,
    });
    mockTmp = JSON.parse(mockTmp);

    //generate data
    const genBody = Mock.mock(mockTmp);
    ctx.body = genBody;
  }
}