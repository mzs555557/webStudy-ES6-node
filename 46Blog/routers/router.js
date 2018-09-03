const Router = require('koa-router');
//拿到操作表的对象
const user = require('../control/user');
const article = require('../control/article');
const router = new Router;

// 主页设计
router.get("/", async (ctx) => {
    await ctx.render("index.pug", {
        title: 666,
        session: ctx.session
    })
});
//用户 注册 登录 退出 界面
// router.get("/user/:fy", async (ctx) => {
//     ctx.body = ctx.params.fy;
// });
router.get(/^\/user\/(?=reg|login)/, user.keepLog, async (ctx) => {
    const show = /reg$/.test(ctx.path);
    await ctx.render("register", {show})
});
//用户注册
router.post("/user/reg", user.reg);//路由配置
//用户登录 post
router.post("/user/login", user.login);
//用户退出
router.get("/user/logout", user.logout);
//文章页面
router.get("/article", user.keepLog, article.addPage);
//文章添加
router.post("/article", user.keepLog, article.add);
module.exports = router;