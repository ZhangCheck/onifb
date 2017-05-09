/**
 * Created by CHECK on 2015/10/9.
 */
define(['./mmRequest/mmRequest','./cookie/avalon.cookie','css!./chameleon/fb.core.css','./json2'],function(){
    /**@namespace fb**/
    var fb = window.fb||{};
    fb.version = "1.0.1"
    fb.server = ""
    /**
     * 获取Html地址栏中的参数
     * @param name
     * @param [defaultValue]
     * @returns {null}
     */
    fb.getHtmlArg = function(name,defaultValue){
        var reg = new RegExp("(\\?|&)"+ name +"=([^&#]*)(&|#)?");
        var r = window.location.href.match(reg);
        if(r!=null)
            return  unescape(r[2]);//todo: move to reg
            
        return defaultValue;
    }
    
    fb.fbMode =fb.getHtmlArg("fbMode",-1);
    if(fb.fbMode != -1){
        avalon.cookie.set("fbMode",fb.fbMode,{path:"/",httpOnly:false});
    }else{
        fb.fbMode = avalon.cookie.get("fbMode",5);
    }
    fb.rootPath = require.baseUrl?require.baseUrl.replace("/js",""):"";

    /**@namespace fb.math**/
    fb.math = fb.math||{};

    fb.log = function(){
        var now = new Date();
        var msg = fb.format("[{0}:{1}:{2} {3}] ",now.getHours(),now.getMinutes(),now.getSeconds(),now.getMilliseconds()) ;

        if(arguments.length==0){
            msg = "\n";
        }
        if(fb.isDebug){
            if(!fb.logs) fb.logs=[];
            if(fb.logs.length>300) fb.logs.splice(0,fb.logs.length-300);
        }

        for(var i=0;i<arguments.length;i++){
            msg += arguments[i] + " ";
        }
        if(fb.isDebug){
            fb.logs.push(msg);
        }
        avalon.log(msg);
    };

    /**
     * 格式化字符串
     * @returns {String}
     */
    fb.format=function(){
        if( arguments.length == 0 )
            return null;

        var str = arguments[0];
        for(var i=1;i<arguments.length;i++) {
            var re = new RegExp('\\{' + (i-1) + '\\}','gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    }

    
    /**
     * 获取router下的url中的参数
     * @param name {String} 参数名
     * @param [stateName] {String} 状态名
     */
    fb.getStateParam = function(name,stateName){
        if(mmState && mmState.currentState && mmState.currentState.params) {
            return mmState.currentState.params[name];
        }
        return null;
    }

    /**
     * 获取router下的url中的问号后参数
     * @param name参数名
     */
    fb.getStateQuery = function(name){
        if(mmState) {
            var queryObj  = mmState.query;
            return queryObj[name];
        }
        return "";
    }
    /**
     * 设置Html地址的参数
     * @param data {Object}
     * @param [url] {String}
     */
    fb.setHtmlArg = function(data,url){
        if(url===void(0)) url = window.location.href;
        avalon.each(data,function(k,v){
            var exp = new RegExp("([&?])"+k+"=([^&=?]*)");
            if(exp.test(url)){
                url = url.replace(exp,RegExp.$1+k+"="+v);
            }else{
                url += (url.indexOf("?")>0?"&":"?")+k+"="+v;
            }
        })
        return url;
    }

    /**
     * 弹出警告框
     * @param msg
     * @param [title=""]
     * @param [modal=false]
     */
    fb.alert = function(msg,title,modal){
        if(title===void(0)) title="";
        if(modal===void(0)) modal=false;
        avalon.log(title,msg);
        alert(title+msg)
        //avalon.vmodels["interfaceDialog"].title = title;
        //avalon.vmodels["interfaceDialog"].setContent(msg);
    }

    /**@class fb.InterfaceStruct**/
    fb.InterfaceStruct={
        name:"",
        data:null,
        remoteUrl:"",
        localUrl:"",
        type:"POST",
        async:true, //受syncTarget影响
        syncTarget:null,//同步请求时，数据存放目标
        view:/**@type string**/null,
        success:/**@type Function**/null,
        error:/**@type Function**/null,
        isStandard:true,
        alert:/**@type Function**/null
    };

    /**@class fb.ajaxStruct**/
    fb.ajaxStruct={
        url:"",
        type:"",
        dataType:"",
        data:"",
        success:/**@type Function()**/null,
        error:/**@type Function()**/null
    }

    fb.interfaceConfigStruct = {
        _alertCount:0,
        postLabel:null,
        _stateIndex:-1,
        stateTemplate:"",
        alert: /**@type Function**/function (interfaceObj, /**@type avalon.Promise**/ms, message, log, isNew) {
            try {
                if (ms === void(0)) {
                    var vm = interfaceObj._stateVm
                    if (interfaceObj.view && vm) {
                        vm.stateMsg = "";
                        vm.visible = false;
                        //$(interfaceObj.view).removeClass("noData").find(">.interfaceState").remove();
                        //delete interfaceObj._stateVm;
                    }
                    return;
                }
                if (!message) message = "暂无数据..."
                fb.log();
                if (isNew) this._alertCount++;
                fb.log(fb.format("---------{0}---------", this._alertCount))
                fb.log(message);
                fb.log("Url:", interfaceObj.isLocal ? interfaceObj.localUrl : interfaceObj.remoteUrl);
                if (interfaceObj.data) fb.log("Data:", JSON.stringify(interfaceObj.data))
                fb.log("Log:", log);
                fb.log("Response:", ms.status == "200" ? ms.responseText : ms.statusText);
                fb.log("View:", interfaceObj.view);
                fb.log("------------------");

                if (interfaceObj.alert) {
                    interfaceObj.alert(interfaceObj, ms, message, log, isNew)
                } else {
                    if (interfaceObj.view) {
                        var $div,vm;
                        if (!interfaceObj._stateVm) {
                            var $view =  $(interfaceObj.view), view = $view.get(0), id = "iState" + ++this._stateIndex;
                            $div = $(fb.format(this.stateTemplate,id));
                            if (view.childNodes.length > 0) {
                                view.insertBefore($div.get(0), view.childNodes[0]);
                            } else {
                                $view.append($div);
                            }

                            //创建vm
                            vm = interfaceObj._stateVm = avalon.define({
                                $id:id,
                                isLoading:false,
                                stateMsg:"",
                                visible:true
                            })
                            avalon.scan($div.get(0),vm);

                        }else {
                            $div = $(interfaceObj.view).find(">.interfaceState");
                        }
                        if(vm){
                            vm.visible = true;
                            vm.isLoading = isNew;
                            vm.stateMsg = message;
                        }

                    }
                }
            } catch (ex) {
                fb.log("alert error:", ex);
            }
        },
        /*extendDataCheck: function (interfaceObj, ms, data) {
         if (data.data != null) {
         if (data.data.total !== void(0) && data.data.rows == null) {
         this.alert(interfaceObj, ms, null, "'rows' is null");
         return false;
         }
         if (Array.isArray(data.data.rows) && data.data.rows.length == 0) {
         this.alert(interfaceObj, ms, null, "'rows' is []");
         return false;
         }
         }
         return true;
         },*/
        _callback:function(interfaceObj,ms,data){
            this.alert(interfaceObj);//清空错误提示
            try{
                interfaceObj.success(data,interfaceObj,ms);
            }catch(ex){
                this.alert(interfaceObj,ms,null,"回调函数出错:"+ex+"\n"+ex.stack);
            }
        },
        success:function(interfaceObj,ms,data){
            if(data!=null){
                if(data.errorCode!=void(0)){
                    this.error(interfaceObj,ms,"Warning:出错时接口不应该返回200状态")
                }else if(data.errorcode!=void(0)){
                    this.error(interfaceObj,ms,"Warning:出错时接口不应该返回200状态,'errorcode'应为'errorCode'")
                }else{
                    if(Array.isArray(data.data) && data.data.length==0){
                        this.alert(interfaceObj,ms,null,"接口返回为空数组");
                    }else{
                        this._callback(interfaceObj,ms,data);
                    }
                }
                

            }else{
                this.alert(interfaceObj,ms,null,"返回数据不存在");
            }
        },

        error:function(interfaceObj,ms,message){
            if(message===void(0)) message="";
            if(!ms){
                this.alert(interfaceObj,{},null,message);
            }else if(ms.status=="200"){
                this.alert(interfaceObj,ms,null,"JSON格式有误"+message);
            }else if(ms.status=="404"){
                this.alert(interfaceObj,ms,null,"404连接失败..."+message);
            }else if(ms.status=="500"){
                var responseJSON = eval("(" + ms.responseText + ")");
                alert(responseJSON.errorCode + ": " + responseJSON.message);
                this.alert(interfaceObj,ms,data,"接口错误");
            }else{
                this.alert(interfaceObj,ms,null,"未知错误 状态码:"+ms.status+message);
            }

            if(fb.state(fb.fbMode,8) && !interfaceObj.isLocal){
                interfaceObj.isLocal=true;
                fb.requestJson(interfaceObj,true);
            }

            if(interfaceObj.error) interfaceObj.error(ms);
        },
        complete:function(interfaceObj,ms){
            if(interfaceObj.complete) interfaceObj.complete(interfaceObj,ms);
        },
        extendDataCheck:function(data){
            return true;
        },
        dataFormat:null

    }
    fb.config = {
        interface:fb.interfaceConfigStruct
    };


    /**
     * As jquery
     * @param selector
     * @returns {AsJquery}
     */
    if(!window.$){
        window.$=function(selector){
            if(selector instanceof AsJquery) return selector;
            return new AsJquery(selector);
        }
    }
    /**
     *
     * @param selector {String|Element}
     * @returns {AsJquery}
     * @constructor
     */
    var AsJquery = function(selector){
        this.els = [];
        this.length = 0;
        if(selector===void(0)) return this;//||selector==""||selector==null
        try{
            if(typeof selector=="string"){
                if(selector.match(/<(\w*)(.*)\/?>/)){
                    var p = document.createElement("div"),t=this;
                    p.innerHTML = selector;
                    avalon.each(p.childNodes,function(i,e){
                        t.els.push(e);
                    })
                }else{
                    this.els = document.querySelectorAll(selector);
                }
            }else{
                this.els.push(selector);
            }
        }catch(ex){
            fb.log("AsJquery Error:",ex,ex.stack);
        }
        this.length=this.els.length;
    }
    
    AsJquery.id = 0;
    AsJquery.prototype = {
        generateId:function(){
            return this.each(function(i,e){
                var id = e.getAttribute("id");
                if(!id) id = "aq"+ AsJquery.id++;
                e.setAttribute("id",id);
            })
        },
        attr:function(name,value){
            if(this.els.length==0) return undefined;
            if(value===void(0)){
                return this.els[0]?this.els[0].getAttribute(name):null;
            }else{
                return this.each(function(i,e){
                    if(typeof name == "object"){
                        avalon.each(name,function(k,v){e.setAttribute(k,v);})
                    }else{
                        e.setAttribute(name,value);
                    }
                })
            }
        },
        add:function(selector){
            var newAq;
            if(selector instanceof AsJquery){
                newAq = selector;
            }else{
                newAq = $(selector);
            }
            newAq.each(function(i,e){
                this.els.push(e);
                this.length = this.els.length;
            })
        },
        /**
         *
         * @param selector {String}
         * @returns {AsJquery}
         * @example ">div"
         */
        find:function(selector){
            var cls = new AsJquery()
            for (var i = this.els.length - 1; i >= 0; i--) {
                var id = this.els[i].getAttribute("id");
                if(!id) id = "aq"+ AsJquery.id++;
                this.els[i].setAttribute("id",id);
                var finds = document.querySelectorAll("#"+id+(selector.charAt(0)==">"?"":" ")+selector);
                if(finds){
                    avalon.each(finds,function(i,e){
                        cls.els.push(e);
                        cls.length=cls.els.length;
                    })
                }
            }
            return cls;
        },

        remove: function(){
            return this.each(function(i,e){
                if(e.parentNode) e.parentNode.removeChild(e);
            })
        },
        css : /**@name {String|Object}**/function(name,value){
            if(value===void(0) && typeof name=="string" ) return this.length>0?avalon.css(this.els[0],name):this;
            var obj = null;
            if(avalon.isPlainObject(name)){
                obj = name;
            }else{
                obj = {};
                obj[name]=value;
            }
            for(var p in obj){
                for (var i = this.els.length - 1; i >= 0; i--) {
                    if(this.els[i]) avalon.css(this.els[i],p,obj[p]);
                }
            }
            return this;
        },
        empty : function(){
            return this.each(function(i,e){avalon.clearHTML(e)});
        },
        width : function(v){
            if(v!==void(0)){ if(typeof v == "number")  v+="px"; this.css("width",v); return this; }
            var w=0; if(this.els.length>0) w=avalon(this.els[0]).outerWidth();return  w;
        },
        height:function(v){
            if(v!==void(0)){  if(typeof v == "number")   v+="px";this.css("height",v);return this;}
            var h=0; if(this.els.length>0) h=avalon(this.els[0]).outerHeight();return  h;
        },
        eq:function(index){
            if(this.length>0&&index<this.length){
                return $(this.els[index])
            }
            return $();
        },
        get: /** return {Element} **/function(i){
            if(i<this.els.length){return this.els[i];} return null;
        },
        addClass:function(v){
            return this.each(function(i,e){
                avalon(e).addClass(v);
            })
        },
        removeClass:function(v){
            return this.each(function(i,e){avalon(e).removeClass(v);})
        },
        toggleClass:function(v){
            return this.each(function(i,e){ avalon(e).toggleClass(v);})
        },
        hasClass:function(v){
            return avalon(this.els[0]).hasClass(v);
        },
        parent:function(){
            return $(this.get(0).parentNode)
        },
        each:function(callback){
            for (var i = this.els.length - 1; i >= 0; i--) {
                callback(i,this.els[i]);
            } return this;
        },
        appendTo:function(v){
            return this.each(function(i,c){
                $(v).each(function(j,p){
                    p.appendChild(c);
                })
            });
        },
        append:function(v){
            return this.each(function(i,p){
                $(v).each(function(j,c){
                    p.appendChild(c);
                })
            });
        },
        hide:function(){
            return this.css("display","none");
        },
        show:function(){
            return this.css("display","");
        },

        bind:function(e,f,p){
            return this.each(function(i,d){
                avalon.bind(d,e,f,p);
            })
        },
        unbind:function(e,f,p){
            return this.each(function(i,d){ avalon.unbind(d,e,f,p)})
        },
        html:function(v){
            if(v===void(0)){
                return this.els.length>0?this.els[0].innerHTML:null;
            }else{
                return this.each(function(i,e){
                    avalon.innerHTML(e,v);
                })
            }
        },
        text:function(v){
            if(v===void(0)){
                return this.els.length>0?this.els[0].textContent:null;
            }else{
                return this.each(function(i,e){
                    e.textContent = v;
                })
            }
        }
    }

    /*if(!document.getElementById("interfaceDialog")){
     var dialog = document.createElement("div");
     dialog.innerHTML = '<div ms-widget="dialog,interfaceDialog,$aaOpts" id="interfaceDialog"></div>';
     document.body.appendChild(dialog);
     }*/

    /**
     * 读取远程数据
     * @param interfaceObj {fb.InterfaceStruct}
     * @param [isLocal=false]
     */
    fb.requestJson = function(interfaceObj){
        if((!interfaceObj.isLocal && fb.state(fb.fbMode,16)) || (fb.state(fb.fbMode,8) && !interfaceObj.isLocal && (!interfaceObj.remoteUrl || interfaceObj.remoteUrl==""))){
            interfaceObj.isLocal=true;
            return fb.requestJson(interfaceObj);
        }
        if(interfaceObj.isLocal && fb.state(fb.fbMode,1)) {
            fb.log("fbMode配置错误")
            return;
        };
        var url = interfaceObj.isLocal?interfaceObj.localUrl:interfaceObj.remoteUrl
        //if(!/^\./.test(url)&&!/http/.test(url)&&!interfaceObj.isLocal){
        //    url = "http://" + url
        //}
        if(interfaceObj.isLocal) fb.log("加载本地数据:",url);

        var uploadData = {};
        if(interfaceObj.type=="POST"){
        	if(fb.config.interface.postLabel){
        		uploadData[fb.config.interface.postLabel] = JSON.stringify(interfaceObj.data)
        	}else{
        		uploadData = JSON.stringify(interfaceObj.data)
        	}
        }else{
            uploadData = interfaceObj.data;
        }
        var config = {
            type:interfaceObj.isLocal?"GET":interfaceObj.type,
            url:url,
            dataType:"json",
            contentType : fb.config.interface.postLabel?"application/x-www-form-urlencoded; charset=UTF-8":"application/json",
            data:uploadData,
            async:interfaceObj.async===void(0)?true:interfaceObj.async,
            success:function(data,msState,ms){
                fb.log("接口访问成功:",url);
				if(typeof data == 'string'){
					data = JSON.parse(data);
				}
                if(fb.config.interface.dataFormat){
                    data = fb.config.interface.dataFormat(data);
                }

                fb.config.interface.success(interfaceObj,ms,data);
            },
            error:function(ms,msState){
                fb.log("接口访问失败:",url);
                fb.config.interface.error(interfaceObj,ms);
            },
            complete:function(ms,msState){
                fb.config.interface.complete(interfaceObj,ms);
            }
        }



        fb.config.interface.alert(interfaceObj);
        var promise;
        try{
            promise = avalon.ajax(config);
        }catch (ex){
            fb.config.interface.error(interfaceObj,null,"接口访问异常:"+ex+(ex.stack?ex.stack:""));
        }
        if(promise && config.async) fb.config.interface.alert(interfaceObj,promise,"信息加载中...",null,true);
        return promise;
    }

    /**
     * 读取远程数据--POST方式
     * @param interfaceObj {fb.InterfaceStruct} url地址或配置的接口对象
     */
    fb.postJson = function(interfaceObj){
        interfaceObj.type = "POST";
        fb.requestJson(interfaceObj);
    };

    /**
     * 读取远程数据--GET方式
     * @param interfaceObj {String|fb.InterfaceStruct} url地址或配置的接口对象
     */
    fb.getJson = function(interfaceObj){
        interfaceObj.type = "GET";
        fb.requestJson(interfaceObj);
    }

    function getChildVM(expr, vm, strLen) {
        var t = vm, pre, _t;
        for (var i = 0, len = expr.length; i < len; i++) {
            var k = expr[i];
            _t = t.$model || t;
            if (typeof _t[k] !== 'undefined') {
                pre = t;
                t = t[k];
            } else {
                return;
            }
        }
        if (strLen > 1) {
            return pre[k];
        } else {
            return pre;
        }
    }
    // 在一堆VM中，提取某一个VM的符合条件的子VM
    // 比如 vm.aaa.bbb = {} ;
    // avalon.getModel("aaa.bbb", vmodels) ==> ["bbb", bbbVM, bbbVM所在的祖先VM（它位于vmodels中）]
    fb.getModel = function(expr, vmodels){
        if (!expr) {
            return null;
        }
        var str = expr.split('.'),
            strLen = str.length,
            last = str[strLen-1];
        if (str.length != 1) {
            str.pop();
        }
        for (var i = 0, len = vmodels.length; i < len; i++) {
            var ancestor = vmodels[i];
            var child = getChildVM(str, ancestor, strLen);
            if (typeof child !== 'undefined' && (child.hasOwnProperty(last) || Object.prototype.hasOwnProperty.call(child, last))) {
                return [last, child, ancestor];
            }
        }
        return null;
    }

    /**
     * 深度观察
     * @param model
     * @param watch
     * @param callback
     * @param [deep=10]
     */
    fb.watchCollection=function(model,watch,callback,deep){
        if(deep==0){
            return;
        }
        model.$watch(watch,callback);
        var obj=model, $obj = model.$model, propertes = watch.split(".");

        for(var i=0;i<propertes.length;i++){
            if(!$obj){
                return;
            }
            $obj = $obj[propertes[i]];
            obj = obj[propertes[i]];
        }

        if(deep===void(0)) deep = 10;
        obj.$watch(watch,callback);

        if(avalon.isPlainObject($obj)){
            var prop = $obj,curDeep=0;
            for(var key in $obj){
                obj.$watch(key,callback);
                avalon.log("fb watch",watch+"."+key);
                curDeep++;

                if(avalon.isPlainObject($obj[key])){
                    fb.watchCollection(model,watch+"."+key,callback,deep-1);
                }
            }
        }else if(Array.isArray($obj)){
            //todo: watch array item

        }
    }

    /**
     * 解除深度观察
     * @param $obj
     * @param objName
     * @param callback
     * @param deep
     */
    fb.unwatchPlainObj=function($obj,objName,callback,deep){

    }

    /**
     * ��ȫ�޸�vm����
     * @param $obj
     * @param property
     * @param [value] Ϊ��ʱΪɾ��
     * @returns {{}}
     */
    fb.safeChangeObj=function($obj,property,value){
        var temp = {},prop=temp;
        avalon.mix(temp,$obj);
        var propertes = property.split(".");

        for(var i=0;i<propertes.length;i++){
            prop = prop[propertes[i]];
        }
        if(value===void(0)){
            delete prop;
        }else{
            prop = value;
        }

        return temp;
    }

    /**
     * 更改对象属性并触发视图更新（不推荐）
     * @param $obj
     * @param property
     * @returns {{}}
     */
    fb.safeDeleteObjProp=function($obj,property){
        return fb.safeChangeObj($obj,property);
    }

    /**
     * �۲촿��������������
     * @param model
     * @param watch
     * @param callback
     * @param [deep]
     */
    /*fb.watchPlainObj=function($model,target,callback,deep){

     }*/

    /**
     *
     * @param url
     * @param [toHead=true]
     */
    fb.getStyle=function(url,toHead){
        fb.log("addStyle:",url)
        if(toHead===void(0)) toHead=true;

        var link = $('link[href="'+url+'"]').get(0);
        if(link){
            fb.log("has exit");
            $(link).remove();
        }

        link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        if(toHead){
            fb.log("addStyle to head")
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(link);
            fb.log("addStyle to head end")
        }
        return link;
    }

    fb.removeStyle=function(url){
        fb.log("remove style:",url)
        var link = $('link[href="'+url+'"]');
        link.remove();
    }

    /**
     * 百分数转小数
     * @param v{String}
     */
    fb.math.percentToNumber=function(v){
        if(typeof v == "string" && v.indexOf("%")>0){
            return parseFloat(v.replace("%",""))/100;
        }else{
            throw new Error("无效百分数")
        }
    }
    /**
     * 小数转百分数
     * @param v{Number}
     * @param [deciment=0]{Number}
     */
    fb.math.numberToPercent=function(v,deciment){
        if(deciment===void(0)) deciment=0;
        if(typeof v == "number"){
            return (v*100).toFixed(deciment)+"%";
        }else{
            throw new Error("非小数")
        }
    }

    fb.state = function(room,seat,person){
        return person===void(0) ? (room&seat)==seat : ((person?(room|=seat):(room&=~seat))||1 ?fb:0);
    }


    fb.load=function(url,selectorOrElem,callback){
        var elem=null,title,selector="";
        if(typeof selectorOrElem==="string"){
            selector=selectorOrElem;
        }else if(selectorOrElem instanceof HTMLElement){
            elem=selectorOrElem;
        }else{
            console.log(selectorOrElem)
            console.error("请传入正确格式参数")
            return;
        }
        try{
          elem||(elem=document.querySelector(selector));

        }catch(e){
           console.warn("此浏览器不支持选择器，应使用ID选择元素");
            (selector.trim()).replace("#",function(id){
                elem=document.getElementById(id)
            })
        }
        if(!elem&&selector) {
            console.warn("选择器[ "+selector+" ]无法匹配到任何元素")
            return;
        };
        require(["text!"+url||""],function(doc){
            avalon.innerHTML(elem,doc);
            try{
                title=elem.getElementsByTagName("title")[0].innerHTML;
            }
            catch(e){
                title=""
            }
            if(avalon.isFunction(callback)){
                callback.call(this,title)
            }
        })

    }

    window.fb = fb;
    return fb;
})