(function(){

    /*=========================================== 节点类 ===========================*/
    //节点类
    function nodeConstructor(){}
    nodeConstructor.prototype = {

        constructor : nodeConstructor,

        //需要带px单位的属性
        pxEmAttr : ['width','height','margin','padding','left','top','right','bottom'],

        //创建节点
        createNode : function(_type,callback){

            //根据传递的参数 _type 来创建节点
            var node = document.createElement(_type);

            //callback 存在并call执行,任意的回调函数里,this最好指向实例化对象!所以这里call了this
            //callback有返回值就使用callback的返回值否则默认返回node
            return callback && callback.call(this,node) || node;
        },

        //设置节点属性
        style : function(node,attr){

            //遍历attr这个json对象
            this.enmuerate(attr,function(value,key){

                //判断 key 是否在 this.pxEmAttr 这个数组里,并且是一个数字类型!
                if(this.inArray(key,this.pxEmAttr) && value/1){

                    node.style[key] = value+'px';//带pc单位
                }else{

                    node.style[key] = value;//不带单位或者用户自带了单位(传递进来的单位)
                }
            });
        },

        //枚举方法,用来遍历数组或者对象
        enmuerate : function(enmuerates,callback){

            //判断是否为一个数组
            if(this.isArray(enmuerates)){

                //循环遍历数组
                for(var i = 0,iL = enmuerates.length; i < iL; i++){

                    //希望所有的回调的this都指向实例化对象
                    callback.call(this,enmuerates[i],i,enmuerates);
                }
            }else{

                //遍历json数据
                for(var key in enmuerates){

                    //希望所有的回调的this都指向实例化对象
                    callback.call(this,enmuerates[key],key,enmuerates);
                }
            }
        },

        //判断元素是否在当前数组中
        inArray : function(value,arr){

            //将数组转成字符串 width,height...
            //正则:字符边界 + value(传递进来的值) + 字符边界
            //使用正则的test方法检测是否存在于数组字符串中(数组通过arr.toString转成字符串), 存在返回true 否则为false
            return new RegExp('\\b'+value+'\\b', 'i').test(arr.toString());
        },

        //判断是否为一个数组
        isArray : function(arr){

            //直接判断arr是否为Array的实例化对象,如果是返回true.否则为false
            return arr instanceof Array;
        }
    };
    /*=========================================== 继承节点类 ===========================*/

    //中间继承的类
    function Ready(){}
    Ready.prototype = nodeConstructor.prototype;


    /*=========================================== 游戏类 ==================================================*/
    //游戏类
    function gameConstructor(){}
    gameConstructor.prototype = new Ready();
    gameConstructor.prototype.constructor = gameConstructor;

    //初识化的操作
    gameConstructor.prototype.init = function(options){

        //用户传进来的游戏节点
        this.node = options.node;

        //设置用户传递进来的属性
        this.width = options.width || 600;//宽度
        this.height = options.height || 600;//高度
        this.enemy = options.enemy || 4;//敌军
        this.level = options.level || 80;//游戏难度

        //最小50 最大是100
        this.level = Math.max(50,Math.min(100,this.level));

        //this.style()从哪里来 __proto__上查找
        this.style(this.node,{
            width : this.width,
            height : this.height
        });

        return this;
    };

    /*********************** 游戏开始 ******************************/
    //游戏开始
    gameConstructor.prototype.start = function(){

        //文档碎片 解决dom频繁操作耗时
        this.document = document.createDocumentFragment();//相当于一个麻袋

        //console.dir(this.document);

        //创建友军
        this.createSelf();

        //游戏计时相关
        this.timers();

        //创建敌军
        this.createEnemys();

        //将文档碎片添加到节点
        this.node.appendChild(this.document);

        //开始更新游戏
        this.up();
    };

    //开启计时器
    gameConstructor.prototype.timers = function(){

        //游戏开始时间
        this.goTime = new Date();

        //游戏更新时间
        this.upTime = null;
    };

    //创建我军
    gameConstructor.prototype.createSelf = function(){

        //友军保存在this.playe上
        this.playe = this.createNode('div',function(playe){

            //设置样式
            playe.className = "box self";

            //设置初始位置
            this.style(playe,{
                width : 50,
                height : 50,
                left : this.width/2 - 25,
                top : this.height/2 - 25
            });

            //实例化对象存起来
            var that = this;

            //绑定一个鼠标拖拽事件
            playe.onmousedown = function(e){

                var goX = e.clientX,
                    goY = e.clientY,
                    goLetf = playe.offsetLeft,
                    goTop = playe.offsetTop;

                //鼠标移动
                that.node.onmousemove = function(e){

                    that.style(playe,{
                        left : e.clientX - goX + goLetf,
                        top : e.clientY - goY + goTop
                    });
                };

                //鼠标离开画布 或者 在画布抬起的时候取消移动事件
                that.node.onmouseleave = that.node.onmouseup = function(){

                    that.node.onmousemove = null;
                };
            };
        });

        this.document.appendChild(this.playe);
    };

    //创建敌军
    gameConstructor.prototype.createEnemys = function(){

        //创建一个数组用来存敌军
        this.enemys = new Array(this.enemy);

        //遍历新创建的数组并且赋值
        this.enmuerate(this.enemys,function(value,key,arr){

            //敌军属性
            var attr = {width : this.random(50,this.width/10)};
            attr.height = attr.width;//高度等于宽度
            attr.top = this.random(0,this.height - attr.height);//top随机

            //随机到左右边
            if (this.random(0,1)) {

                attr.left = Math.abs(this.random(0,this.width/5)  - attr.width);//可能会有负数
            }else{

                attr.left = this.width - this.random(0,this.width/5) - attr.width;
            }

            //生产敌军盒子
            var node = this.createNode('div',function(node){

                node.className = "#wrap enemy"+this.random(1,8);
                this.style(node,attr);
            });

            //将节点保存
            attr.node  = node;

            //敌军速度 方向

            //水平方向
            attr.xv = this.random(this.width/this.level,this.width/100);

            //垂直方向
            attr.yv = attr.xv;

            //右边需要速度取反
            if(this.half(attr.left,this.width)){

                //如果是右边去取负数
                attr.xv /= -1;
            }

            //下边需要速度取反
            if(this.half(attr.top,this.height)){

                //如果是右边去取负数
                attr.yv /= -1;
            }

            //生产的节点并且添加到文档碎片里
            this.document.appendChild(node);

            //改变原来数组
            arr[key] = attr;
        });
    };

    //判断值是否为比较值的一半
    gameConstructor.prototype.half = function(n,m){

        return n >= m/2;
    };

    //游戏的随机数 传递两个参数 最小 和 最大
    gameConstructor.prototype.random = function(n,m){

        if(n > m){

            m = n + m;// m = 15;n=5
            n = m - n;// n = 10; 15 - 5
            m = m - n;// m = 5; 15 - 10
        }

        return Math.floor(Math.random() * (m - n + 1)) + n;
    };


    /*********************** 游戏进行中 ******************************/
    //游戏进行中
    gameConstructor.prototype.up = function(){

        //移动敌军
        this.moveEnemys();

        //难度递增
        this.changeLevel();

        //边界判断
        if(this.checkBoom()){

            this.end();
        }else{

            //请求动画帧
            this.timer = requestAnimationFrame(this.up.bind(this));
        }
    };

    //敌军移动
    gameConstructor.prototype.moveEnemys = function(){

        //遍历敌军
        this.enmuerate(this.enemys,function(enemy){

            enemy.left+=enemy.xv;
            enemy.top+=enemy.yv;

            //左边的判断
            if(enemy.left < 0){

                enemy.left = 0;
                enemy.xv/=-1;
            }
            //右边的判断
            if(enemy.left > this.width - enemy.width){

                enemy.left = this.width - enemy.width;
                enemy.xv/=-1;
            }

            //上边的判断
            if(enemy.top < 0){

                enemy.top = 0;
                enemy.yv/=-1;
            }
            //下边的判断
            if(enemy.top > this.height - enemy.height){

                enemy.top = this.height - enemy.height;
                enemy.yv/=-1;
            }


            //转头方向
            if(enemy.xv > 0){

                //transform:
                this.style(enemy.node,{
                    "transform" : "scale(-1,1)"
                });
            }else{

                this.style(enemy.node,{
                    "transform" : ""
                });
            }

            //改变定位值
            this.style(enemy.node,{
                left : enemy.left,
                top : enemy.top
            });
        });
    };

    //难度递增
    gameConstructor.prototype.changeLevel = function(){

        if(this.upTime === null || new Date() - this.upTime > 1000){

            //加速度
            this.enmuerate(this.enemys,function(enemy){

                if(Math.abs(enemy.xv) < this.width/80 && Math.abs(enemy.yv) < this.height/80){

                    enemy.xv *= this.random(0,5)/10+1;// 10 * 1.5
                    enemy.yv *= this.random(0,5)/10+1;
                }else{

                    //水平方向
                    enemy.xv = ((enemy.xv < 0) ? -1 : 1) * this.random(Math.abs(enemy.xv),this.width/100);

                    //垂直方向
                    enemy.yv = ((enemy.yv < 0) ? -1 : 1) * Math.abs(enemy.xv);
                }
            });
            this.upTime = new Date();
        }
    };

    //边界判断
    gameConstructor.prototype.checkBoom = function(){

        var status = false;

        //判断玩家的上下左右边
        if (this.playe.offsetLeft <= 0) {

            status = true;
        }
        if (this.playe.offsetLeft >= this.width - this.playe.offsetWidth) {

            status = true;
        }
        //判断玩家的上下左右边
        if (this.playe.offsetTop <= 0) {

            status = true;
        }
        if (this.playe.offsetTop >= this.height - this.playe.offsetHeight) {

            status = true;
        }


        //遍历敌军
        this.enmuerate(this.enemys,function(enemy){

            if(this.isBoom(this.playe,enemy.node)){

                status = true;
            }
        });

        return status;
    };

    //球与球之间的碰撞
    gameConstructor.prototype.isBoom = function(node1,node2){

        var _left = (node1.offsetLeft + node1.offsetWidth/2) - (node2.offsetLeft + node2.offsetWidth/2),
            _top =  (node1.offsetTop + node1.offsetHeight/2) - (node2.offsetTop + node2.offsetHeight/2);


        var c = Math.sqrt(_left*_left + _top*_top);

        return c <= node1.offsetWidth/2 + node2.offsetWidth/2;
    };

    /*********************** 游戏结束 ******************************/
    //游戏结束
    gameConstructor.prototype.end = function(){

        //取消玩家的移动事件
        this.node.onmousemove = null;

        //取消动画帧
        cancelAnimationFrame(this.timer);

        this.endTime = new Date();

        alert("游戏结束! 坚持了 : "+(this.endTime - this.goTime)/1000+"秒");
    };
    //在window下掛載屬性方法
    window.missGame = function(options){

        //實例化gameConstructor构造函数并且执行init
        return new gameConstructor().init(options);
    }
})();