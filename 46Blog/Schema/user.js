const {Schema} = require('./config');

const UserSchema = new Schema({
    username: String,
    password: String,
    avatar: {
        type: String,
        default: '/avatar/default.jpg'
    },
    role: {
        type: String,
        default: 1
    },
    articleNum: Number,
    commentNum: Number
}, {
    versionKey: false
});
module.exports = UserSchema;