const Koa = require('koa');
const Static = require('koa-static');
const views = require('koa-views');
const router = require('./routers/router');
const body = require('koa-body');
const logger = require('koa-logger');
const {join} = require('path');
const session = require('koa-session');
//生成实例
const app = new Koa;
//签名密钥
app.keys = ["物联网实验室"];
//为session配置对像
const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 36e5,
    // autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /**刷新时间 (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

// const router = new Router;
//配置session
app.use(session(CONFIG , app));
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
app.use(router.routes()).use(router.allowedMethods());

app.listen(3003, () => {
    console.log("成功 , 3003端口");
});