const http = require('https');
const koa = require('koa');
const app = new koa;
app.use(async ctx => {
    let arr = [];
    let biliurl = 'https://bangumi.bilibili.com/media/web_api/search/result?season_version=-1&area=-1&is_finish=-1&copyright=-1&season_status=-1&season_month=-1&pub_date=-1&style_id=-1&order=3&st=1&sort=0&page=1&season_type=1&pagesize=20';
    await new Promise(resolve => {
        http.get(biliurl, res => {
        let data = '';
        res.on('data', chunk => {
            data += chunk;
        });
        res.on('end',  async function () {
                let json = JSON.parse(data);
                arr = json.result.data;
                console.log(1);
                resolve(arr);
            });
        }).on('error', () => {
            console.log('获取数据错误');
        });
    });
    console.log(2);
    ctx.body = arr;
});
app.listen(3000);