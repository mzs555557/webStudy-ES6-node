
/*process.nextTick(()=>{
    console.log('nextTick 1');
});

setImmediate(()=>{
    console.log("immediate 1");
});
process.nextTick(() =>{
    console.log('nextTick 2');
});
setImmediate(()=>{
    process.nextTick(()=>{
        console.log('nextTick 3');
    });
    console.log("immediate 2");
});
console.log('正常代码 1');
// macro-tasks

let timer = null;
setTimeout(()=>{
    console.log(3);
},0);
timer = setInterval(function () {
    console.log(1);
    clearInterval(timer)
},0);
*/


