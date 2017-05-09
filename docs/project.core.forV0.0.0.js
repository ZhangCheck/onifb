/**
 * Created by CHECK on 2016/1/8.
 */
//在项目初始时(项目文件project.core.js) 执行以下程序，恢复V0.0.0的接口
fb.interfaceConfigStruct = {
    _alertCount:0,
    postLabel:"requestParam",
    _callback:function(interfaceObj,ms,data){
        this.alert(interfaceObj);//清空错误提示
        try{
            interfaceObj.syncTarget = data.data;
            interfaceObj.success(data.data,interfaceObj,ms);
        }catch(ex){
            this.alert(interfaceObj,ms,null,"回调函数出错:"+ex+"\n"+ex.stack);
        }
    },
    /**
     *
     * @param interfaceObj
     * @param [ms] {avalon.Promise}如果为空，则在视图中清空原错误提示
     * @param message
     * @param [log]
     */
    alert:function(interfaceObj,ms,message,log){
        if(!ms) return;
        fb.log("");
        fb.log(fb.format("---------{0}---------",++this._alertCount))
        fb.log(message);
        fb.log("Url:",interfaceObj.isLocal?interfaceObj.localUrl:interfaceObj.remoteUrl);
        fb.log("Upload:",ms.url)
        if(log!==undefined) fb.log("Log:",log);
        fb.log("Response:",ms.status=="200"?ms.responseText:ms.statusText);
        fb.log("------------------")

        if(interfaceObj.view){
            var state = $(interfaceObj.view).find(".interfaceState");
            if(state.length>0){
                $('<div class="interfaceState">数据加载中...</div>').appendTo(interfaceObj.view);
            }
        }
    },

    /**
     *
     * @param interfaceObj {fb.interfaceStruct}
     * @param data
     * @param ms {avalon.Promise}
     */
    success:function(interfaceObj,ms,data){
        if(data!=null){
            if(data.success==undefined){
                if(interfaceObj.isStandard){
                    this.alert(interfaceObj,ms,null,"接口数据格式错误:"+data.msg);
                    if(!interfaceObj.isLocal){
                        fb.requestJson(interfaceObj);
                    }
                }else{
                    this._callback(interfaceObj,ms,data);
                }
            }else if(data.success){
                if(Array.isArray(data.data) && data.data.length==0){
                    this.alert(interfaceObj,ms,null,"字段'data'为空数组");
                }else if(this.extendDataCheck){
                    if(this.extendDataCheck(interfaceObj,ms,data)){
                        this._callback(interfaceObj,ms,data);
                    }else if(interfaceObj.error){
                        interfaceObj.error();
                    }
                }else{
                    this._callback(interfaceObj,ms,data);
                }
            } else if(data.success==false){
                this.alert(interfaceObj,ms,null,"查询失败 "+data.msg,"字段'success'为:false");
                if(!interfaceObj.isLocal){
                    interfaceObj.isLocal=true;
                    fb.requestJson(interfaceObj);
                }
            }else{
                this.alert(interfaceObj,ms,null,"接口数据格式错误,错误字段:'"+fb.config.interface.stateLabel+"'");
            }
        }else{
            this.alert(interfaceObj,ms,null,"错误字段:'data'");
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
        }else{
            this.alert(interfaceObj,ms,null,"未知错误 状态码:"+ms.status+message);
        }

        if(!fb.isPublished && !interfaceObj.isLocal){
            interfaceObj.isLocal=true;
            fb.requestJson(interfaceObj,true);
        }
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