const path = require('path');

// console.log(__dirname);//绝对路径
// console.log(__filename);//绝对,到当前文件

console.log(path.join("a","b","./.."));
console.log(path.resolve(__filename,"path"));