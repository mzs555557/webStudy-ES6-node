const http = require('http');
const fs = require('fs');

let server = http.createServer();
server.listen(8080 , function () {
   console.log("Server is running port 3000")
});

let handRequest = function (req , res) {
    console.log('当前请求为:' + req.url);
    let url = request.url;
    res.writeHead(200 , {'Content-Type': 'text/html;charset=utf-8'});
    switch (url) {
        case '/index':
            fs.readFile('index.html','utf8',(err , data) => {
                if (err) throw err;
                res.end(data);
            });
            fs.write("<h1>index</h1>");
            break;
    }
};
server.on('request' , handRequest);