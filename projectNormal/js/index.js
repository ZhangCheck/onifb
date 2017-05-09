/**
 * Created by CHECK on 2015/12/10. changed
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

require(["project.core","./fb_lib/button/avalon.button","domReady!"], function () {
    var vm = avalon.define({
        $id: "mainCtl",
        firstWord:"Welcome!",
        prop:"",
        contentHeight:0,
        caculateContentHeight:function(){
            var tempH = $('body').height()-$('.m-photo').height()-$('#fheight').height()-$('#theight').height()
            vm.contentHeight = tempH<0?0:tempH
        },
        onLoad:function(){
            console.log("good")
        },
        onClick:function(){
            alert("clicked");
        }
    });


    avalon.scan();

    //接口请求示例
    fb.requestJson({
        remoteUrl:"model/demo.json",
        localUrl:"model/demo.json",
        success:function(data){
            vm.firstWord = data.firstWord;
        }
    })
    //vm.bodyHeight=document.body.clientHeight;
    //vm.photoHeight=$('.m-photo').height();
    //vm.footerHeight=$('#fheight').height();
    //vm.prop=document.body.clientHeight-vm.theight-$('.m-photo').height()-$('#fheight').height()

    console.log("body:"+document.body.clientHeight+",tou"+vm.theight+"tupian"+$('.m-photo').height()+"jiao"+$('#fheight').height())
    //alert(document.body.clientHeight)
    //avalon.bind(window,'onresize',vm.caculateContentHeight)
    window.onresize = vm.caculateContentHeight
    setTimeout(vm.caculateContentHeight,300);
});