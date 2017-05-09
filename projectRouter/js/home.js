/**
 * Created by CHECK on 2015/12/10. changed
 */
require(['avalon','fb_lib/button/avalon.button'], function () {
    var vm = avalon.define({
        $id: "homeCtl",
        homeWord:"Welcome Home !",
        onClick:function(){
            alert("good");
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