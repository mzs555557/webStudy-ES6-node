const koa = require('koa');
const request = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const app = new koa;

app.use(async ctx => {
    let arr = [];
    const data = await new Promise(resolve => {
        request
            .post('https://www.shiguangkey.com')
            .end((err, res) => {
                // Calling the end function will send the request
                //分析网页结构
                const data = res.text;
                const $ = cheerio.load(data);
                $(".course-item").each((i, v) => {
                    let $v = $(v);
                    // console.log($v('.ictxt').text().trim());//获取标签内容
                    // console.log($v('.item-txt').text().slice(5).replace("人" , ""));
                    console.log($v.find("a.cimg").prop('href'));
                    const obj = {
                        img: $v.find("img").prop('src'),
                        title: $v.find("a.ictxt").text().trim(),
                        src: path.join('https://www.shiguangkey.com/', $v.find('a.cimg').prop('href'))
                    };
                    arr.push(obj);
                });
                resolve(arr);
            });
    });
    ctx.body = JSON.stringify(arr);
});

app.listen(3000);

// const koa = require('koa');
// const cheerio = require('cheerio');
// const request = require('superagent');
// const { join } = require('path');
// const app = new koa;
// request
//     .get('https://www.bilibili.com/v/douga/')//https://www.bilibili.com/v/douga/
//     .end((err, res) => {
//         const data = res.text;
//         const $ = cheerio.load(data);
//         $('.spread-module').each((i , v) => {
//             let $v = $(v);
//             console.log($v)
//         })
//     });
// request('https://www.shiguangkey.com/' , function (error , response ,body) {
//     const $ = cheerio.load(body);
//     console.log($.html());
// });
