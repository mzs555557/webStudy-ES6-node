 /*
const events = require('events').EventEmitter;
class MyEmitter extends  events {}
const myEmitter = new MyEmitter();

const fn = () =>{
    console.log("异步回调");
};

setTimeout(()=>{
    myEmitter.emit("Fy");
} , 1000);
setTimeout(()=>{
    myEmitter.emit("someEvents");
},2000);
myEmitter.on("someEvents" , fn);
myEmitter.on("Fy",fn);
myEmitter.off("Fy",fn);
myEmitter.once("Fy",fn);
myEmitter.setMaxListeners(20);
console.log(myEmitter.getMaxListeners());
console.log(myEmitter.listeners("Fy"));
*/
 // const http = require('http');
 // http.createServer((req , res)=>{
 //
 // });

 const Koa = require('koa');
 const request = require('superagent');
 const app = new Koa;
 // app.use(async(ctx, next)=>{//context
 //     // console.log("中间1 ,接受");
 //     // await next();
 //     // console.log("中间1 ,响应");
 //     ctx.type = "html";
 //     ctx.body = ctx.url;
 // });//洋葱模型

 app.use(async (ctx , next) => {
    request.get()
 });
 app.listen(3000);