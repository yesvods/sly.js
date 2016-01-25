# Sly.js

## ~~One of the~~ Most powerful JSON mock server 
Build your mock server within **1 minute**, Powered by [KOA@2.0Alpha](https://github.com/koajs/koa), [Mock.js](https://github.com/nuysoft/Mock), [Faker](https://github.com/Marak/Faker.js), [SemanticUI](https://github.com/Semantic-Org/Semantic-UI), [ACE](https://github.com/ajaxorg/ace)

## Feature
* Build API online with few editing
* Mock flexible data format you like
* Flexible route parser
* Utilize param variable of path
* JSON validation

## [LiveDemo](https://sly-mock-server.herokuapp.com/)
## Usage

```javascript
//clone
//change to directory
> npm install && node index.js //that's all
```

And then open `http://localhost:3003` in your browser

## Example

### Simple
```javascript
//path
/people/:name 

//mock data
{
  "name": "jack"
}

//http://localhost:3003/people/jack
//output: "jack"
```


### Advanced

```javascript
//path
/people/:name 

//mock data
{
  "name": "people - ${name}"
}

//http://localhost:3003/people/jack
//output: "people - jack"
```

You can utilize all the param variable in mock data, `Mock` and `Faker` alse provided.

```javascript
//path
/people/:name 

//mock data
{
  "name": "people - ${faker.name.findName()}",
  "age": "${Mock.mock('@natural(60, 100)')}"
}

//http://localhost:3003/people/jack
//output: 
//  {
//    "name": "people - Marshall Pfannerstill",
//    "age": "94"
//  }
```

## License
MIT

