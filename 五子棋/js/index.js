let obox = document.getElementById("box"),
    arr = Array.apply(null, {length: 20}),
    divWid = obox.offsetWidth / arr.length,
    oposi = obox.querySelector(".kuang .show"),
    pieces = obox.querySelector(".pieces"),
    movepie = obox.querySelector(".movepieces .move"),
    alertMove = obox.querySelector(".over"),
    alertClick = alertMove.querySelector("p"),
    boxdata = obox.querySelector(".data"),
    juedgArr = [{y: -1}, {x: 1, y: -1}, {x: 1}, {x: 1, y: 1}, {y: 1}, {x: -1, y: -1}, {x: -1}],
    movepiece = null,                       //储存跟随鼠标移动的棋子
    reserveCoor = null,                     //储存移动时候最后的一个坐标
    pieceCoor = {},                         //储存棋子的坐标
    resCoorOne = [],                        //储存黑棋的坐标
    resCoorTwo = [],                        //储存白棋的坐标
    storeCoor = [],                         //储存棋子用来回退
    coorColor = ["red", "#000"],             //棋子颜色
    definultColor = null,
    definultJuedg = true,
    coorWid = 30 / 2,
    fadein = true,
    victory = 5;                            //设置多少棋连在一起就结束，默认是5


//初始化样式
const fragment = document.createDocumentFragment();
arr.forEach(function(value,indexOne){
    arr.forEach(function(value,indexTwo){
        const odiv = document.createElement("div");
        odiv.classList.add("float");
        odiv.setAttribute("coordinate",indexOne+"-"+indexTwo);
        fragment.appendChild(odiv);
    });
});
boxdata.appendChild(fragment);

const boxInit = function () {
    movepie.style.backgroundColor = coorColor[0];

    //按x键悔棋
    document.addEventListener("keyup", docuKeyup);

    //obox的移动事件委托
    obox.addEventListener("mousemove", boxmove);

    //obox的点击实践委托
    obox.addEventListener("click", boxclick);
};
boxInit();

//创造棋子
function createReserve(red,coor){
    coor = coor.split("-");
    const odiv = document.createElement("div");
    odiv.classList.add("pieces-coor");
    odiv.style.backgroundColor = red;
    odiv.style.top = coor[0] * divWid - coorWid+"px";
    odiv.style.left = coor[1] * divWid - coorWid+"px";
    pieces.appendChild(odiv);
    return odiv;
}

obox.addEventListener("mouseenter",function(){
    movepie.style.opacity = 1;
    oposi.style.opacity = 1;
});

obox.addEventListener("mouseleave",function(){
    movepie.style.opacity = 0;
    oposi.style.opacity = 0;
});
//判断是否游戏结束
function juedgVictory(bool){
    const arr = bool ? resCoorOne : resCoorTwo;
    const someJuedg = arr.some(function (valueOne) {
        return juedgArr.some(function (valueTwo) {
            let str = valueOne.split("-"),
                coorX = parseInt(str[1]),
                coorY = parseInt(str[0]),
                x = valueTwo.x || 0,
                y = valueTwo.y || 0;
            return Array.apply(null, {length: victory - 1}).every(function (value) {
                coorX += x;
                coorY += y;
                return arr.indexOf(coorY + "-" + coorX) >= 0;
            });
        });
    });
    if(someJuedg){
        return overAlert();
    }
}

function overAlert(){
    //游戏结束清除事件
    fadein = false;
    obox.removeEventListener("click",boxclick);
    obox.removeEventListener("mousemove",boxmove);
    document.removeEventListener("keyup",docuKeyup);
    alertMove.style.display = "block";
    setTimeout(function(){
        alertMove.style.opacity = 1;
    },100);
}
alertClick.addEventListener("click",function(){
    movepiece = null;                     
    reserveCoor = null;                     
    pieceCoor = {};                        
    resCoorOne = [];                           
    resCoorTwo = [];                       
    storeCoor = [];                               
    definultColor = null;
    definultJuedg = true;
    pieces.innerHTML = "";
    alertMove.style.opacity = 0;
    fadein = true;
    return boxInit();
});

alertMove.addEventListener("transitionend",function(){
    if(fadein)this.style.display = "none";
});

//document的键盘事件函数
function docuKeyup(e){
    if (e.keyCode !== 88) {
        return;
    }
    if (!storeCoor.length) return;
    const popmove = storeCoor.pop();
    for (let key in popmove) {
        let one = resCoorOne.indexOf(key);
        let two = resCoorTwo.indexOf(key);
        //黑白棋子一起储存的回退
        if (!(key in pieceCoor)) {
        } else {
            //删除棋子
            popmove[key].parentNode.removeChild(popmove[key]);
            delete pieceCoor[key];
        }
        //储存黑白棋子坐标进行回退
        if (one >= 0) resCoorOne.splice(one, 1);
        if (two >= 0) resCoorTwo.splice(two, 1);
        //颜色回退
        definultJuedg = !definultJuedg;
        movepie.style.backgroundColor = definultJuedg ? coorColor[0] : coorColor[1];
    }
}

//box的点击事件函数
function boxclick(e){
    e.cancelBubble = true;
    if(reserveCoor){
        if(definultJuedg){
            definultColor = coorColor[0];
            resCoorOne.push(reserveCoor);
        }else{
            definultColor = coorColor[1];
            resCoorTwo.push(reserveCoor);
        }
        pieceCoor[reserveCoor] = true;
        storeCoor.push({[reserveCoor]:createReserve(definultColor,reserveCoor)});
        definultJuedg = !definultJuedg;
        movepie.style.backgroundColor = definultJuedg?coorColor[0]:coorColor[1];
        //判断是否胜利
        return juedgVictory(!definultJuedg);
    }
}

//obox的mousemove事件函数
function boxmove(e){
    let target = e.target.getAttribute("coordinate");
    if(!target)return;
    let moveXY = target.split("-"),
        mX = e.pageX - obox.offsetLeft,
        mY = e.pageY - obox.offsetTop,
        moveOne = parseInt(moveXY[0]),
        moveTwo = parseInt(moveXY[1]),
        fourCoor = [[moveOne, moveTwo], [moveOne, moveTwo + 1], [moveOne + 1, moveTwo], [moveOne + 1, moveTwo + 1]];

    movepie.style.left = mX - (movepie.offsetWidth/2)+"px";
        movepie.style.top = mY- (movepie.offsetWidth/2)+"px";

    //用勾股定义选择靠的最近的一个坐标
    let minXY = fourCoor.map(function (value, index) {
        let moY = Math.abs(mY - value[0] * divWid),
            moX = Math.abs(mX - value[1] * divWid);
        return [Math.sqrt(moY * moY + moX * moX), value];
    }).filter(function (value) {
        //过滤掉坐标上以有棋子的
        if (!(pieceCoor[value[1].join("-")])) {
            return value;
        }
    });
    if(!minXY.length)return;
    minXY = minXY.sort(function(a,b){
        return a[0] - b[0];
    })[0][1];
    reserveCoor = minXY.join("-");
    const oposiLate = minXY.map(function (value, index) {
        return (value * divWid) - (oposi.offsetWidth / 2);
    });
    oposi.style.transform = "translate("+oposiLate[1]+"px,"+oposiLate[0]+"px)";
}