const {Schema} = require('./config');
const ObjectId = Schema.Types.ObjectId;
const ArticleSchema = new Schema({
    title: String,
    content: String,
    author: {
        type: ObjectId,
        ref: "users"
    },//关联users表
    tips: String,
    commentNum: Number
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created"
    },
});
//设置remove
ArticleSchema.post('remove', doc => {
    const Comment = require('../Models/comment');
    const User = require('../Models/user');

    const {_id: artId, author: authorId} = doc;
    User.findByIdAndUpdate(authorId, {$inc: {articleNum: -1}}).exec();
    Comment.find({article: artId}).then(data => {
        data.forEach(v => v.remove())
    })
});

module.exports = ArticleSchema;