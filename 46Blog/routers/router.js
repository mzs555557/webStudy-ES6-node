const Router = require('koa-router');
const router = new Router;

// 主页设计
router.get("/", async (ctx) => {
    await ctx.render("index.pug", {
        title: 666,
    })
});
module.exports = router;