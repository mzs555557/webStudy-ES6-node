/**
 *
 * @type {module.Application|*}
 * @author Ma ZS
 * @version v_1.0
 *
 */

const Koa = require('koa');
const views = require('koa-views');
const {join} = require('path');
const Router = require('koa-router');
//模块

const app = new Koa;
const router = new Router;
//建立路由
app.use(views(join(__dirname, "views"), {
    extension: 'pug'
}));
//获取
router.get("/" , async ctx =>{

   await ctx.render("index" , {flag:4});

});
//使用
app.
    use(router.routes())
    .use(router.allowedMethods());
//监听
app.listen(3000);