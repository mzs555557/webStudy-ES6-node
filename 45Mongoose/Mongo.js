const mongoose = require('mongoose');

const db = mongoose.createConnection('mongodb://localhost:27017/fengyu', {useNewUrlParser: true});
//用原生es6的promise取代mongoose自实现的promise
mongoose.promise = global.promise;
//操作之前,使用Schema设置字段的数据类型
db.on("error", console.log.bind(console, "数据库连接失败"));
db.on("open", () => {
    console.log('数据库连接成功');
});
//连接成功 , 操作数据库
const Schema = mongoose.Schema;

const JsSchema = new Schema({
    name: String,
    age: Number,
    sex: {
        type: String,
        default: '男'
    }
}, {
    versionKey: false,
});
const Js = db.model("javascript", JsSchema);
const data = [{
    name: "dashuaibi",
    age: 30,
},
    {
        name: '小清',
        age: 19,
        sex: '女'
    }];
data.forEach((v) => {
    const d1 = new Js(v);
    d1.save().then(res => {
        console.log(res);
    }).catch(error => {
        console.log(error);
    });
});
