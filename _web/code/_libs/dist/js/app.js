/*! SDM app.js
 * ================
 * Main JS application file for SDM
 */

//Make sure jQuery has been loaded before app.js
if (typeof jQuery === "undefined") {
  throw new Error("APP,SDM requires jQuery");
}
window.console = window.console || {
    log: $.noop,
    info: $.noop,
    warn: $.noop,
    error: $.noop
}
/**date format**/
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/i.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

;(function($){
    var app = {}, data = {}, fn = {}, admin = {};
    var _console = {
            log: $.noop, error: $.noop, info:$.noop, warn: $.noop, debug: $.noop, group: $.noop, groupEnd:$.noop
        };
    var config = {
        base:"./",
        charset:"utf-8",
        debug:true
    };

    // 正则
    var reg = app.R = {
        trim : /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        http : /^http(s)?:\/\//i,
        _http: /^(http(s)?:\/\/|\/|file:\/\/)/i
    }

    var _fn = function(fn){
        return function(args, single){
            if($.type(args)==="number"||$.type(args)==="string"){
                if($.type(single)==="undefined"){
                    return fn[args];
                }
                fn[args] = single;
            }

            if($.isPlainObject(args)){
                $.extend(true, fn, args);
            }
            return fn;
        }
    }

    var _parentWindow = function (parent, force){
        if(typeof parent==="number"&&parent<=0){
            var level = parent;
        }
        if(parent===true||force)
            force = true;
        var win = window,
            i = 0,
            id;
        while(win&&parent!==0){
            if(!win.parent || win.parent=== win || (level&&Math.abs(level)<=i))
                break;
            id = win.APP.getUrlParam("layerId");
            win = win.parent;
            i++;
        }
        return {
            win: win,
            parent: parent,
            id: id,
            force: force
        };
    }

    $.extend(true, app, {
        fn: _fn(fn),
        data: _fn(data),
        config: _fn(config),
        admin:_fn(admin),
        console: function(){
            return window.console&&config.debug ? window.console : _console;
        },
        // 获取arm目录路径
        path: (function(){
            var js = document.scripts, script = js[js.length - 1], jsPath = script.src;
            if(script.getAttribute('merge')) return;
            return jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
        })(),
        // 获取arm引用地址
        srcUrl: (function(){
            var js = document.scripts, script = js[js.length - 1], jsPath = script.src;
            if(script.getAttribute('merge')) return;
            return jsPath;
        })(),
        // 获取引用页目录路径
        refer: window.location.href.substring(0, window.location.href.lastIndexOf('/')+1),
         is_lessIE : function (v){
            if(/Microsoft Internet Explorer/i.test(navigator.appName)){
                var ver = navigator.appVersion.match(/msie(\s+)?(\d)/i);
                if(ver&&Number(ver[2]) < v){
                    return true;
                }
            }
            return false;
        },
        objectJoin: function(obj,sep){
            var sept = sep || "";
            if(typeof obj === "string")
                return obj;
            if($.isArray(obj)){
                return obj.join(sept);
            }
            if($.isPlainObject(obj)){
                var arr = [];
                $.each(obj, function(index, val) {
                    arr.push(val);
                });
                return arr.join(sept);
            }
            return String(obj);
        },
        /**
        ** 在对象长度范围内
        **/
        inLen: function(len, index){
            if(index>len-1)
                index = len-1;
            if(index<0)
                index = 0;
            return index;
        },
        /**
        * 对象过滤
        **/
        inObject: function(obj, filter){
            var index = -1;
            $.each(obj, function(i, v) {
                if(filter(v, i)){
                    index = i;
                    return false;
                }
            });
            return index;
        },      
        /**
        ** 根据某一属性，查找对象数组中是否包含该成员
        **/
        inArrayObj: function(key, val, array){
            var index = -1;
            var _array = $.isArray(array) ? array.slice(0) : [];
            if(!_array.length)
                return index;
            for (var i = 0; i < _array.length; i++) {
                if(_array[i][key] === val){
                    return i;
                }
            };
            return index;
        },

        /**
        *** 根据某值，判断是某符合对象
        **/
        inObjKey:function(key, obj, name){
            var out = false;
            if(!key||typeof obj !=="object")
                return out;
            var k;
            for ( k in obj){
                if(obj[k] === key){
                    if(typeof name === "undefined"||name===k){
                        out = true;
                        break;
                    }
                }
            }
            return out;
        },
        /**
        ** 数组元素移动位置，重新排序
        **/
        sortAarry : function(arr, from, to){
            var len = arr.length;
            if(!arr.length)return -1;
            var _index = to;
            if(to==="uper"){
                _index = from + 1; 
            }
            if(to==="downer"){
                _index = from - 1; 
            }
            if(to==="top")
                _index = len-1;
            if(to==="bottom")
                _index = 0;

            _index = arm.inLen(len, _index);
            if(_index===from)
                return _index;
            var item = arr.splice(arm.inLen(len, from), 1);
            arr.splice(_index, 0, item[0]);
            return _index;
        },
        /**
        ** getImgNaturalSize 获取图片真实尺寸
        **/
        getImgNaturalSize: function (img, callback) {
            var nWidth, nHeight;
            if (img.naturalWidth) { // 现代浏览器
                nWidth = img.naturalWidth;
                nHeight = img.naturalHeight;
                callback(nWidth, nHeight);
            } else { // IE6/7/8
                var image = new Image();
                image.src = img.src;
                image.onload = function() {
                    callback(image.width, image.height);
                }
            }
            return [nWidth, nHeight];
        },
        // 获取url参数 ? or #
        getUrlParam : function(name, url, hash){
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var hash = hash || (typeof url === 'boolean' ? url : false);
            var url = A.R['http'].test(url)? url : window.location.href;
            var r = url.substr(url.indexOf(hash ? '#' : '?')+1).match(reg); 
            if (r != null) 
            return unescape(r[2]); 
            return null; 
        },
        updateUrlParam: function (url, name, value) {
           var r = url;
           if (r != null && r != 'undefined' && r != "") {
            value = encodeURIComponent(value);
            var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
            var tmp = name + "=" + value;
            if (url.match(reg) != null) {
             r = url.replace(eval(reg), tmp);
            }
            else {
             if (url.match("[\?]")) {
              r = url + "&" + tmp;
             } else {
              r = url + "?" + tmp;
             }
            }
           }
           return r;
        },
        toHump: function(str, isbig){
            var _strs = $.trim(str).split(/\s+/);
            var out = "";
            $.each(_strs, function(index, word) {
                out += arm.utils.firstUpper(word);
            });
            if(!isbig)
                out = arm.utils.firstLower(out);
            return out;
        },
        closeWindow: (function(){
            var _closeWindow = function (parent, closeAll){
                var _win = _parentWindow(parent, closeAll),
                    parent = _win.parent,
                    id = _win.id,
                    closeAll = _win.force,
                    win = _win.win;

                if(parent===0 || !id || closeAll){
                    try{
                        win.close();
                    }catch(e){
                    }
                }
                if(win.layer&&id){
                    win.layer.close(id);
                }
            }
            window.closeWindow = _closeWindow;
            return _closeWindow;
        })(),
        reloadWindow:(function(){
            var _reloadWindow = function(parent, force){
                var _win = _parentWindow(parent, force),
                    force = _win.force,
                    win = _win.win;
                    win.location.reload(force);
            }
            window.reloadWindow = _reloadWindow;
            return _reloadWindow;
        })(),
        getParentWindow:(function(){
            var _getParentWindow = function(parent){
                var _win = _parentWindow(parent, true);
                return _win.win;
            }
            window.getParentWindow = _getParentWindow;
            return _getParentWindow;
        })(),
        utils:(function () {
            var me = {};
            me.getTime = Date.now || function getTime () { return new Date().getTime(); };
            me.generateGUID = function(namespace){
                var uid = namespace + '-' || 'arm-';
                do {
                    uid += Math.random().toString(36).substring(2, 7);
                } while (document.getElementById(uid));

                return uid;
            };

            // 首字母大写
            me.firstUpper = function(str){
                return str.replace(/^\w|\s\w/g,function(v){return v.toUpperCase()});
            };

            // 首字母小写
            me.firstLower = function(str){
                return str.replace(/^\w|\s\w/g,function(v){return v.toLowerCase()});
            };

            me.getJSUrl = function(){
                var js = document.scripts;
                for (var i = js.length -1; i >=0; i--) {
                    if(js[i].src&&!js[i].getAttribute('merge'))
                        return js[i].src;
                };
                return location.href;
            };

            // error
            me.error = function(log, e, type){
                type = (type ? (type+" ") :"") + "Error：";
                app.console().error(type + (log || '') + '\n'+ (e || ''));
                return log;
            };

            me.realPath = function (path, base){
                var path = path || "";
                path = path.replace(/^\.\//,'');
                while (path.match(/^\.\.\//)) {
                    path = path.replace(/\.\.\//, "");
                    base = base.replace(/[^\/]+\/$/,"");
                }
                return base + path;

            };

            me.realBase = function(){
                var base = app.config('base');
                base = typeof base === "string" ? base : app.path;
                return app.R._http.test(base) ? base : me.realPath(base, app.path);
            };

            me.moduleUrl = function(module){
                var base = me.realBase();
                var url = me.realPath(module, base);
                return url;
            };

            me.moduleType = function (module){
                var moduleName = module.substring(module.lastIndexOf('/')+1);
                var moduleType = moduleName.substr(moduleName.lastIndexOf('.'));
                
                var isCSS = /^\.css(\W)?/.test(moduleType);
                var noCSSJS = !/[\?|&]/.test(module)&&!/^\.(js|css)(\W)?/.test(moduleType);
                return {
                    name: moduleName.replace(/[^a-zA-Z0-9\-]/g, '-'),
                    isCSS : isCSS,
                    isJS: isCSS ? false : true,
                    noCSSJS: noCSSJS
                }
            };

            me.iframeSrc = function(url, iframe){
                if(url)
                    $(iframe||".full-iframe>iframe").attr("src", url);
            }

            return me;
        })()
    });
    
    window.APP = window.A = app;
})(jQuery);

/**
 * arm.module
 * @authors Nat Liu (natcube@gmail.com)
 * @date    2015-12-03 13:21:13
 * @version 2015-12-03 13:21:13
 */
// 模块加载
;!function($, A, win){
    var doc = document;
    var utils = A.utils;
    var head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement;
    var currentScript,interactiveScript;
    var modulesQueue = [];
    var requesting = false;
    var pollingTimer = 10;
    var STATUS = {
        SAVED: 1,   // 创建模块
        LOADING: 2, // 正在加载
        PENDING:3,  // 加载依赖
        READY:4,    // 依赖完成
        ERROR:5     // 失败
    }

    function getMoudleId(id){
        if(!id||!id.length)
            return;
        var alias = A.config("alias");
        if($.isPlainObject(alias)){
            $.each(alias, function(key, val) {
                id.replace(key, val);
            });
        }
        id = A.R._http.test(id) ? id : utils.moduleUrl(id);
        var type = utils.moduleType(id);
        if(type.noCSSJS){
            id+=".js"; // 默认为JS类型模块
        }
        return id;
    }

    function getModIds(id){
        var ids = id || [];
        if(typeof id === "string")
            ids = [id];
        var mids = [];
        $.each(ids, function(index, mid) {
            mids.push(getMoudleId(mid));
        });
        return mids;
    }

    function getCurrentScript(base) {
        if(currentScript)
            return currentScript;
        if(doc.currentScript)
            return doc.currentScript.src;

        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript.src;
        }
        var stack;
        try {
            a.b.c() //强制报错,以便捕获e.stack
        } catch (e) { //safari的错误对象只有line,sourceId,sourceURL
            stack = e.stack
            if (!stack && window.opera) {
                //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
                stack = (String(e).match(/of linked script \S+/g) || []).join(" ")
            }
        }
        if (stack) {
            stack = stack.split(/[@ ]/g).pop() //取得最后一行,最后一个空格或@之后的部分
            stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, "") //去掉换行符
            return stack.replace(/(:\d+)?:\d+$/i, "") //去掉行号与或许存在的出错字符起始位置
        }
        var nodes = (base ? doc : head).getElementsByTagName("script") //只在head标签中寻找
        for (var i = nodes.length, node; node = nodes[--i];) {
            if (node.readyState === "interactive") {
                return node.hasAttribute ? node.src : node.getAttribute("src", 4);
            }
        }
    }

    // 回调轮循
    function callbackQueues(ids, time, callback, uri){
        var exports = [];
        time = (time || 0) + 1;
        if(!ids.length){
            return callback(time, exports);
        }
        var deps = 0, callback = $.isFunction(callback) ? callback : $.noop, uri = uri || false;
        $.each(ids, function(index, id) {
            var dep = A.modules[id];
            if((dep.status<STATUS.READY&&$.inArray(uri, dep.deps)===-1)){
                return false;
            }
            deps++;
        });

        if(deps===ids.length){
            for (var i = 0; i < deps; i++) {
                exports.push(A.modules[ids[i]].exports);
            }
            return callback(time, exports);
        }
        setTimeout(function(){
            callbackQueues(ids, time, callback, uri);
        },pollingTimer);
        
    }

    // 开始载入模块
    function requestMod(mod){
        if(mod.status>STATUS.SAVED){
            return setRequest();
        }
        mod.status = STATUS.LOADING;
        mod.requestTime = utils.getTime();
        var node = document.createElement(mod.type.isCSS ? 'link' : 'script');
        node.charset = A.config("charset") || "utf-8";
        if(mod.type.isCSS){
            node.type = 'text/css';
            node.rel = 'stylesheet';
        }else{
            node.type = 'text/javascript';
            node.async = true;
            currentScript = mod.uri;
        }
        loadedMod(node, mod);
        node[mod.type.isCSS ? 'href' : 'src'] = mod.uri;
        head.appendChild(node);
        currentScript = null;
        return setRequest();
    }

    function setRequest(){
        var m = modulesQueue.shift();
        if(!m||!A.modules[m])
            return requesting = false;
        var mod = A.modules[m];
        requesting = true;
        requestMod(mod);
    }

    // 模块加载完成
    function loadedMod(node, mod){

        var onload = function(error){
            node.onload = node.onerror = node.onreadystatechange = null;
            if (!A.config("debug")&&!mod.type.isCSS) {
                head.removeChild(node);
            }
            node = null;
            mod.loadTime = utils.getTime();
            if(error)
                mod.status = STATUS.ERROR;

            A.console()[error ? 'error':'log']("加载模块->", mod.uri, error ? "失败":"成功",",耗时", (mod.loadTime-mod.requestTime)/1000,"秒");
            // 启动依赖模块巡检
            mod.polling();
        }
        if('onload' in node){
            node.onload = function(){
                onload();
            };
            node.onerror = function() {
               onload(true);
            }
        }else{
            node.onreadystatechange = function() {
                if(/loaded|complete/.test(node.readyState)){
                    onload();
                }else{
                    onload(true);
                }
            }
        }
        
    }

    // 构建模块
    function Module(id){
        this.uri = id;
        this.deps = [];
        this.times = 0;
        this.exports = undefined;
        this.type = utils.moduleType(id);
        this.status = STATUS.SAVED;
        A.modules[id] = this;
    }

    Module.prototype.compile = function(){
        var mod = this,
            port = mod.factory;
            
            if($.isFunction(port)){
                function require(ids, callback){
                    if($.isFunction(callback)){
                        return A.use(ids, callback);
                    }
                    var exports = [];
                    $.each(getModIds(ids), function(index, id) {
                        var _mod = A.module[id];
                        exports.push(_mod ? _mod.exports : undefined);
                    });
                    if(exports.length===1)
                        return exports[0];
                    return exports;
                }
                port = port(require, mod);
            }
            if(typeof mod.exports ==="undefined")
                mod.exports = port;

            mod.status = STATUS.READY;
            A.console().log("编译模块->", mod.uri, ',巡检', mod.times,"次" );
    }

    Module.prototype.polling = function(){
        var mod = this;
        callbackQueues(mod.deps, 0, function(time){
            mod.times = time;
            mod.compile();
        }, mod.uri);
        
    }

    // 定义模块
    Module.define = function(id, deps, factory){
        var argsLen = arguments.length;
        // define(factory)
        if (argsLen === 1) {
            factory = id;
            id = undefined;
        }
        else if (argsLen === 2) {
            factory = deps;
            // define(deps, factory)
            if ($.isArray(id)) {
              deps = id;
              id = undefined;
            }
            // define(id, factory)
            else {
              deps = undefined;
            }
        }

        deps = getModIds(deps);
        var uri = getMoudleId(id) || getCurrentScript();
        var module = arm.modules[uri];

        if(!module){
            var newMod = true;
            module = new Module(uri);
            A.modules[uri] = module;
        }
        
        if(deps.length){
            module.status = STATUS.PENDING;
            // 模块依赖
            A.console().info("模块", module.uri, "依赖于", deps);
            module.deps = deps;
            A.use(deps);
        }
        module.factory = factory;

        if(newMod)
            module.polling();
    }

    Module.use = function(ids, callback){
        var mids = getModIds(ids);
        if(!mids.length)
            return ids;

        var queue = [];
        for (var i = 0; i < mids.length; i++) {
            var id = mids[i],
                mod = A.modules[id];
                if(!mod){
                    mod = new Module(id);
                    modulesQueue.push(id);
                }else{
                    A.console().log('模块-> '+id+' 已加载！');
                }
                if(!mod.type.isCSS)
                    queue.push(id);
        };
        callbackQueues(queue, 0, function(time, _exports){
            $.isFunction(callback)&&callback.apply(this, _exports);
        });
        if(!requesting)
            setRequest();
    }

    $.extend(true, A, {
        // SDM框架根目录
        root: (function(){
            return A.path.replace(/dist\/js\//,"");
        })(),

        modules: {},

        // 模块加载
        use: Module.use,
        define: Module.define
    });
 
}(jQuery, window.APP, window)


/**
 * APP.tpl
 * @authors Nat Liu (natcube@gmail.com)
 * @date    2015-11-30 09:21:49
 * @version 2015-11-30 09:21:49
 */

;!function($, A){
"use strict";

var config = {
    open: '<!--',
    close: '@-->'
};

var tool = {
    exp: function(str){
        return new RegExp(str, 'g');
    },
    //匹配满足规则内容
    query: function(type, _, __){
        var types = [
            '#([\\s\\S])+?',   //js语句
            '([^{#}])*?' //普通字段
        ][type || 0];
        return exp((_||'') + config.open + types + config.close + (__||''));
    },   
    escape: function(html){
        return String(html||'').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    },
    error: function(tplog, e){
        A.utils.error(tplog, e, 'Tpl');
    }
};

var exp = tool.exp, Tpl = function(tpl){
    this.tpl = tpl;
};

Tpl.pt = Tpl.prototype;

//核心引擎
Tpl.pt.parse = function(tpl, data){
    var that = this, tplog = tpl;
    var jss = exp('^'+config.open+'#', ''), jsse = exp(config.close+'$', '');
    
    tpl = tpl.replace(/[\r\t\n]/g, ' ').replace(exp(config.open+'#'), config.open+'# ')
    .replace(exp(config.close+'}'), '} '+config.close).replace(/\\/g, '\\\\')
    .replace(/(?="|')/g, '\\').replace(tool.query(), function(str){
        str = str.replace(jss, '').replace(jsse, '');
        return '";' + str.replace(/\\/g, '') + '; view+="';
    }).replace(tool.query(1), function(str){
        var start = '"+(';
        if(str.replace(/\s/g, '') === config.open+config.close){
            return '';
        }
        str = str.replace(exp(config.open+'|'+config.close), '');
        if(/^=/.test(str)){
            str = str.replace(/^=/, '');
            start = '"+_escape_(';
        }
        return start + str.replace(/\\/g, '') + ')+"';
    });
    
    tpl = '"use strict";var view = "' + tpl + '";return view;';
    try{
        that.cache = tpl = new Function('d, _escape_', tpl);
        return tpl(data, tool.escape);
    } catch(e){
        delete that.cache;
        return tool.error(e, tplog);
    }
};

Tpl.pt.render = function(data, callback){
    var that = this, tpl;
    if(!data) return tool.error('no data');
    tpl = that.cache ? that.cache(data, tool.escape) : that.parse(that.tpl, data);
    if(!callback) return tpl;
    callback(tpl);
};

var tpl = function(tpl){
    if(typeof tpl !== 'string') return tool.error('Template not found');
    return new Tpl(tpl);
};

tpl.config = function(options){
    options = options || {};
    for(var i in options){
        config[i] = options[i];
    }
};

// 扩展tpl接口
A.tpl = $.tpl = tpl;

}(jQuery, window.APP);

if(!window.layer){
    APP.use([APP.root+'plugins/layer/layer',APP.root+'plugins/layer/skin/layer.css']);
}
/**
*** alert rewrite
***/
window._alert = window.alert;
window.alert = function(content, options, yes){
    var alert = "";
    if($.isArray(content)){
        alert = content.join(",");
    }else{
        alert = String(content);
    }
    if(window.layer){
        layer.alert(alert, options, yes);
    }else{
        APP.use([APP.root+'plugins/layer/layer',APP.root+'plugins/layer/skin/layer.css'],function(){
            layer.alert(alert, options, yes);
        });
    }
    return alert;
}
/**
*** confirm rewrite
***/
window._confirm = window.confirm;
window.confirm = function(content, options, yes, cancel){
    var confirm = "";
    if($.isArray(content)){
        confirm = content.join(",");
    }else{
        confirm = String(content);
    }
    if(window.layer){
        layer.confirm(confirm, options, yes, cancel);
    }else{
        APP.use([APP.root+'plugins/layer/layer',APP.root+'plugins/layer/skin/layer.css'],function(){
            layer.confirm(confirm, options, yes, cancel);
        });
    }
    return confirm;
}
/* SDM
 *
 * @type Object
 * @description $.SDM
 */
$.SDM = {
    defaults:{},
    loadCallbacks:{}
};

$.SDM.utils = $.SDM.utils || {};

$.extend(true, $.SDM.utils, {
        dataAttr:function(el, attr, type){
            var attr = $(el).data(attr);
            if(typeof type === "string"){
                return attr ? attr : type;
            }
            if( typeof type === "boolean"){
                return attr ? true : false;
            }
            return attr;
        },
        dataAttrs:function(el, attrs, array){
            var out = array ? [] : {};
            $.each(attrs, function(index, attr) {
                out[ array ? index : attr] = $(el).data(attr.toLowerCase());
            });
            return out;
        },
        dataAttrFilter:function(attr){
            var data = {};
            var ids = attr.split(",");
            $.each(ids, function(index, name) {
                    var n = name.split(".");
                    if(n.length===2)
                        data[n[1]] = APP[n[0]](n[1]);
                    if(n.length===1)
                        data[n[0]] = APP[n[0]];
            });
            return data;
        }
});

/* --------------------
 * - SDM Options -
 * --------------------
 * Modify these options to suit your implementation
 */
$.SDM.options = {
  //Add slimscroll to navbar menus
  //This requires you to load the slimscroll plugin
  //in every page before app.js
  navbarMenuSlimscroll: true,
  navbarMenuSlimscrollWidth: "3px", //The width of the scroll bar
  navbarMenuHeight: "200px", //The height of the inner menu
  //General animation speed for JS animated elements such as box collapse/expand and
  //sidebar treeview slide up/down. This options accepts an integer as milliseconds,
  //'fast', 'normal', or 'slow'
  animationSpeed: 500,
  //Sidebar push menu toggle button selector
  sidebarToggleSelector: "[data-toggle='offcanvas']",
  //Activate sidebar push menu
  sidebarPushMenu: true,
  //Activate sidebar slimscroll if the fixed layout is set (requires SlimScroll Plugin)
  sidebarSlimScroll: true,
  //Enable sidebar expand on hover effect for sidebar mini
  //This option is forced to true if both the fixed layout and sidebar mini
  //are used together
  sidebarExpandOnHover: false,
  //BoxRefresh Plugin
  enableBoxRefresh: true,
  //Bootstrap.js tooltip
  enableBSToppltip: true,
  BSTooltipSelector: "[data-toggle='tooltip']",
  //Enable Fast Click. Fastclick.js creates a more
  //native touch experience with touch devices. If you
  //choose to enable the plugin, make sure you load the script
  //before SDM's app.js
  enableFastclick: true,
  //Control Sidebar Options
  enableControlSidebar: true,
  controlSidebarOptions: {
    //Which button should trigger the open/close event
    toggleBtnSelector: "[data-toggle='control-sidebar']",
    //The sidebar selector
    selector: ".control-sidebar",
    //Enable slide over content
    slide: true
  },
  //Box Widget Plugin. Enable this plugin
  //to allow boxes to be collapsed and/or removed
  enableBoxWidget: true,
  //Box Widget plugin options
  boxWidgetOptions: {
    boxWidgetIcons: {
      //Collapse icon
      collapse: 'fa-minus',
      //Open icon
      open: 'fa-plus',
      //Remove icon
      remove: 'fa-times'
    },
    boxWidgetSelectors: {
      //Remove button selector
      remove: '[data-widget="remove"]',
      //Collapse button selector
      collapse: '[data-widget="collapse"]'
    }
  },
  //Direct Chat plugin options
  directChat: {
    //Enable direct chat by default
    enable: true,
    //The button to open and close the chat contacts pane
    contactToggleSelector: '[data-widget="chat-pane-toggle"]'
  },
  //Define the set of colors to use globally around the website
  colors: {
    lightBlue: "#3c8dbc",
    red: "#f56954",
    green: "#00a65a",
    aqua: "#00c0ef",
    yellow: "#f39c12",
    blue: "#0073b7",
    navy: "#001F3F",
    teal: "#39CCCC",
    olive: "#3D9970",
    lime: "#01FF70",
    orange: "#FF851B",
    fuchsia: "#F012BE",
    purple: "#8E24AA",
    maroon: "#D81B60",
    black: "#222222",
    gray: "#d2d6de"
  },
  //The standard screen sizes that bootstrap uses.
  //If you change these in the variables.less file, change
  //them here too.
  screenSizes: {
    xs: 480,
    sm: 768,
    md: 992,
    lg: 1200
  }
};

/* ------------------
 * - Implementation -
 * ------------------
 * The next block of code implements SDM's
 * functions and plugins as specified by the
 * options above.
 */
$(function () {
  "use strict";

  
var paramWrapper = A.getUrlParam("wrapper");
if(paramWrapper){
    var wrapperWidth = Number(paramWrapper);
    if(wrapperWidth){
        $(".app-wrapper, .app-footer-inner, .wrapper-inner").css("width", wrapperWidth+"%");
    }else{
        $("body").addClass('no-wrapper');
    }
}

  //Fix for IE page transitions
  $("body").removeClass("hold-transition");

  //Extend options if external options exist
  if (typeof APPCONFIG !== "undefined") {
    $.extend(true,
            $.SDM.options,
            APPCONFIG);
  }

  //Easy access to options
  var o = $.SDM.options;

  //Set up the object
  _init();

  //Activate the layout maker
  $.SDM.layout.activate();

  //Enable sidebar tree view controls
  $.SDM.tree('.sidebar');

  //Enable control sidebar
  if (o.enableControlSidebar) {
    $.SDM.controlSidebar.activate();
  }

  //Add slimscroll to navbar dropdown
  if (o.navbarMenuSlimscroll && typeof $.fn.slimscroll != 'undefined') {
    $(".navbar .menu").slimscroll({
      height: o.navbarMenuHeight,
      alwaysVisible: false,
      size: o.navbarMenuSlimscrollWidth
    }).css("width", "100%");
  }

  if(typeof $.fn.select2 != 'undefined'){
    $("select.select2").select2({
        minimumResultsForSearch: -1
    });
  }

  $('.favs').on('click', function(event) {
        event.preventDefault();
        if($(this).hasClass('no-trigger'))
            return;
        $(this).toggleClass('favsed');
    });

  //Activate sidebar push menu
  if (o.sidebarPushMenu) {
    $.SDM.pushMenu.activate(o.sidebarToggleSelector);
  }

  //Activate Bootstrap tooltip
  if (o.enableBSToppltip) {
    $('body').tooltip({
      selector: o.BSTooltipSelector
    });
  }

  //Activate box widget
  if (o.enableBoxWidget) {
    $.SDM.boxWidget.activate();
  }

  //Activate fast click
  if (o.enableFastclick && typeof FastClick != 'undefined') {
    FastClick.attach(document.body);
  }

  //Activate direct chat widget
  if (o.directChat.enable) {
    $(document).on('click', o.directChat.contactToggleSelector, function () {
      var box = $(this).parents('.direct-chat').first();
      box.toggleClass('direct-chat-contacts-open');
    });
  }

  /*
   * INITIALIZE BUTTON TOGGLE
   * ------------------------
   */
  $('.btn-group[data-toggle="btn-toggle"]').each(function () {
    var group = $(this);
    $(this).find(".btn").on('click', function (e) {
      group.find(".btn.active").removeClass("active");
      $(this).addClass("active");
      e.preventDefault();
    });
  });

});

/* ----------------------------------
 * - Initialize the SDM Object -
 * ----------------------------------
 * All SDM functions are implemented below.
 */
function _init() {
  'use strict';
  /* Layout
   * ======
   * Fixes the layout height in case min-height fails.
   *
   * @type Object
   * @usage $.SDM.layout.activate()
   *        $.SDM.layout.fix()
   *        $.SDM.layout.fixSidebar()
   */
  $.SDM.layout = {
    activate: function () {
      var _this = this;
      _this.fix();
      _this.fixSidebar();
      $(window, ".wrapper").resize(function () {
        _this.fix();
        _this.fixSidebar();
      });

      if(window.parent&&window.parent != window&&A.getUrlParam("layerId"))
          $(".app-wrapper, .app-footer-inner, .wrapper-inner").css({
                width:"auto",
                maxWidth:"100%"
          });
    },
    fix: function () {
      //Get window height and the wrapper height
      var neg = $('.main-header, .app-header').outerHeight() + $('.main-footer, .app-footer').outerHeight();
      var window_height = $(window).height();
      var sidebar_height = $(".sidebar").height();
      var minheight;
      //Set the min-height of the content and sidebar based on the
      //the height of the document.
      if ($("body").hasClass("fixed")) {
        var minheight = window_height - $('.main-footer, .app-footer').outerHeight();
      } else {
        var postSetWidth;
        if (window_height >= sidebar_height) {
            minheight = window_height - neg;
            postSetWidth = window_height - neg;
        } else {
            minheight = sidebar_height;
            postSetWidth = sidebar_height;
        }

        //Fix for the control sidebar height
        var controlSidebar = $($.SDM.options.controlSidebarOptions.selector);
        if (typeof controlSidebar !== "undefined") {
          if (controlSidebar.height() > postSetWidth)
                minheight = controlSidebar.height();
        }
      }
      $(".content-wrapper, .right-side, .app-wrapper").css('min-height', minheight);
      var $fullFrame = $(".full-iframe");
      if($fullFrame.length){
            $("body").addClass('full-hidden');
            var el = $fullFrame.filter(":visible")[0];
            if(!el)
                el = $fullFrame[0];
            var $parents = $(el).parentsUntil(".content-wrapper");
            var _height = 0;
            var h = parseInt($(el).data("height")||"0",10);
            $.each($parents, function() {
                _height = _height + parseInt($(this).css("margin-bottom")||"0",10) + parseInt($(this).css("padding-bottom")||"0",10) + parseInt($(this).css("border-bottom-width")||"0",10);
            });
            var height = $(window).height() - $(el).offset().top - _height + h;
            $fullFrame.height(height);
      }
    },
    fixSidebar: function () {
      //Make sure the body tag has the .fixed class
      if (!$("body").hasClass("fixed")) {
        if (typeof $.fn.slimScroll != 'undefined') {
          $(".sidebar").slimScroll({destroy: true}).height("auto");
        }
        return;
      } else if (typeof $.fn.slimScroll == 'undefined' && window.console) {
        window.console.error("Error: the fixed layout requires the slimscroll plugin!");
      }
      //Enable slimscroll for fixed layout
      if ($.SDM.options.sidebarSlimScroll) {
        if (typeof $.fn.slimScroll != 'undefined') {
          //Destroy if it exists
          $(".sidebar").slimScroll({destroy: true}).height("auto");
          //Add slimscroll
          $(".sidebar").slimscroll({
            height: ($(window).height() - $(".main-header").height()) + "px",
            color: "rgba(0,0,0,0.2)",
            size: "3px"
          });
        }
      }
    }
  };

  /* PushMenu()
   * ==========
   * Adds the push menu functionality to the sidebar.
   *
   * @type Function
   * @usage: $.SDM.pushMenu("[data-toggle='offcanvas']")
   */
  $.SDM.pushMenu = {
    activate: function (toggleBtn) {
      //Get the screen sizes
      var screenSizes = $.SDM.options.screenSizes;

      //Enable sidebar toggle
      $(document).on('click', toggleBtn, function (e) {
        e.preventDefault();
        //Enable sidebar push menu
        if ($(window).width() > (screenSizes.sm - 1)) {
          if ($("body").hasClass('sidebar-collapse')) {
            $("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
          } else {
            $("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
          }
        }
        //Handle sidebar push menu for small screens
        else {
          if ($("body").hasClass('sidebar-open')) {
            $("body").removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.pushMenu');
          } else {
            $("body").addClass('sidebar-open').trigger('expanded.pushMenu');
          }
        }
      });

      $(document).on("click", ".content-wrapper", function () {
        //Enable hide menu when clicking on the content-wrapper on small screens
        if ($(window).width() <= (screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
          $("body").removeClass('sidebar-open');
        }
      });

      //Enable expand on hover for sidebar mini
      if ($.SDM.options.sidebarExpandOnHover
              || ($('body').hasClass('fixed')
                      && $('body').hasClass('sidebar-mini'))) {
        this.expandOnHover();
      }
    },
    expandOnHover: function () {
      var _this = this;
      var screenWidth = $.SDM.options.screenSizes.sm - 1;
      //Expand sidebar on hover
      $('.main-sidebar').hover(function () {
        if ($('body').hasClass('sidebar-mini')
                && $("body").hasClass('sidebar-collapse')
                && $(window).width() > screenWidth) {
          _this.expand();
        }
      }, function () {
        if ($('body').hasClass('sidebar-mini')
                && $('body').hasClass('sidebar-expanded-on-hover')
                && $(window).width() > screenWidth) {
          _this.collapse();
        }
      });
    },
    expand: function () {
      $("body").removeClass('sidebar-collapse').addClass('sidebar-expanded-on-hover');
    },
    collapse: function () {
      if ($('body').hasClass('sidebar-expanded-on-hover')) {
        $('body').removeClass('sidebar-expanded-on-hover').addClass('sidebar-collapse');
      }
    }
  };

  /* Tree()
   * ======
   * Converts the sidebar into a multilevel
   * tree view menu.
   *
   * @type Function
   * @Usage: $.SDM.tree('.sidebar')
   */
  $.SDM.tree = function (menu) {
    var _this = this;
    var animationSpeed = $.SDM.options.animationSpeed;
    $(document).on('click', menu + ' li a', function (e) {
      //Get the clicked link and the next element
      var $this = $(this);
      var checkElement = $this.next();

      //Check if the next element is a menu and is visible
      if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
        //Close the menu
        checkElement.slideUp(animationSpeed, function () {
          checkElement.removeClass('menu-open');
          //Fix the layout in case the sidebar stretches over the height of the window
          //_this.layout.fix();
        });
        checkElement.parent("li").removeClass("active");
      }
      //If the menu is not visible
      else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
        //Get the parent menu
        var parent = $this.parents('ul').first();
        //Close all open menus within the parent
        var ul = parent.find('ul:visible').slideUp(animationSpeed);
        //Remove the menu-open class from the parent
        ul.removeClass('menu-open');
        //Get the parent li
        var parent_li = $this.parent("li");

        //Open the target menu and add the menu-open class
        checkElement.slideDown(animationSpeed, function () {
          //Add the class active to the parent li
          checkElement.addClass('menu-open');
          parent.find('li.active').removeClass('active');
          parent_li.addClass('active');
          //Fix the layout in case the sidebar stretches over the height of the window
          _this.layout.fix();
        });
      }
      //if this isn't a link, prevent the page from being redirected
      if (checkElement.is('.treeview-menu')) {
        e.preventDefault();
      }else{
        $(menu+" .active").removeClass('active');
        $this.parentsUntil('.sidebar-menu').filter("li").addClass('active');
      }
    });
  };

  /* ControlSidebar
   * ==============
   * Adds functionality to the right sidebar
   *
   * @type Object
   * @usage $.SDM.controlSidebar.activate(options)
   */
  $.SDM.controlSidebar = {
    //instantiate the object
    activate: function () {
      //Get the object
      var _this = this;
      //Update options
      var o = $.SDM.options.controlSidebarOptions;
      //Get the sidebar
      var sidebar = $(o.selector);
      //The toggle button
      var btn = $(o.toggleBtnSelector);

      //Listen to the click event
      btn.on('click', function (e) {
        e.preventDefault();
        //If the sidebar is not open
        if (!sidebar.hasClass('control-sidebar-open')
                && !$('body').hasClass('control-sidebar-open')) {
          //Open the sidebar
          _this.open(sidebar, o.slide);
        } else {
          _this.close(sidebar, o.slide);
        }
      });

      //If the body has a boxed layout, fix the sidebar bg position
      var bg = $(".control-sidebar-bg");
      _this._fix(bg);

      //If the body has a fixed layout, make the control sidebar fixed
      if ($('body').hasClass('fixed')) {
        _this._fixForFixed(sidebar);
      } else {
        //If the content height is less than the sidebar's height, force max height
        if ($('.content-wrapper, .right-side').height() < sidebar.height()) {
          _this._fixForContent(sidebar);
        }
      }
    },
    //Open the control sidebar
    open: function (sidebar, slide) {
      //Slide over content
      if (slide) {
        sidebar.addClass('control-sidebar-open');
      } else {
        //Push the content by adding the open class to the body instead
        //of the sidebar itself
        $('body').addClass('control-sidebar-open');
      }
    },
    //Close the control sidebar
    close: function (sidebar, slide) {
      if (slide) {
        sidebar.removeClass('control-sidebar-open');
      } else {
        $('body').removeClass('control-sidebar-open');
      }
    },
    _fix: function (sidebar) {
      var _this = this;
      if ($("body").hasClass('layout-boxed')) {
        sidebar.css('position', 'absolute');
        sidebar.height($(".wrapper").height());
        $(window).resize(function () {
          _this._fix(sidebar);
        });
      } else {
        sidebar.css({
          'position': 'fixed',
          'height': 'auto'
        });
      }
    },
    _fixForFixed: function (sidebar) {
      sidebar.css({
        'position': 'fixed',
        'max-height': '100%',
        'overflow': 'auto',
        'padding-bottom': '50px'
      });
    },
    _fixForContent: function (sidebar) {
      $(".content-wrapper, .right-side").css('min-height', sidebar.height());
    }
  };

  /* BoxWidget
   * =========
   * BoxWidget is a plugin to handle collapsing and
   * removing boxes from the screen.
   *
   * @type Object
   * @usage $.SDM.boxWidget.activate()
   *        Set all your options in the main $.SDM.options object
   */
  $.SDM.boxWidget = {
    selectors: $.SDM.options.boxWidgetOptions.boxWidgetSelectors,
    icons: $.SDM.options.boxWidgetOptions.boxWidgetIcons,
    animationSpeed: $.SDM.options.animationSpeed,
    activate: function (_box) {
      var _this = this;
      if (!_box) {
        _box = document; // activate all boxes per default
      }
      //Listen for collapse event triggers
      $(_box).on('click', _this.selectors.collapse, function (e) {
        e.preventDefault();
        _this.collapse($(this));
      });

      //Listen for remove event triggers
      $(_box).on('click', _this.selectors.remove, function (e) {
        e.preventDefault();
        _this.remove($(this));
      });
    },
    collapse: function (element) {
      var _this = this;
      //Find the box parent
      var box = element.parents(".box").first();
      //Find the body and the footer
      var box_content = box.find("> .box-body, > .box-footer, > form  >.box-body, > form > .box-footer");
      if (!box.hasClass("collapsed-box")) {
        //Convert minus into plus
        element.children(":first")
                .removeClass(_this.icons.collapse)
                .addClass(_this.icons.open);
        //Hide the content
        box_content.slideUp(_this.animationSpeed, function () {
          box.addClass("collapsed-box");
        });
      } else {
        //Convert plus into minus
        element.children(":first")
                .removeClass(_this.icons.open)
                .addClass(_this.icons.collapse);
        //Show the content
        box_content.slideDown(_this.animationSpeed, function () {
          box.removeClass("collapsed-box");
        });
      }
    },
    remove: function (element) {
      //Find the box parent
      var box = element.parents(".box").first();
      box.slideUp(this.animationSpeed);
    }
  };

  /**
  ** load
  ***/
  $.SDM.defaults.load = {
      url:'',
      target:'',
      method:"html",
      success: $.noop,
      error: $.noop,
      complete: $.noop,
      sources: null,
      noasync: false,
      nocache: false
  };
  $.SDM.load = function(args){
    var opt = $.extend(true, {}, $.SDM.defaults.load, args || {});
    if(!opt.url)
        return;
     $.ajax({
        url: opt.url,
        dataType: 'html',
        async: opt.sync ? false : true,
        cache: opt.nocache ? false : true
    })
    .done(function(data, textStatus, jqXHR) {
        $(opt.target)[opt.method](opt.sources ? APP.tpl(data).render(opt.sources) : data);
        $.SDM.layout.fix();
        $.isFunction(opt.success)&&opt.success.apply(this, arguments);
    })
    .fail(function( jqXHR, textStatus, error) {
        $(opt.target)[opt.method]('加载失败');
        $.isFunction(opt.error)&&opt.error.apply(this, arguments);
    })
    .always(function(data, textStatus, jqXHR){
        $.isFunction(opt.complete)&&opt.complete.apply(this, arguments);
    });
    
  };

  /**
    count
  **/
  $.SDM.countBar = function(el){
        var $val = $(el).children();
        var val = "0%";
        if($val){
            val = $val.data("count");
        }
        $val.stop().animate({width: val},700);
  }

  /**
    stars
  **/
  $.SDM.stars = function(el){

        var left = $(el).offset().left;
        var width = $(el).width();

        $(el).click(function(event) {

            var  delta = event.pageX - left;
            if(delta<0){
                delta = 0;
            }           
            if(delta>width)
                delta = width;

            var stars = Math.ceil(5*delta/width);

            $(el).children().width(100*stars/5+"%");
            $(el).data("stars-val", stars);
        });
  }

}

/* ------------------
 * - Custom Plugins -
 * ------------------
 * All custom plugins are defined below.
 */

/*
 * BOX REFRESH BUTTON
 * ------------------
 * This is a custom plugin to use with the component BOX. It allows you to add
 * a refresh button to the box. It converts the box's state to a loading state.
 *
 * @type plugin
 * @usage $("#box-widget").boxRefresh( options );
 */
(function ($) {

  "use strict";

  $.fn.boxRefresh = function (options) {

    // Render options
    var settings = $.extend({
      //Refresh button selector
      trigger: ".refresh-btn",
      //File source to be loaded (e.g: ajax/src.php)
      source: "",
      //Callbacks
      onLoadStart: function (box) {
        return box;
      }, //Right after the button has been clicked
      onLoadDone: function (box) {
        return box;
      } //When the source has been loaded

    }, options);

    //The overlay
    var overlay = $('<div class="overlay"><div class="fa fa-refresh fa-spin"></div></div>');

    return this.each(function () {
      //if a source is specified
      if (settings.source === "") {
        if (window.console) {
          window.console.log("Please specify a source first - boxRefresh()");
        }
        return;
      }
      //the box
      var box = $(this);
      //the button
      var rBtn = box.find(settings.trigger).first();

      //On trigger click
      rBtn.on('click', function (e) {
        e.preventDefault();
        //Add loading overlay
        start(box);

        //Perform ajax call
        box.find(".box-body").load(settings.source, function () {
          done(box);
        });
      });
    });

    function start(box) {
      //Add overlay and loading img
      box.append(overlay);

      settings.onLoadStart.call(box);
    }

    function done(box) {
      //Remove overlay and loading img
      box.find(overlay).remove();

      settings.onLoadDone.call(box);
    }

  };

})(jQuery);

/*
 * EXPLICIT BOX ACTIVATION
 * -----------------------
 * This is a custom plugin to use with the component BOX. It allows you to activate
 * a box inserted in the DOM after the app.js was loaded.
 *
 * @type plugin
 * @usage $("#box-widget").activateBox();
 */
(function ($) {

  'use strict';

  $.fn.activateBox = function () {
    $.SDM.boxWidget.activate(this);
  };

})(jQuery);

/*
 * TODO LIST CUSTOM PLUGIN
 * -----------------------
 * This plugin depends on iCheck plugin for checkbox and radio inputs
 *
 * @type plugin
 * @usage $("#todo-widget").todolist( options );
 */
(function ($, A) {

  'use strict';

  $.fn.todolist = function (options) {
    // Render options
    var settings = $.extend({
      //When the user checks the input
      onCheck: function (ele) {
        return ele;
      },
      //When the user unchecks the input
      onUncheck: function (ele) {
        return ele;
      }
    }, options);

    return this.each(function () {

      if (typeof $.fn.iCheck != 'undefined') {
        $('input', this).on('ifChecked', function () {
          var ele = $(this).parents("li").first();
          ele.toggleClass("done");
          settings.onCheck.call(ele);
        });

        $('input', this).on('ifUnchecked', function () {
          var ele = $(this).parents("li").first();
          ele.toggleClass("done");
          settings.onUncheck.call(ele);
        });
      } else {
        $('input', this).on('change', function () {
          var ele = $(this).parents("li").first();
          ele.toggleClass("done");
          if ($('input', ele).is(":checked")) {
            settings.onCheck.call(ele);
          } else {
            settings.onUncheck.call(ele);
          }
        });
      }
    });
  };


  $(function(){
    var utils = $.SDM.utils;
    var appload = A.getUrlParam("appload");
        $("[data-load]").each(function() {
            var url = $(this).data("load"),
                require = $(this).data("require"),
                loads = appload ? appload.split("|") : [],
                isload;
            
            if(!url)
                return $(this).remove();
            $.each(loads, function(index, load) {
                if(new RegExp(load,'g').test(url))
                    return isload = true;
            });
            if(appload&&!isload&&!require)
                return $(this).remove();
            var attrs = utils.dataAttrs(this, ['method','nocache','sync','success','error','complete','sources']);
            if(attrs.sources){
                attrs.sources = utils.dataAttrFilter(attrs.sources);
            }
            if(/^fn\./.test(attrs.success)){
                var success = attrs.success.split(".")[1];
                attrs.success = APP.fn(success);
            }
            if(/^fn\./.test(attrs.error)){
                var error = attrs.error.split(".")[1];
                attrs.error = APP.fn(error);
            }
            if(/^fn\./.test(attrs.complete)){
                var complete = attrs.complete.split(".")[1];
                attrs.complete = APP.fn(complete);
            }
            $.SDM.load($.extend(true, {url: url, target: this}, attrs));
        });
      /***
      **** 日期控件
      **/

      if(typeof $.fn.daterangepicker != 'undefined'){
        $(".date-picker").each(function(index, el) {
            $(el).daterangepicker({
                singleDatePicker:true,
                locale:{
                    format: utils.dataAttr(el, "format", "YYYY-MM-DD")
                },
                timePicker: utils.dataAttr(el, "timepicker", true)
            });
        });

        $('.date-rangepicker').each(function(index, el) {
            $(el).daterangepicker({
                singleDatePicker:false,
                locale:{
                    format: utils.dataAttr(el, "format", "YYYY-MM-DD"),
                    separator: utils.dataAttr(el, "separator", " ~ ")
                },
                timePicker: utils.dataAttr(el, "timepicker", true)
            });
        });
      }

    /**
     * 美化滚动条
     */
    if(typeof $.fn.slimscroll!=='undefined'){
      $("[data-slimscroll]").each(function(index, el) {
        $(el).slimscroll({
            height: $(el).data("height") || $(el).data("data-slimscroll"),
            size:'4px'
        });
      });
    }

    /**
    ** 美化单选多选
    **/
    if(typeof $.fn.iCheck!=='undefined'){
        $('input[type="checkbox"].form-control, input[type="radio"].form-control').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue'
        });
    }

    /**
     * * 下拉菜单
     */
    $('.dropdown-toggle').dropdown();
  });
}(jQuery, window.APP));