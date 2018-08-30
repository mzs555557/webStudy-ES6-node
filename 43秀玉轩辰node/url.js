const { URL } = require('url');
// const URL = require('url').URL;
const qs = require('querystring');
// const cryto = require('crypto');
// const key = "dalkjdlasd";
// const obj = cryto.createHash('md5');
// obj.update(key);
// const password = obj.digest('hex');
// console.log(password);

const url = new URL('https://www.google.com.hk/search?safe=strict&q=%E7%8E%9B%E4%B8%BD%E4%BA%9A%C2%B7%E5%87%AF%E8%8E%89+triumphant+(the+new+iberican+league+radio)&stick=H4sIAAAAAAAAAONgFuLRT9c3LDYwLc7KzstWgvFKzAwz0rUkglKT84tSMvPSnXNKi0tSi4IzU1LLEyuLAeirZxk4AAAA&sa=X&ved=2ahUKEwjM8bj-yv_cAhWIOnAKHakZAdQQxA0wCXoECAgQMg&biw=1920&bih=943');
console.log(qs.parse(url.search.slice(1)));
console.log(JSON.stringify(url));
