const {db} = require("../Schema/config");
const encrypt = require('../util/encrypt');

const CommentSchema = require('../Schema/comment');
const UserSchema = require('../Schema/user');
const ArticleSchema = require('../Schema/article');
//引入collections
const User = db.model("users", UserSchema);
const Article = db.model('articles', ArticleSchema);
const Comment = db.model("comments", CommentSchema);


exports.save = async ctx => {
    let message = {
        status: 0,
        msg: "登录发表"
    };

    //验证是否登录
    if (ctx.session.isNew) return ctx.body = message;
    //用户登录
    const data = ctx.request.body;

    data.from = ctx.session.uid;

    await new Promise((resolve, reject) => {
        new Comment(data)
            .save((err, data) => {
                if (err) reject(err);
                resolve(data);
            })
    })
        .then(async () => {
            ctx.body = {
                status: 1,
                msg: "评论成功"
            };
            //更新评论计数器 //用路由返回居然有Bug  C!
            Article.updateOne({_id: data.article}, {$inc: {commentNum: 1}}, err => {
                if (err) return console.log(err);
            });
            User.updateOne({_id: data.from}, {$inc: {commentNum: 1}}, err => {
                if (err) return console.log(err);
            })
        })
        .catch(async () => {
            ctx.body = {
                status: 0,
                msg: '失败'
            }
        })
};

//后台,获取评论数据
exports.comList = async ctx => {
    const uid = ctx.session.uid;

    const data = await Comment.find({from: uid}).populate("article", "title");
    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
};
//后台 删除评论
exports.del = async ctx => {
    //获取数据
    /* const commentId = ctx.params.id;
     const articleId = ctx.request.body.articleId;
     const uid = ctx.session.uid;
     let isOk = true;
     //计数器减一
     await Article.updateOne({id: articleId}, {$inc: {commentNum: -1}});
     await User.updateOne({id: uid}, {$inc: {commentNum: -1}});

     await Comment.deleteOne({_id: commentId}, err => {
         if (err) {
             isOk = false;
         }
         if (isOk) {
             ctx.body = {
                 state: 1,
                 message: '成功'
             }
         }
     })
     */
    let res = {
        state: 1,
        message: '成功'
    };
    const commentId = ctx.params.id;
    // Comment.findByIdAndRemove(commentId).exec();
    Comment.findById(commentId).then(data => {
        data.remove();
    }).catch(() => {
        res = {
            state : 0,
            message: '失败'
        }
    });
    new Comment({}).remove();
    ctx.body = res;

};