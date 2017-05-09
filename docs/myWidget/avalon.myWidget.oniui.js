/**
 * Created by CHECK on 2015/10/8.
 */
define(["avalon.fb"], function() {
    //    必须 在avalon.ui上注册一个函数，它有三个参数，分别为容器元素，data， vmodels
    avalon.ui.myWidget = function(dom, data, vmodels) {
        var options = data.buttonOptions;
        var vm = avalon.define({
            $id:data.myWidgetId,
            value:0, // 给input一个个默认的数值
            plus : function(e) { // 只添加了这个plus
                vm.value++;
            },
            $init:function(scan){

                if(scan)scan();
            },
            $remove:function(){

            }
        })

        return vm;
    }
    avalon.ui.myWidget.defaults = {
        aaa: "aaa",
        bbb: "bbb",
        ccc: "ccc"
    }
    return avalon//必须返回avalon
})