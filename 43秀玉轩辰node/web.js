const http = require('http');

const server = http.createServer((req , res)=>{
    const obj = {
        a : 1,
        b : 2
    };
    res.setHeader("Access-Control-Allow-Origin",'*');
    res.writeHead(200 , {'Content-Type': 'text/html;charset=utf-8'});

    res.write(JSON.stringify(obj));
    res.end();
});
server.listen(3000 , ()=>{
    console.log("服务器在监听3000端口");
});