// const fs = require('fs');
//
// // fs.readFile('./1', 'utf8' ,(err , data )=>{//错误对象永远排在第一位//所有数据完全读取在内存
// //     console.log(err , data);
// // });
// // fs.exists('./1' , exists => {
// //     console.log(exists);
// // });
// // fs.readFile('./index.js' , 'utf8' , ( err , data )=>{
// //     console.log(err , data);
// // });
// // fs.readdir('../42秀玉轩辰jquery' , 'utf8' , (err  , data) =>{
// //     console.log(err , data);
// // });
// // fs.open('./1' , 'r' , (err , fd) =>{
// //     if (err) throw err ;
// //     fs.fstat(fd , (err , stat )=>{
// //         if (err) throw err;
// //         fs.close(fd , (err) => {
// //             if (err) throw err;
// //         })
// //     })
// // });
//
// const read = fs.createReadStream('1');//读取
//
// read.setEncoding("utf8");
// // read.resume();//释放
// read.on("data", (...r)=>{
//     console.log(r);
// });
// read.on("end" , function () {
//     console.log("read over");
// });


const http = require('http');
const server = http.createServer((req,res)=>{
    res.write("adasd");
    res.end();
});

