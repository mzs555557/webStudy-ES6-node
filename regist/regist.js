const express = require('express');
const events = require('events');
const emitter = new events.EventEmitter();
const app = express();
const path = require('path');
const mysql = require('mysql');
let dirname = __dirname;

app.use(express.static(path.join(__dirname , 'regist')));

app.get("/regist" , function (req , res) {
   let connection = mysql.createConnection({
       host: 'localhost',
       use: 'root',
       password:'891489656m',
       database:'node'
   });
    connection.connect();

    emitter.on("ok" , function () {
        return res.end("注册成功");
    });
    emitter.on("false" , function () {
        return res.end("注册失败,用户名已存在");
    });
    let sql = "insert into user (username,password,nickname) values(? , ? , ?)";
    let sqlValue = ["select * from user where username='"+req.query.username+"' and password='"+req.query.password+"'"];
    connection.query(sql , sqlValue , function (err) {
        if (err) {
            console.log(err.message);
        }
        emitter.emit("ok");
    });
    connection.end();
});
app.listen(8081);

app.get("/login" , function (req , res) {
   let connection = mysql.createConnection({
       host:"localhost",
       user:"root",
       password:"891489656m",
       database:"node"
   });
    connection.connect();
    let sql = "select * from user where username='"+req.query.username+"' and password='"+req.query.password+"'";
    connection.query(sql , function (err , result) {
        if (err) {
            res.end("登录失败");
            console.log(err);
        }
        if (result.length === 0) {
            res.end("用户名密码不正确");
        } else {
            res.end("登陆成功");
        }
    });
    connection.end();
});
