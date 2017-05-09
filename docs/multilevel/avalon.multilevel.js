/**
 * Created by Administrator on 2016/7/14 0014.
 */
define(["avalon", "text!./avalon.multilevel.html", "../dropdown/avalon.dropdown","css!./avalon.multilevel.css"], function (avalon, template) {

    var widget = avalon.ui.multilevel = function (element, data, vmodels) {
        var options = data.multilevelOptions,
            widgetId = data.multilevelId;
        element.innerHTML = template;

        var vmodel = avalon.define(widgetId, function (vm) {
            avalon.mix(vm, options);

            var widthForEach=function(){
                var num=vm.ids.length,width="";
                if(vm.width.indexOf("%")!==-1){
                    width=vm.width.replace("%","")
                    return Math.round(width/num)-3+"%";
                }else if(vm.width.indexOf("px")!==-1){
                    width=vm.width.replace("px","")
                    return Math.round(width/num)-10+"px"
                }
            }


            vm.$init = function (continueScan) {
                vm.data.push(vm.dataSource.filter(function (data) {
                    return data.parentid == -1
                }))
                vm.ids.forEach(function (value) {
                    if (vm.data.length >= vm.ids.length) return;
                    vm.data.push(vm.dataSource.filter(function (data) {
                        return data.parentid == value
                    }))
                })


                vm.$dropdownOpts = {
                    width:widthForEach(),
                    onChange: function (n, o, vmodel) {

                        var duplexName = (element.msData["ms-duplex"] || "").trim(),
                            duplexModel;

                        if (n !== o) {
                            vm.ids[avalon(this).data("index")] = n;
                            for (var i = avalon(this).data("index"); i < vm.ids.length - 1; i++) {
                                vm.data[i + 1] = vm.dataSource.filter(function (data) {
                                    return data.parentid == vm.ids[i]
                                })
                                vm.ids[i + 1] = vm.data[i + 1][0]&&vm.data[i + 1][0].id;
                            }
                        }
                       element.innerHTML=template;
                        var values=new Array()
                        vm.ids.forEach(function(id){
                            for(var i=0;i<vm.dataSource.length;i++){
                                if(vm.dataSource[i].id==id){
                                    values.push(vm.dataSource[i].value)
                                }
                            }
                        })
                        if (duplexName && (duplexModel = avalon.getModel(duplexName, vmodels))) {
                            duplexModel[1][duplexModel[0]]=values
                        }
                        vm.values=values
                        avalon.scan(element,vm)
                    }
                }



                if (continueScan) {
                    continueScan()
                } else {
                    avalon.log("请尽快升到avalon1.3.7+")
                    if (typeof options.onInit === "function") {
                        options.onInit.call(element, vmodel, options, vmodels)
                    }
                }
            }


        })



        return vmodel;
    }

    widget.defaults = {
        ids: [],
        values:[],
        eachWidth:'200px',
        width:'100%',
        /*fields: ['a', 'b', 'c'],
        ids: [1, 4, 8],
        values:[],
        data: [],
        $dropdownOpts: null,
        dataSource: [{
        "id": 1,
            "parentid": -1,
            "value": "aaa",
            "text": "选项一"
    },
    {
        "id": 2,
        "parentid": -1,
        "value": "2",
        "text": "选项二"
    },
    {
        "id": 3,
        "parentid": -1,
        "value": "3",
        "text": "选项三"
    },
    {
        "id": 4,
        "parentid": 1,
        "value": "4",
        "text": "选项四"
    },
    {
        "id": 5,
        "parentid": 1,
        "value": "5",
        "text": "选项五"
    },
    {
        "id": 6,
        "parentid": 2,
        "value": "6",
        "text": "选项六"
    },
    {
        "id": 7,
        "parentid": 2,
        "value": "7",
        "text": "选项七"
    },
    {
        "id": 8,
        "parentid": 3,
        "value": "8",
        "text": "选项八"
    },
    {
        "id": 9,
        "parentid": 4,
        "value": "9",
        "text": "选项九"
    },
    {
        "id": 10,
        "parentid": 4,
        "value": "10",
        "text": "选项十"
    },
    {
        "id": 11,
        "parentid": 5,
        "value": "11",
        "text": "选项十一"
    }]
*/
    }
})