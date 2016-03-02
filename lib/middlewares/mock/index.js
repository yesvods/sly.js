import db, {mockKey} from '../../db';
import uuid from 'node-uuid';
import _ from 'lodash';

export default async (ctx, next) => {
  const {body} = ctx.request;
  
  if(/\/mock\/add/.test(ctx.path)){
    if(_.isEmpty(body)){
      ctx.status = 200;
      return;
    }
    _.assign(body, {id: uuid()});
    add(body);
    ctx.status = 200;
  }else if(/\/mock\/remove/.test(ctx.path)){
    removeById(body.id);
    ctx.status = 200;
  }else if(/\/mock\/update/.test(ctx.path)){
    updateById(body);
    ctx.status = 200;
  }else if(/\/mock/.test(ctx.path)){
    ctx.body = db(mockKey).value();
    ctx.status = 200;
  }
  await next();
}

function add(obj){
  db(mockKey).push(obj);
}

function removeById(id){
  db(mockKey).remove({id});  
}

function updateById(obj){
  let item = db(mockKey).find({jsonServerPathKey: obj.jsonServerPathKey});
  item = {
    ...item,
    data: obj.data
  }
  db(mockKey)
    .chain()
    .find({id: item.id})
    .assign({
      ...item,
    })
    .value()
}