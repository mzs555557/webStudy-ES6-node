const Koa = require('koa');
const app = new Koa;
//////

const cors = require('@koa/cors');
app.use(cors());
//////
app.use(async ctx => {
    ctx.body = {
        user: "xuanchen",
        pwd:123456
    }
});
app.listen(3000);
console.log("程序已经启动,监听3000");