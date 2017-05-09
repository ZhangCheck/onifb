/**
 * Created by CHECK on 2015/11/4.
 */
define(["../../../avalon.fb","text!../../../../interfaceState.html","css!../../../../project.core","domReady!"],function(fb,interfaceStateTemplate){
    try{
        //项目配置
        //接口服务器
        fb.server = "";///localhost:\d*/.test(window.location.host)?"http://192.168.3.32:8080/dwjd_hnst/":"http://" + window.location.host + "/dwjd_hnst/";
        fb.showTask = true;
        fb.isPublished = false;
        fb.isDebug = false;

        //接口配置
        avalon.mix(fb.config.interface, {
            success:function(interfaceObj,ms,data){
                if(data!=null){
                    this._callback(interfaceObj,ms,data);

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

                if(!fb.isPublished && !interfaceObj.isLocal){
                    interfaceObj.isLocal=true;
                    fb.requestJson(interfaceObj,true);
                }

                if(interfaceObj.error) interfaceObj.error(ms);
            },
        });
    }catch (ex){
        fb.log("project.core Error:",ex,ex.stack?ex.stack:"");
    }

    return fb;
})
