const Article = require('../Models/article');
const User = require('../Models/user');
const Comment = require('../Models/comment');

const {join} = require('path');
const fs = require('fs');

const encrypt = require('../util/encrypt');

exports.index = async ctx => {
    if (ctx.session.isNew) {
        return await ctx.render('404' , {
            title:404
        });
    }

    const id = ctx.params.id;

    const arr = fs.readdirSync(join(__dirname , '../views/admin'));

    let flag = false;
    // console.log(arr);
    arr.forEach(v => {
        const name = v.replace(/^(admin-)|(\.pug)$/g,"");
        if (name === id){
            flag = true;
        }
    });
    if (flag) {
        await ctx.render('./admin/admin-'+id ,{
            role: ctx.session.role
        })
    } else {
        ctx.status = 404;
        await ctx.render('404',{
            title:404
        })
    }
};