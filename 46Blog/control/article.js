const {db} = require("../Schema/config");
const ArticleSchema = require('../Schema/article');
const encrypt = require('../util/encrypt');

const Article = db.model("article", ArticleSchema);
//文章发表页
exports.addPage = async ctx => {
    await ctx.render('add-article', {
        title: 666,
        session: ctx.session
    });
};
//文章的发表
exports.add = async ctx => {
    if (ctx.session.isNew) {
        return ctx.body = {
            msg: '用户未登陆',
            status: 0
        }
    }
    const data = ctx.request.body;
    //title ? content ?
    data.author = ctx.session.username;

    await new Promise((resolve, reject) => {
        new Article(data)
            .save((err, data) => {

                if (err) return reject(err);
                console.log(1);
                resolve(data);
            })
    })
        .then(async () => {
            console.log(2);
            ctx.body = {
                msg: "发表成功",
                status: 1
            }
        })
        .catch(async err => {
            console.log(3);
            ctx.body = {
                msg: "发表失败",
                status: 0
            }
        });

};