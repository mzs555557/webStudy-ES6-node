const {db} = require("../Schema/config");
const encrypt = require('../util/encrypt');

const Article = require('../Models/article');
const User = require('../Models/user');
const Comment = require('../Models/comment');


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
    //title ? content ? 文章作者
    data.author = ctx.session.uid;
    data.commentNum = 0;

    await new Promise((resolve, reject) => {
        new Article(data)
            .save((err, data) => {
                if (err) return reject(err);

                User.update({_id: data.author}, {$inc: {articleNum: 1}}, err => {
                    if (err) return console.log(err);
                });

                resolve(data);
            })
    })
        .then(async () => {
            ctx.body = {
                msg: "发表成功",
                status: 1
            }
        })
        .catch(async () => {
            ctx.body = {
                msg: "发表失败",
                status: 0
            }
        });

};

//获取文章列表
exports.getList = async ctx => {
    //id 对应文章列表
    let page = ctx.params.id || 1;
    page--;
    const maxNum = await Article.estimatedDocumentCount((err, num) => {
        err ? console.log(err) : num;
    });
    const artList = await Article
        .find()
        .sort('-created')
        .skip(page * 5)
        .limit(5)
        //拿数据
        .populate({
            path: 'author',
            select: '_id username avatar'
        })//连表查询
        .then(data => data)
        .catch(err => {
            console.log(err);
        });
    //加了头像
    await ctx.render("index", {
        title: 666,
        session: ctx.session,
        artList: artList,
        maxNum
    });
};
//文章详情
exports.details = async ctx => {
    //  取文章id
    const _id = ctx.params.id;

    const article = await Article
        .findById(_id)
        .populate("author", 'username')
        .then(data => data);


    const comment = await Comment
        .find({article: _id})
        .sort("-created")
        .populate("from", "username avatar")
        .then(data => data)
        .catch(err => {
            console.log(err);
        });

    await ctx.render("article", {
        title: article.title,
        article,
        comment,
        session: ctx.session
    })
};
exports.artList = async ctx => {
    const uid = ctx.session.uid;

    const data = await Article.find({author: uid});
    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
};
exports.del = async ctx => {

    const _id = ctx.params.id;

    //删除文章
    let res = {
        state:1,
        message:'成功'
    };

    /*
    await Article.deleteOne({_id}).exec(err => {
         if (err) {
             res = {
                 state:0,
                 message:'失败'
             }
         } else {

         }
     })
     */
    await Article.findById(_id)
        .then(data => data.remove())
        .catch(err => {
            res = {
                state: 0,
                message:err
            }
        });
    ctx.body = res;

};