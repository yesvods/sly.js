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
    console.log(body)
    removeById(body.id);
    ctx.status = 200;
  }else if(/\/mock\/update/.test(ctx.path)){
    updateById(body.id, body);
    ctx.status = 200;
  }else if(/\/mock/.test(ctx.path)){
    console.log(db(mockKey).value())
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

function updateById(id, obj){
  db(mockKey)
    .chain()
    .find({id})
    .assign({
      ...obj,id,
    })
    .value()
}