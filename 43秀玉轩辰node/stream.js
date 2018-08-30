const fs = require('fs');
const Readable = require('stream').Readable;
const rs = new Readable;

rs.push("1");
rs.push("2");
rs.push(null);

rs.pipe(process.stdout);
const read = fs.createReadStream('1');
const write = fs.createWriteStream('2');
// read.setEncoding('utf8');
read.pipe(write);
// read.on("data" ,data=>{
//     console.log(data);
// });
//
// read.on("end" , ()=>{
//     console.log("读取结束");
// });