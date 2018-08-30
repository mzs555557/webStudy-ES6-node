;(function (window , document , undefined){
    /*
    if (!document.getElementsByClassName)
        document.getElementsByClassName = function (eleName) {
        //获取所有标签对象
        let ele = document.getElementsByTagName("*"),
            eleAry = [],
            reg = new RegExp('\\b' + eleName + '\\b');
        for (let i = 0, len = ele.length; i < len; i++) {
            if (reg.test(ele[i].className)) {
                eleAry.push(ele[i]);
            }
        }
        return eleAry;
    };
    if(!document.querySelectorAll) {
        document.querySelectorAll = function (str) {
            let style = document.createElement('style'),
                elements = [],
                element = null;
            document._fy = [];
            //head标签
            let head = document.documentElement.firstChild;
            head.appendChild(style);
            style.styleSheet.cssText = str + "{fy: expression(document.__fy && document.__fy.push(this))}"
            window.scrollBy(0,0);
            style.parentNode.removeChild(style);
            while(document._fy.length) {
                element = document._fy.shift();
                element.style.removeAttribute("fy");
                elements.push(element);
            }
            document._fy = null;
            return elements;
        }
    }
    */
    //兼容trim
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g , "");
        }
    }
    //储存domReady回调函数
    let domReadyEvent = [];
    let Fy = function (str) {
        if (typeof str === "function"){
            domReadyEvent.push(str);
        } else {
            return new Fy.prototype.init(str);
        }
    };
    //内部方法,用于储存事件函数
    let _addEventFn = function(obj){
        if (typeof obj.dom.events === "undefined") {
            obj.dom.events = {};
            obj.dom.events[obj.type] = [obj.fn];
        } else if (obj.dom.events[obj.type] instanceof Array) {
            obj.dom.events[obj.type].push(obj.fn);
        } else {
            obj.dom.events[obj.type] = [obj.fn];
        }
        obj.dom.events[obj.type].origin = obj.origin;
    };
    //内部方法 用于处理事件修饰符/事件指令
    let _eventModifiers = function (arr , e) {
        Fy.Each(arr ,  function (k) {
            if (k === "stop") {
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true;
                }
            } else if (k === "prevent") {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
        })
    };
    // let _eventModifiers = function (arr , e) {
    //     arr.forEach((k)=>{
    //         if (k === "stop") {
    //                  if (e.stopPropagation) {
    //                      e.stopPropagation();
    //                  } else {
    //                      e.cancelBubble = true;
    //                  }
    //              } else if (k === "prevent") {
    //                  if (e.preventDefault) {
    //                      e.preventDefault();
    //                  } else {
    //                      e.returnValue = false;
    //                  }
    //              }
    //     })
    // };
    //内部方法,解绑事件函数
    let _removeEvent = function (dom , type ,fn) {
        if (dom.removeEventListener) {
            dom.removeEventListener(type , fn);
        } else if (dom.detachEvent) {
            dom.detachEvent("on" + type , fn);
        }
    };
    //静态类方法类数组转数组
    Fy.toArray = function (o) {
        return [].slice.call(o);
    };
    Fy.Each = function(o , fn , that) {
        for (let i = 0, len = o.length; i < len ; i++) {
            let flag = fn.call(that || o[i],o[i],i,o);
            if (flag === false) {
                break;
            } else if (flag === true) {
                continue;
            }
        }
    };
    Fy.type = function (o) {
        let _toString = Object.prototype.toString;
        let _type = {
            "undefined": "undefined",
            'number': 'number',
            'boolean': 'boolean',
            'string': 'string',
            '[object Array]': 'array',
            '[object Function]': 'function',
            '[object RegExp]': 'regexp',
            '[object Math]': 'math',
            '[object Date]': 'date',
            '[object Error]': 'error'
        };
        return _type[typeof o] || _type[_toString.call(o)] || (o ? "object" : "null" );
    };
    Fy.prototype = {
        constructor : Fy,
        prevNode : null,
        init : function(select) {
            // select = select.trim();
            let o = {
                html: function (select) {
                    let div = document.createElement('div');
                    div.innerHTML = select;
                    return div.children;
                },
                id: function(select) {
                    let o = document.getElementById(select.slice(1));
                    return o === null ? [] : [o];
                },
                className: function() {
                    return document.getElementsByClassName(select.slice(1));
                },
                tagName: function () {
                    return document.getElementsByTagName(select);
                },
                css3: function () {
                    return document.querySelectorAll(select);
                }
            };
            function f(select) {
                if (/^</.test(select)) {
                    return "html";
                } else if (/[~+>\s]/.test(select)) {
                    return "css3";
                } else if (/^\./.test(select)) {
                    return "className";
                } else if (/^#/.test(select)) {
                    return "id";
                } else if (/^[\w]+$/.test(select)) {
                    return "tagName";
                }
            }
            let arr ;
            if (typeof  select === "object") {
                arr = [select];
            } else if (typeof select === "string") {
                arr = o[f(select)](select);
            }
            //修改[]的原型,类数组
            // Object.setPrototypeOf(arr , Fy.prototype);
            // return arr;

            Fy.Each(arr , function (v , i) {
                this[i] = v;
            },this);

            this.length = arr.length;
        },
        //绑定事件
        on : function(eventType , fn) {
            //处理有事件修饰符的情况
            let arr = eventType.split(/\./),
                type = arr.shift();
            //on方法没有实现就return
            if(arguments.length === 0) return;
            for (let i = 0; i < this.length ; i++) {
                (function (i) {
                    let that = this[i];
                    if (type === "mousewheel") {
                        let f = function (e) {
                            _eventModifiers(arr , e);
                            e.wheelD = w.wheelDelta / 120 || e.detail / -3;
                            fn.call(that,e);
                        };
                        f.fn = fn;
                        if (that.addEventListener) {
                            that.addEventListener(
                                that.onmousewheel === null ? "mousewheel" : "DOMMouseScroll",
                                f,
                                false
                            );
                            //把事件函数存起来 ,用于off方法遍历解绑
                        } else if (that.attachEvent) {
                            that.attachEvent("on" + type , f);
                        }
                        _addEventFn({
                            dom : that,
                            type : type,
                            fn : f,
                            origin : eventType
                        })
                    } else {
                        let f = function (e) { //真正的事件函数 , 参数在 fn 里面
                            _eventModifiers(arr , e);
                            fn.call(that , e);
                        };
                        f.fn = fn;
                        if (that.addEventListener) {
                            that.addEventListener(type , f , false);
                        } else if (that.attachEvent) {
                            that.attachEvent("on" + type , f);
                        }
                        _addEventFn({
                            dom : that,
                            type : type,
                            fn : f,
                            origin : eventType
                        })
                    }

                }).call(this , i);
            }
            return this;
        },
        //解绑事件
        off : function (type , fn) {
            if (arguments.length <= 0) return;

            let isFn = typeof fn === "function";

            for (let i = 0; i < this.length; i++) {
                let domEventArr = this[i].events[type],
                    that = this[i];
                if (!domEventArr) return;

                for (let j = domEventArr.length; j >= 0 ; j--) {
                    if (type === 'mousewheel') {
                        if (isFn) {
                            if (domEventArr[j].fn === fn) {
                                _removeEvent(
                                    that,
                                    that.onmousewheel === null ? 'mousewheel' : 'DOMMouseScroll',
                                    domEventArr[j]
                                );
                            }
                        } else {
                            _removeEvent(
                                that,
                                type,
                                domEventArr[j]
                            )
                        }
                        domEventArr.splice(j , 1)
                    } else {
                        if (isFn) {
                            //是函数时
                            if (domEventArr[j].fn === fn) {
                                _removeEvent(
                                    that,
                                    type,
                                    domEventArr[j]
                                )
                            } else {
                                _removeEvent(
                                    that,
                                    type,
                                    domEventArr[j]
                                )
                            }
                        }
                        domEventArr.splice( j ,1);
                    }
                }
            }
            return this;
        },
        one : function (eventType , fn) {
            let arr = eventType.split(/\./ ),
                type = arr.shift();
            if (arguments.length !== 2) return;
            for (let i = 0; i < this.length; i++) {
                (function (i) {
                    let that = this[i];
                    if (type === 'mousewheel') {
                        let f = function (e) {
                            _eventModifiers(arr , e);
                            e.wheelD = e.wheelDelta / 120 || e.detail / -3;
                            fn.call(that , e);
                            Fy(that).off(type , fn);
                        };
                        f.fn = fn;
                        if (that.addEventListener) {
                            that.addEventListener(
                                that.onmousewheel === null ? "mousewheel" : "DOMMouseScroll",
                                f,
                                false
                            )
                        } else if (that.attachEvent) {
                            that.attachEvent("on" + type , f);
                        }
                        _addEventFn({
                            dom : that,
                            type : type,
                            fn : f,
                            origin : eventType
                        })
                    } else {
                        let f = function (e) {
                            _eventModifiers(arr , e);
                            fn.call(that , e);
                            Fy(that).off(type , fn);
                        };
                        f.fn = fn;
                        if (that.addEventListener) {
                            that.addEventListener(type , f ,false);
                        } else if (that.attachEvent) {
                            that.attachEvent("on" + type , f);
                        }
                        _addEventFn({
                            dom : that,
                            type : type,
                            fn : f,
                            origin : eventType
                        })
                    }
                }).call(this , i);
            }
            return this;
        },
        //实例化对象的遍历方法
        each : function (fn) {
            Fy.Each(this , function (v, i , s) {
                let flag = fn.call(v,v,i,s);
                if (flag !== 'undefined') {
                    return flag;
                }
            })
        },
        val : function (s) {
            if ( Fy.type(s) === 'undefined' ) {
                try {
                    return this[0].value;
                } catch (err) {
                    throw Error("只有表单对象具有value");
                }
            } else {
                this.each(function (k) {
                    k.value = s;
                });
                return this;
            }
        },
        html : function (s) {
            if (Fy.type(s) === 'undefined') {
                try {
                    return this[0].innerHTML;
                } catch (err) {
                    throw Error("对象HTML不存在");
                }
            } else {
                this.each(function (k) {
                    k.innerHTML = s;
                });
                return this;
            }
        },
        text : function (s) {
            if (Fy.type(s) === 'undefined') {
                try {
                    return this[0].innerText;
                } catch (err) {
                    throw Error("对象innerText不存在");
                }
            } else {
                this.each(function (k) {
                    k.innerText = s;
                });
                return this;
            }
        },
        eq : function (n) {
            n %= this.length;
            if (n < 0) {
                n += this.length;
            }
            Fy.prototype.prevNode = new this.init(this);
            return new this.init(this[n]);
        },
        end : function () {
            let obj = this.prevNode[0];
            Fy.prototype.prevNode = null;
            return obj;
        },
        addClass : function (eName) {
            this.each(function () {
                let newArr = this.className.split(/\s/g).concat(eName.split(/\s/g)),
                    len = newArr.length;
                for (let i = 0; i < len; i++) {
                    for (let j = newArr.length -1; j > i ; j--) {
                        if ( !newArr[j] ) {
                            newArr.splice( j , 1 );
                        }
                        if ( newArr[i] === newArr[j] ) {
                            newArr.splice( j , 1 );
                        }
                    }
                }
                this.className = newArr.join(" ");
            });
            return this;
        },
        removeClass: function (eName) {
            this.each(function () {
                let oldName = this.className.split(/\s/g),
                    newName = eName.split(/\s/g);
                for (let i = 0; i < newName.length; i++) {
                    for (let j = oldName.length - 1; j >= 0; j--) {
                        if (newName[i] === oldName[j]) {
                            oldName.splice( j , 1 );
                        }
                    }
                }
                this.className = oldName.join(" ");
            });
            return this;
        },
        hasClass: function (eName) {
            let reg = new RegExp("\\b" + eName + "\\b");
            return reg.test(this[0].className);
        },
        toggleClass: function (eName) {
            this.each(function () {
                let that = Fy(this);
                if (that.hasClass(eName)) {
                    that.removeClass(eName);
                } else {
                    that.addClass(eName);
                }
            })
        },
        appendTo: function (select) {
            let o;
            if (select instanceof Fy) {
                o = select;
            } else {
                let o = Fy(select);
            }
            let event = [],
                target = this;

            Fy.each(o , function (k , i) {
                let node = target[0].cloneNode(true);
                event.push(node);
                k.appendChild(node);
            });
            //遍历事件到新克隆的节点
            for (let key in target[0].events) {
                Fy.Each(event , function (k) {
                    Fy.Each(target[0].events[key] , function (k2) {
                        Fy(k).on(target[0].events[key].origin , k2);
                    })
                })
            }
            return this;
        },
        append: function (select) {
            if(!select) return;
            if (select instanceof Fy) {
                select.appendTo(this);
            } else {
                let ndoe = Fy(select)[0];
                this.each(function () {
                    this.appendChild(node.cloneNode(true));
                })
            }
            return this;
        },
        remove: function (select) {
            let type = Fy.type(select);
            if (type === 'undefined') {
                this.each(function () {
                    this.innerHTML = "";
                })
            } else if (type === 'string') {
                let o = Fy(select);
                this.each(function (k1) {
                    o.each(function (k2) {
                        k2.parentNode === k1 && k1.removeChild(k2);
                    })
                })
            } else if (type === 'object') {
                if (select instanceof Fy) {
                    this.each(function (k1) {
                        select.each(function (k2) {
                            k2.parentNode === k1 && k1.removeChild(k2);
                        })
                    })
                } else {
                    if (select.length !== undefined ) {
                        this.each(function (k1) {
                            for (let i = select.length - 1; i>=0; i-- ) {
                                select[i].parentNode === k1 && k1.removeChild(select[i]);
                            }
                        })
                    } else {
                        this.each(function (k1) {
                            select.parentNode === k1 && k1.removeChild(select);
                        })
                    }
                }
            }
            return this;
        },
        css: function (a,b) {
            let type = Fy.type(a);
            //设置与获取取决于参数b
            let c = "";

        }


    };
    Fy.prototype.init.prototype = Fy.prototype;//通过原型链的更改
    (function ( w , d ) {
        let done = false,//表明domReady是否准备完成
            init = function () {
                if (!done) {
                    done = true;
                    Fy.Each(domReadyEvent, function () {
                        this(Fy);
                    });
                    domReadyEvent.length = 0;
                }
            };
        //监听dom结构是否可用
        Fy(d).one("DOMContentLoaded" , init);

        f();
        function f() {
            try {
                d.documentElement.doScroll("left");
            } catch (error) {
                setTimeout(f);
                return;
            }
            init();
        }
        d.onreadystatechange = function () {
            if (d.readyState === "complete") {
                d.onreadystatechange = null;
                init();
            }
        };
        w.onload = function () {
            w.onload = null;
            init();
        }
    })(window , document);

    (function (){
        Fy("script").each(function () {
            const v = this.getAttribute("nick");
            if (v) {
                window[v] = Fy;
            }
        })
    })();
    window.$ = Fy;
})(window , document);