// const assert = require('assert');
// // assert(false , "如果第一个参数不为true,字符串会报错");
//
// assert.deepEqual(1 , 1 , "参数");

// const crypto = require('crypto');
//
// const KEY = "fengyu";
// const obj = crypto.createHash("md5");
// obj.update(KEY);
// const pwd = obj.digest("hex");
// console.log(pwd);
const cert = require('crypto').Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
