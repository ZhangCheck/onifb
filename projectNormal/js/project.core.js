/**
 * Created by CHECK on 2015/11/4.
 */
define(["fb_lib/avalon.fb","text!../interfaceState.html","css!../css/project.core","domReady!"],function(fb,interfaceStateTemplate){
    try{
        //接口服务器配置
        if(fb.state(fb.fbMode,1))
            fb.server = "" //发布环境接口地址
        else if(fb.state(fb.fbMode,2))
            fb.server =  "" //联调接口地址
        
        //接口配置
        avalon.mix(fb.config.interface, {
			stateTemplate:interfaceStateTemplate
        });
        
    }catch (ex){
        fb.log("project.core Error:",ex,ex.stack?ex.stack:"");
    }

    return fb;
})
