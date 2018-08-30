const koa = require('koa');
const cheerio = require('cheerio');
const request = require('superagent');
const {join} = require('path');
const app = new koa;
app.use(async ctx => {
    let arr = [];
    for (let num = 1; num < 20; num++) {

        await new Promise(resolve => {
            request
                .get(`https://book.douban.com/tag/%E5%A5%87%E5%B9%BB?start=${num * 20}`)//https://www.bilibili.com/v/douga/
                .end((err, res) => {
                    const data = res.text;
                    const $ = cheerio.load(data);
                    $('#subject_list > .subject-list > .subject-item').each((i, v) => {
                        let $v = $(v);
                        let obj = {
                            author: $v.find('.info > h2 > a').prop('title').trim(),
                            Introduce: $v.find('.info > p').text().trim(),
                            evaluation: $v.find('.rating_nums').text().trim(),
                            url: $v.find('.pic > .nbg').prop('href').trim()
                        };
                        arr.push(obj);
                        console.log(num);
                        resolve(JSON.stringify(arr));
                    })
                });
        });
    }
    ctx.body = arr;
});

app.listen(3003);