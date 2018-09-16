const Router = require('koa-router');
//拿到操作表的对象
const user = require('../control/user');
const article = require('../control/article');
const comment = require('../control/comment');
const admin = require('../control/admin');
const upload = require('../util/upload');
const router = new Router;

// 主页设计
router.get("/", user.keepLog, article.getList);
//用户 注册 登录 退出 界面
// router.get("/user/:fy", async (ctx) => {
//     ctx.body = ctx.params.fy;
// });
router.get(/^\/user\/(?=reg|login)/, async (ctx) => {
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
//文章分页
router.get('/page/:id', article.getList);
//个人中心
router.get('/article/:id', article.details);
// 发表评论
router.post('/comment', user.keepLog, comment.save);
//个人中心
router.get('/admin/:id' , user.keepLog , admin.index);
//用户上传
router.post('/upload' , user.keepLog, upload.single('file') , user.upload);
//获取评论
router.get('/user/comments' , user.keepLog , comment.comList);
//删除评论
router.del('/comment/:id' , user.keepLog , comment.del);
//获取文章
router.get('/user/articles' , user.keepLog , article.artList);
// 删除文章
router.del('/article/:id' , user.keepLog , article.del);


//返回404
router.get("*", async ctx => {
    await ctx.render('404', {
        title: 404
    })
});

module.exports = router;