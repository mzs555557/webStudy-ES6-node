const http = require('http');

const server = http.createServer((req , res)=>{
    // res.writeHead(200 , { "Content-Type" : "text/html;charset=utf-8" });//等号之间禁止空格
    // res.write("阿斯达多啊所");
    // res.end(req.url);
    if (req.method === "GET") {
        res.writeHead(200 , {"Content-Type" : "text/html;charset=utf-8"});
        switch (req.url) {
            case "/home":
                
            break;
        }
    }

});

server.listen(3000);