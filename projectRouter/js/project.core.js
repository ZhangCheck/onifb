/**
 * Created by CHECK on 2015/11/4.
 */
require.config({
    baseUrl:'js',
    paths:{
        avalon:'fb_lib/avalon.shim',
        echarts: 'fb_lib/echarts',
        domReady:'fb_lib/domReady'
    },
    map:{
        '*':{
            'css':'fb_lib/require.css',
            'text':'fb_lib/require.text'
        }
    },
    shim:{
        avalon: { exports: "avalon" },
        echarts:{exports:"echarts"}
    }
});
require(["fb_lib/avalon.fb","text!../interfaceState.html","css!../css/project.core","fb_lib/mmRouter/mmState","fb_lib/loading/avalon.loading","fb_lib/textbox/avalon.textbox",'domReady!'],function(fb,interfaceStateTemplate){
    try{
        //接口服务器配置
        if(fb.state(fb.fbMode,1))
            fb.server = "../"                        //发布环境接口地址
        else if(fb.state(fb.fbMode,2))
            fb.server =  "http://192.168.0.45:8080/com.fable.nt.jmej/" //联调接口地址
        
        //接口配置
        avalon.mix(fb.config.interface, {
			stateTemplate:interfaceStateTemplate
        });        
    }catch (ex){
        fb.log("project.core Error:",ex,ex.stack?ex.stack:"");
    }

    //一个顶层VM
    var vm = avalon.define({
        $id: "mainCtl",
        globalVar:"global",
        propHeight:0,
        titleList:[],
        url:"",
        caculateContentHeight:function(){
            var tempH = document.body.clientHeight-($('.m-top').height())-($('.m-bottom').height())
            vm.propHeight = tempH<0?0:tempH
        }
    })

     vm.titleList=[
         {"prop":"","titleName":"首页"},
         {"prop":"about/0","titleName":"menu0"},
         {"prop":"about/1","titleName":"menu1"},
         {"prop":"about/2","titleName":"menu2"},
         {"prop":"about/3","titleName":"menu3"},
         {"prop":"about/4","titleName":"menu4"},
         {"prop":"about/5","titleName":"menu5"}
     ]

    avalon.state("home",{
        url:"/",
        templateUrl:"home.html"
    })

    avalon.state("about",{
        url:"/about/{title}",
        templateUrl:"about.html"
    })

    avalon.state.config({
        onLoad:function(){
            vm.url=window.location.href
        },
        onUnload:function(){
            avalon.each(avalon.vmodels,function(k,v){
                if(k!="mainCtl"){
                   try {
                        vmodel.$remove()
                        vmodel.widgetElement = null // 放到$remove后边
                    } catch (e) {}
                    delete avalon.vmodels[k];
                }
            })
        },
        onError:function(obj,state){
            fb.log("router error:",this.stateName,obj.name,obj.xhr);
        }
    })

    avalon.history.start({
        basestate: "/mmRouter"
    })
    avalon.scan();

    console.log(vm.propHeight);
    vm.caculateContentHeight();
    window.onresize=vm.caculateContentHeight
})
