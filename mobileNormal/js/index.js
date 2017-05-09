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

require(["project.core","./fb_lib/button/avalon.button","./fb_lib/carousel/avalon.carousel"], function () {
    var vm = avalon.define({
        $id: "mainCtl",
        newShow:"",
        firstWord:"Welcome!",
        onClick:function(){
            alert("clicked");
        },
        $opt1 : {
            pictures: [{
                src: "http://img.bzdao.com/2019/1312743.jpg",
                href: "http://img.bzdao.com/2019/1312743.jpg"
            }, {
                src: "http://img.bzdao.com/2019/1312743.jpg",
                href: "http://img.bzdao.com/2019/1312743.jpg"
            }, {
                src: "http://img.bzdao.com/2019/1312743.jpg",
                href: "http://img.bzdao.com/2019/1312743.jpg"
            }, {
                src: "http://img.bzdao.com/2019/1312743.jpg",
                href: "http://img.bzdao.com/2019/1312743.jpg"
            }, {
                src: "http://img.bzdao.com/2019/1312743.jpg",
                href: "http://img.bzdao.com/2019/1312743.jpg"
            }],
            pictureWidth: "100%",
            pictureHeight: 180
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
});