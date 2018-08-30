;
(function (newChild) {

    function NodeConstructor() {}
        NodeConstructor.prototype = {
            constructor : NodeConstructor,
            //需要带px的属性
            pcEmAttr : ['width','height','margin','padding','left','top','right','bottom'],
            // 创建节点
            createNode : function(_type, callback) {
                let node = document.createElement(_type);
                return callback && callback.call(this, node) || node;
            }, //设置节点属性
            style : function(node , attr){
                this.enmuerate(attr,function (value , key) {
                    if (this.inArray(key, this.pcEmAttr) && value / 1){
                        node.style[key] = value + 'px';
                    } else {
                        node.style[key] = value;
                    }
                })
            },
            //枚举方法,用来遍历数组或对象
            enmuerate : function(enmuerates , callback) {
                if (this.isArray(enmuerates)) {
                    for ( let i = 0 , iL = enmuerates.length; i < iL ; i++){
                        callback.call(this , enmuerates[i],i,enmuerates);
                    }
                } else {
                    for (let key in enmuerates) {
                        callback.call(this, enmuerates[key], key, enmuerates);
                    }
                }
            },
            //判断是否在当前数组中
            inArray: function(value , arr){
                return new RegExp(`\\b${value}\\b`, 'i').test(arr.toString());
            },
            //判断是否为一个数组
            isArray : function (arr) {
                return arr instanceof Array;
            }
        };
/*====================================继承节点类============================================================*/
    //节点类

    function Ready(){}
    Ready.prototype = NodeConstructor.prototype;
    //中间继承的类
    /*-----------------------------------游戏类--------------------------------------------------*/
    function GameConstructor() {}
    GameConstructor.prototype = new Ready();
    GameConstructor.prototype.constructor = GameConstructor;
    //初始化操作
    GameConstructor.prototype.init = function (options) {
        // 用户传进来的游戏节点
        this.node = options.node;
        //用户传进来的属性
        this.width = options.width || 600;//宽度
        this.height = options.height || 600;//高度
        this.enemy = options.enemy || 4;//敌军数量
        this.level = options.level || 80;
        this.level = Math.min(this.level , 120);
        this.level = Math.max(80 , this.level);//游戏难度
        // this.style从Ready的prototype中寻找
        this.style(this.node , {
            width : this.width,
            height : this.height
        });
        return this;
    };
    //游戏类

    /****************************************游戏开始*******************************************************/
    //游戏开始
    GameConstructor.prototype.start = function () {
        //文档碎片
        this.document = document.createDocumentFragment();
        // console.dir(this.document);
        // this.document.appendChild(document.createElement('div'));//使用文档碎片操作迅速
        //创建玩家
        this.createSelf();
        //创建敌军
        this.createEnemys();
        //开启游戏计时相关
        this.timers();
        //将文档碎片添加到节点
        this.node.appendChild(this.document);
        //开始更新游戏
        this.up();
    };
    //开启计时器
    GameConstructor.prototype.timers = function (){
        //游戏开启时间
        this.goTime = new Date();
        //游戏更新时间
        this.upTime = null;
    };
    // 创建角色
    GameConstructor.prototype.createSelf = function() {
        this.player = this.createNode('div' , function(player){
            player.className = "self";
            this.style(player,{
                width : 50,
                height : 50,
                left : this.width/2 - 25,
                top : this.height/2 -25
            });
            //实例化对象
            let that = this;
           //鼠标按下事件
            /*
            player.addEventListener("mousedown" , function(){
                document.onmousemove = () => {
                    console.log(that);
                }
            });
            player.addEventListener("mouseup" , function(){
                document.onmousemove = null;
            });
            player.addEventListener("mouseleave" , function () {
                document.onmousemove = null;
            })
            */
            player.onmousedown = (e) => {
                let goX = e.clientX,
                    goY = e.clientY,
                    goLeft = player.offsetLeft,
                    goTop = player.offsetTop;
                that.node.onmousemove = (e) => {
                    that.style(player , {
                        left : e.clientX - goX + goLeft,
                        top : e.clientY - goY +  goTop
                    })
                };
                that.node.onmouseleave = that.node.onmouseup = () => {
                    that.node.onmousemove = null;
                }
            }
        });
        this.document.appendChild(this.player);
    };
    //创建敌军
    GameConstructor.prototype.createEnemys  = function () {
        //创建数组存储敌军
        this.enemys = new Array(this.enemy);
        //遍历新创建数组并赋值
        this.enmuerate(this.enemys , function (value , key ,arr) {
            let attr = {
                width : this.random(45 , this.width/10),
            };
            attr.height = attr.width;
            attr.top = this.random(0 , this.height - attr.height);//top随机
            //随机左右边
            if (this.random(0,1)){//随机取零和一
                attr.left = this.random(0 , Math.abs(this.width/5 - attr.width));
            } else {
                attr.left = this.random(Math.abs(this.width - 2*attr.width) , Math.abs(this.width - attr.width));
            }
            //生产敌军
            let node = this.createNode('div', function (node) {
                node.className = `enemy${this.random(1, 8)}`;
                this.style(node, attr)
            });
            //保存节点
            attr.node = node;
            //敌军速度与方向
                //水平方向
            attr.Xv = this.random(this.width/this.level , this.width / 120);
            attr.Yv = attr.Xv;
            if (this.half(attr.left , this.width) ){
                attr.Xv /= -1;
            }
            //垂直方向,速度方向判断
            if (this.half(attr.top , this.height)){
                attr.Yv /= -1;
            }
            //添加节点
            this.document.appendChild(node);
            arr[key] = attr;//保存在数组中
        });

        // console.log(this.enemys);
    };
    //游戏随机数,传递两个参数,最小与最大
    GameConstructor.prototype.half = function (n,m) {
        return n >= m/2;
    };
    //
    GameConstructor.prototype.random = function(n , m){
        return Math.floor(Math.random() * (Math.abs(m - n) + 1) + Math.min(n,m));
    };//随机数为整数
    //游戏移动敌军
    GameConstructor.prototype.moveEnemys = function(){
        this.enmuerate(this.enemys , function (enemy) {
            enemy.left += enemy.Xv;
            enemy.top += enemy.Yv;
            //边界碰撞
            if (enemy.left <= 0) {
                enemy.left = 0;
                enemy.Xv /= -1;
            }
            if (enemy.left > this.width - enemy.width) {
                enemy.left =this.width - enemy.width;
                enemy.Xv /=-1;
            }
            if (enemy.top <= 0) {
                enemy.top = 0;
                enemy.Yv /= -1;
            }
            if (enemy.top >= this.height - enemy.height) {
                enemy.top = this.height - enemy.height;
                enemy.Yv /=-1;
            }
            //边界碰撞^
            //图片左右翻转
            if (enemy.Xv > 0) {
                this.style(enemy.node ,{
                    "transform": "scale(-1,1)"
                })
            } else {
                this.style(enemy.node ,{
                    "transform": "scale(1,1)"
                })
            }
            // console.log(enemy.node);
            this.style(enemy.node , {
                left : enemy.left,
                top : enemy.top
            })
        })
    };
    /****************************************游戏进行*******************************************************/
    GameConstructor.prototype.up = function () {
        //移动敌军
        this.moveEnemys();
        //难度改变
        this.changeLevel();
        //边界判断

        if(this.checkBom()){
            this.end();
        } else {
            this.timer = requestAnimationFrame(this.up.bind(this));
        }
        // requestAnimationFrame(this.up);
    };
    //难度递增
    GameConstructor.prototype.changeLevel = function () {
        if (new Date() - this.upTime > 5000 || this.upTime === null) {
            // console.log("游戏更新");
            this.enmuerate(this.enemys , function (enemy) {
                if ((Math.abs(enemy.Xv)) <= this.width / 40 && Math.abs(enemy.Yv) <= this.height / 40){
                    enemy.Xv *= this.random(0,5) / 10 + 1;
                    enemy.Yv *= this.random(0,5) / 10 + 1;
                } else {
                    enemy.Xv = Math.abs(this.random(this.width/this.level , this.width / 120));
                    enemy.Yv = Math.abs(enemy.Xv);
                }
            });
            this.upTime = new Date();

        }
    };
    //边界判断
    GameConstructor.prototype.checkBom = function () {
        let status = false;

        //判断玩家的上下左右边
        if (this.player.offsetLeft <= 0) {

            status = true;
        }
        if (this.player.offsetLeft >= this.width - this.player.offsetWidth) {

            status = true;
        }
        //判断玩家的上下左右边
        if (this.player.offsetTop <= 0) {

            status = true;
        }
        if (this.player.offsetTop >= this.height - this.player.offsetHeight) {

            status = true;
        }
        //遍历敌军
        this.enmuerate(this.enemys,function(enemy){

            if(this.isBoom(this.player,enemy.node)){
                status = true;
            }
        });
        return status;
    };
    GameConstructor.prototype.isBoom = function (node1 , node2) {
        let _left = (node1.offsetLeft + node1.offsetWidth/2) - (node2.offsetLeft + node2.offsetWidth/2),
            _top =  (node1.offsetTop + node1.offsetHeight/2) - (node2.offsetTop + node2.offsetHeight/2);


        let c = Math.sqrt(_left*_left + _top*_top);

        return c <= node1.offsetWidth/2 + node2.offsetWidth/2;
    };
    /****************************************游戏结束*******************************************************/
    GameConstructor.prototype.end = function () {
        //取消玩家移动时间
        this.node.onmousemove = null;
        //取消动画帧
        cancelAnimationFrame(this.timer);
        //计算游戏时间
        this.endTime = new Date();
        alert("Game Over :" + (this.endTime - this.goTime) /1000 + "s" );
    };
    //在windows下挂载属性方法
    window.missGame = function (options) {
        //实例化gameConstructor构造函数并且执行init
        return new GameConstructor().init(options);
    }
})();
