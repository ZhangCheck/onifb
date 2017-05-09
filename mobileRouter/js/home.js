/**
 * Created by CHECK on 2015/12/10. changed
 */
require(['avalon','fb_lib/button/avalon.button','fb_lib/carousel/avalon.carousel'], function () {
    var vm = avalon.define({
        $id: "homeCtl",
        homeWord:"Welcome Home !",
        onClick:function(){
            alert("good");
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
    avalon.scan($("#home").get(0));

    //接口请求示例
    fb.requestJson({
        remoteUrl:"model/demo.json",
        localUrl:"model/demo.json",
        success:function(data){
            vm.homeWord = data.firstWord;
        }
    })

})