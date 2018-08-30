;(function(window , undefined) {
    let domReadyFn = [];

    function JQuery(select){
        if (!/function/i.test(typeof select)) {
            return new JQuery.prototype.init(select);//实例化会新建一个实例化对象
        } else {
            domReadyFn.push(select);
        }
    }
    //初始化方法
    JQuery.prototype.init = function(select) {
        let arr = [],
            _type = typeof select,
            self = this
        ;
        if (/string/i.test(_type)) {//匹配字符串
            if (/^<.+/.test(select)) {
                console.log('HTML字符串标签');
                let container = document.createElement('div');
                container.innerHTML = select;//文档渲染
                arr = JQuery.prototype.toArray(container.innerHTML);//类数组转化为真数组
            } else {
                arr = JQuery.prototype.toArray(document.querySelectorAll(select));
            }
        } else if (/object/i.test(_type)) {
            if (_type != null && /number/i.test(typeof _type) && select !== 'window') {
                arr = JQuery.prototype.toArray(select); //类数组转数组
            } else {
                arr = [select]; //用一个新数组来存放这个对象
            }
        }
        JQuery.prototype.each(arr , function(i) {
            self[i] = arr[i];
        });
        this.length = arr.length;
    };
    JQuery.prototype.init.prototype = JQuery.prototype;

    //类数组转真数组
    JQuery.prototype.toArray = function (obj) {
        return Array.prototype.slice.call(obj);
    };
    //遍历方法
    JQuery.prototype.each = function (arr , callback) {
        arr.forEach(( v , i)=>{
            callback.call(arr[i] , i , arr[i]);
        })
    };
    JQuery.prototype.splice = Array.prototype.splice;

    JQuery.each = JQuery.prototype.each;
    JQuery.prototype.css = function(target , value) {
        //判断是否为设置
        if (!value) { //多个参数的情况下
            //json对象
            if (/object/i.test(typeof target)) {
                for (let key in target) {
                    this.css(key , target[key]);
                }
            } else { //字符串,直接获取
                //默认返回第一个,并且第一个存在
                if (this[0]) {
                    let attr = window.getComputedStyle ? window.getComputedStyle(this[0]) : this[0].getCurrentStyle;
                    return attr[target];
                }
            }
        } else {//一个参数的情况下
            this.each(function(){
                let em = '';
                if (/width|height|padding|margin|top|left|right|bottom|size/i.test(target) && value/1){
                    em = 'px';
                }
                this.style[value] = value + em;
            })
        }
    };
    JQuery.prototype.on = function () {
        console.log(this);
    };
    //文档加载事件
    document.onreadystatechange = function () {
        if(/complete/i.test(this.readyState)) {
            while (domReadyFn.length) {
                domReadyFn.shift().call(document);
            }
            domReadyFn = null;
        }
    };
    //挂载全局
    window.$ = JQuery.prototype;
})(window);
