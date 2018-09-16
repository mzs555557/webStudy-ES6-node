
const encrypt = require('../util/encrypt');

const Article = require('../Models/article');
const User = require('../Models/user');
const Comment = require('../Models/comment');

//用户注册
exports.reg = async ctx => {
    const user = ctx.request.body;//注册的post数据
    const username = user.username;
    const password = user.password;
    await new Promise((resolve, reject) => {
        User.find({"username": username}, function (err, data) {
            if (err) return reject(err);
            //数据查询
            if (data.length !== 0) {
                return resolve("");
            }
            //用户名不存在 需要存在数据库
            let _user = new User({
                username: username,
                password: encrypt(password),
                commentNum: 0,
                articleNum: 0
            });
            _user.save((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        })
    })
        .then(async data => {
            if (data) {
                //注册成功
                await ctx.render("isOk", {
                    status: "注册成功"
                });
            } else {
                await ctx.render("isOk", {
                    status: "用户名已存在"
                });
            }
        })
        .catch(async err => {
            await ctx.render('isOk', {
                status: "注册失败,请重试"
            })
        })
};
//用户登录
exports.login = async ctx => {
    const user = ctx.request.body;
    const username = user.username;
    const password = user.password;
    await new Promise((resolve, reject) => {
        User.find({"username": username}, function (err, data) {
            if (err) return reject(err);

            if (data.length === 0) return reject("用户名不存在");

            if (data[0].password === encrypt(password)) {
                return resolve(data);
            }
            resolve("");
        })
    })
        .then(async data => {
            if (!data) {
                await ctx.render('isOk', {
                    status: "密码bu正确 登陆失败 GG"
                })
            }
            //用户 在 cookie 里设置登录界面
            ctx.cookies.set("username", username, {
                domain: "localhost",
                path: '/',
                maxAge: 36e5,
                httpOnly: true,//不让客户端访问
                overwrite: false,
                signed: true
            });
            // 用户 ID
            ctx.cookies.set("uid", data[0]._id, {
                domain: "localhost",
                path: '/',
                maxAge: 36e5,
                httpOnly: true,//不让客户端访问
                overwrite: false,
                signed: true
            });
            ctx.session = {
                username,
                uid: data[0]._id,
                avatar: data[0].avatar,
                role: data[0].role
            };
            await ctx.render('isOk', {
                status: "登录成功"
            })

        })
        .catch(async err => {
            await ctx.render('isOk', {
                status: "登录失败"
            })
        })
};
exports.keepLog = async (ctx, next) => {
    if (ctx.session.isNew) {
        if (ctx.cookies.get("username")) {
            let uid = ctx.cookies.get('uid');
            const avatar = await User.findById(uid).then(data => {data.avatar});
            ctx.session = {
                username: ctx.cookies.get('username'),
                uid,
                avatar
            }
        }
    }
    await next();
};
exports.logout = async ctx => {
    ctx.session = null;
    ctx.cookies.set("username", null, {
        maxAge: 0
    });
    ctx.cookies.set("uid", null, {
        maxAge: 0
    });
    //重定向
    ctx.redirect("/")
};
//头像上传
exports.upload = async ctx => {
    const filename = ctx.req.file.filename;

    let data ={};
    User.updateOne({_id: ctx.session.uid}, {$set: {avatar: "/avatar/" + filename}}, (err , res) => {
       if (err) {
           data = {
               status: 0,
               message: "上传失败"
           }
       } else {
           data = {
               status: 1,
               message: "上传成功"
           };
           console.log(res);
       }
        ctx.body = data;
    });

};