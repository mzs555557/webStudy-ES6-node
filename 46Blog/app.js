const Koa = require('koa');
const Static = require('koa-static');
const views = require('koa-views');
const router = require('./routers/router');
const body = require('koa-body');
const logger = require('koa-logger');
const {join} = require('path');

//生成实例
const app = new Koa;
// const router = new Router;
//注册日志模块
app.use(logger());
//配置koa-body处理请求数据
app.use(body());
//配置静态资源目录
app.use(Static(join(__dirname, 'public')));
//配置视图
app.use(views(join(__dirname, "views"), {
    extension: 'pug'
}));
//注册路由
app.use(router.routes());
app.listen(3000, () => {
    console.log("成功 , 3000端口");
});