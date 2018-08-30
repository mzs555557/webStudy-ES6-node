
const Koa = require('koa');
const app = new Koa;

app.use(async ctx =>{
    const callback = ctx.query.callback;
    ctx.type = 'text/javascript';
    ctx.body = `${callback({})}`;
    console.log(ctx.body);
});

app.listen(3000);


