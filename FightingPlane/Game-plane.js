;(function(){
    window.requestAnimationFrame = window.requestAnimationFrame || function (fn) {return setTimeout(fn,1000/60)};
    window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
    let   oLevel = document.getElementById('level'),
          oBox = document.getElementById('box'),
          oMap = document.getElementById('map'),
          oScore = document.getElementById("score"),
          oRe = document.getElementById("restart"),
          oBiuAll = document.getElementById('biuAll'),
          allReChild = oRe.children,
          biuAll = oBiuAll.children,
          boxOffsetTop = oBox.offsetTop,
          boxOffsetLeft = oBox.offsetLeft
    ;
    //初始选择难度界面的点击事件
    exe();//游戏初始化
    function exe() {
        let aP = oLevel.getElementsByTagName('p');
        for (let level in aP) {//获取难度等级
            (function (level) {
                aP[level].onclick = function (e) {//选择难度等级
                    e = e || window.event;
                    startGame(level ,{
                        x : e.clientX - boxOffsetLeft,
                        y : e.clientY - boxOffsetTop
                    });
                }
            })(level);
        }
        //restart按钮
        allReChild[2].onclick = function (e) {
            cancelAnimationFrame(oMap.bgTimer);
            oRe.style.display = "none";
            oLevel.style.display = "block";
            oScore.innerHTML = 0;
            oMap.innerHTML = "<div id='BiuAll'></div>";
            oBiuAll = document.getElementById("BiuAll");
            biuAll = oBiuAll.children;
        }
    }

    //隐藏与清理关卡
    function clearMap() {
        oLevel.style.display = "none";
    }
    //开始游戏
    function startGame(level , pos){
        clearMap();//去除地图
        bcMove();
        let p = plane(level , pos);//
        createEnemy(level , p);//
        oBox.score = 0;
    }
    //创建我军
    function plane(level , pos) {
        let oImg = new Image();//document.createElement("img")
        oImg.src = "img/plane_1.png";
        oImg.width = 60;
        oImg.height = 75;
        //确定宽高
        oImg.className = "plane";
        oImg.style.left = pos.x - oImg.width/2 + 'px';
        oImg.style.top = pos.y - oImg.height/2 + 'px';
        // 定位
        oMap.appendChild(oImg);
        const leftMin = -oImg.width/2,
              leftMax = oBox.offsetWidth - oImg.width / 2,
              topMin = -oImg.height / 2,
              topMax = -oImg.height / 2 + oBox.offsetHeight
        ;
        //加入鼠标移动事件
        document.onmousemove = (e) => {
            e = e || window.event;
            let clientX = e.clientX,
                clientY = e.clientY
            ;
              //飞机随鼠标移动
            let moveX = clientX - oBox.offsetLeft - oImg.width / 2,
                moveY = clientY - oBox.offsetTop - oImg.height / 2
            ;
            moveX = Math.max(moveX , leftMin);moveX = Math.min(moveX , leftMax);
            moveY = Math.max(moveY , topMin);moveY  = Math.min(moveY , topMax);
            //限制移动方位
            oImg.style.left   = moveX + 'px';
            oImg.style.top = moveY + 'px';
        };
        fire(oImg , level);
        return oImg;
    }
    //我军子弹
    function fire(oImg , level) {

        oBox.biuInterval = setInterval(function (){
            create(1);
            },[250 ,200 , 200 ,50][level]);//不停创建激光炮

        function create(d) {
            let biu = new Image();
            biu.src = "img/fire.png";
            biu.width = 60;
            biu.height = 60;
            biu.className = "biu";
            let top = parseFloat(oImg.style.top) + biu.height / 2 - parseFloat(oImg.height) / 2 - 15 ,
                left = parseFloat(oImg.style.left) + biu.width / 2 - parseFloat(oImg.width) / 2;//构建激光炮
            biu.style.left = left + 'px';
            biu.style.top = top + 'px';
            oBiuAll.appendChild(biu);//增加子弹
            function moveFire() {
                if ( biu.parentNode ) {
                    if (biu.offsetTop < 0) {
                        oBiuAll.removeChild(biu);
                    } else {
                        biu.style.top = top + 'px';
                        top -= 10 * d;
                        requestAnimationFrame(moveFire);
                    }
                }
            }
            setTimeout(function () {
                requestAnimationFrame(moveFire);
                },50)
        }//初始发射激光炮

    }
    //创建敌军
    function createEnemy(level , oPlane) {
        //初始化操作
        let speed = [5,6,6,8][level],
            bWidth = oMap.clientWidth,
            bHeight = oMap.clientHeight,
            num = 1
        ;
        oBox.enemyInterval = setInterval(function(){
            //生成敌军
            create();
        },[350,150,120,40][level]);
        function create() {
            let oEnemy = new Image(),
                index = num%30?1 : 0;
            oEnemy.index = index;
            oEnemy.HP = [10 , 1][index];
            oEnemy.speed = speed * (Math.random() * 0.25 - Math.random() * 0.1 + 1);
            oEnemy.width = [70,45][index];
            oEnemy.height = [70,45][index];
            oEnemy.src = `img/enemy_${["big","small"][index]}.png`;
            oEnemy.className = "enemy";
            oEnemy.style.left = randomNum(-oEnemy.width / 2 , oEnemy.width / 2 + bWidth) + 'px';
            oEnemy.style.top = -oEnemy.height /2 + 'px';
            oMap.appendChild(oEnemy);
            num++;
            function moveEnemy() {
                let top = oEnemy.offsetTop;
                top += oEnemy.speed;
                if (top > bHeight - oEnemy.height / 2) {
                    oMap.removeChild(oEnemy);
                    oBox.score --;//分数计算
                } else {
                    oEnemy.style.top = top + 'px';
                    for (let i = biuAll.length - 1 ; i >= 0; i--) {
                        let objBiu = biuAll[i];
                        //敌军与子弹的碰撞
                        if (coll(oEnemy , objBiu)) {
                            oEnemy.HP --;
                            oBiuAll.removeChild(objBiu);//移除子弹
                        }
                        if (!oEnemy.HP) {
                            oBox.score += [30,2][oEnemy.index];
                            boom(oEnemy.offsetLeft , oEnemy.offsetTop , oEnemy.clientWidth , oEnemy.clientHeight,0);//敌军爆炸图
                            oMap.removeChild(oEnemy);//移除敌军
                            return;
                        }
                    }
                    //敌军与我军的碰撞
                    if (oPlane.parentNode && coll( oEnemy , oPlane)) {
                        boom(oPlane.offsetLeft , oPlane.offsetTop , oPlane.clientWidth,oPlane.clientHeight,1);//我军爆炸图
                        boom(oEnemy.offsetLeft , oEnemy.offsetTop , oEnemy.clientWidth,oEnemy.clientHeight,0);//敌军爆炸图
                        oMap.removeChild(oPlane);//移除我军
                        oMap.removeChild(oEnemy);//移除敌军
                        GameOver();
                        return;
                    }
                    requestAnimationFrame(moveEnemy);
                }
            }
            setTimeout(function () {
                requestAnimationFrame(moveEnemy);
            },50)
        }
    }
    //爆炸函数
    function boom(l,t,w,h,i) {
        let Boom = new Image();
        Boom.src = `img/boom_${['small','big'][i]}.png`;
        Boom.height = h;
        Boom.width = w ;
        Boom.className = 'boom' + ['','1'][i];
        Boom.style.left = l + 'px';
        Boom.style.top = t + 'px';
        oMap.appendChild(Boom);//生成爆炸图
        setTimeout(function () {
            Boom.parentNode && oMap.removeChild(Boom);
        },1200)
    }
    //碰撞检测
    function coll (obj1 , obj2) {
        let T1 = obj1.offsetTop,
            B1 = T1 + obj1.clientHeight,
            L1 = obj1.offsetLeft,
            R1 = L1 + obj1.clientWidth;
        let T2 = obj2.offsetTop,
            B2 = T2 + obj2.clientHeight,
            L2 = obj2.offsetLeft,
            R2 = L2 + obj2.clientWidth;

        return !( B1 < T2 || R1 < L2 || T1 > B2 || L1 > R2 );
    }
    //游戏背景的移动与选择
    function bcMove() {
        oMap.style.backgroundImage = `url("img/bg_${randomNum(1,4)}.jpg")`;
        (function move() {
            oMap.bgPosY = oMap.bgPosY || 0;
            oMap.bgPosY ++ ;
            oMap.style.backgroundPositionY = oMap.bgPosY + 'px';
            oMap.bgTimer = requestAnimationFrame(move);
        })();
    }
    //结束游戏
    function GameOver() {
        document.onmousemove = null;//清除鼠标移动
        clearInterval(oBox.enemyInterval);
        clearInterval(oBox.biuInterval);//清除定时器
        restart();
    }
    //结算加重新开始的界面
    function restart(){
        oScore.style.display = "none";

        let s = oBox.score;
        let honor;

        if ( s < -300 ){
            honor = "闪避+MAX！！！";
        }else if ( s < 10 ){
            honor = "菜得…算了我不想说了…";
        }else if ( s < 30 ){
            honor = "抠脚侠！";
        }else if ( s < 100 ){
            honor = "初级飞机大师";
        }else if ( s < 200 ){
            honor = "渐入佳境";
        }else if ( s < 500 ){
            honor = "中级飞机大师";
        }else if ( s < 1000 ){
            honor = "高级飞机大师";
        }else if ( s < 5000 ){
            honor = "终极飞机大师";
        }else{
            honor = "孤独求败！";
        }

        oRe.style.display = "block";
        allReChild[0].children[0].innerHTML = s;
        allReChild[1].children[0].innerHTML = honor;
    }
    //生成随机数
    function randomNum(min , max){
        return parseInt(Math.random()*(max - min + 1) + min);
    }
})();


