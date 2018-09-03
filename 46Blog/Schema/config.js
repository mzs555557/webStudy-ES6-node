//连接数据库 倒出
const mongoose = require('mongoose');
const db = mongoose.createConnection("mongodb://localhost:27017/blogproject", {
    useNewUrlParse: true
});
mongoose.promise = global.promise;
//取出Schema

// 连接失败
db.on("error", () => {
    console.log("数据库连接失败");
});
//连接成功
db.on("open", () => {
    console.log("连接成功");
});
const Schema = mongoose.Schema;
module.exports = {
    db,
    Schema
};