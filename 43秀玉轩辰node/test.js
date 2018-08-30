
// const obj = require("./index");
const koa = require("koa");
// console.log(obj);
//AMD 异步
const app = new koa();
app.use(async (ctx)=>{
    ctx.body = "后台返回数据"
});
app.listen(3000);
// process.nextTick(()=>{
//     console.log(1);
// });
//nextTick > Promise.then > setTimeOut > setImmediate