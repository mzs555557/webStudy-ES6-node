//连接数据库 倒出
const mongoose = require('mongoose');
//取出Schema
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://127.0.0.1:27017/blogproject" ,{
    useNewUrlParser: true
});
const db = mongoose.connection;
//连接成功

db.on("connected", ()=>{
    console.log("mongodb数据库连接成功")
});
// 连接失败

db.on("error", function (error) {
    console.log("连接失败" ,error);
});
const Schema = mongoose.Schema;
module.exports = {
    db,
    Schema
};