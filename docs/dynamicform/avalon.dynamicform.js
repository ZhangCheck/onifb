/**
 * Created by Administrator on 2016/7/8 0008.
 */


define(["avalon",
    "../avalon.fb",
    "text!./avalon.dynamicform.html",
    "css!./avalon.dynamicform.css",
    "../button/avalon.button",
    "../dropdownlist/avalon.dropdownlist",
    "../datepicker/avalon.datepicker",
    "../datepicker/avalon.coupledatepicker",
    "../checkboxlist/avalon.checkboxlist",
    "../tree/avalon.tree",
    "../dialog/avalon.dialog",
    "../dropdowntree/avalon.dropdowntree",
    "../fileuploadinput/avalon.fileuploadinput",
    "../multilevel/avalon.multilevel",
    "../textbox/avalon.textbox",
    "../kindeditor/avalon.kindeditor",
    "../spinner/avalon.spinner",
    "../doublelist/avalon.doublelist",
    "../rating/avalon.rating",
    "css!../formLayout/avalon.formLayout.css"], function(avalon,fb,templete) {

    var widget=avalon.ui.dynamicform=function(element,data,vmodel){
        var options = data.dynamicformOptions;
        var inited=false;
        element.appendChild(avalon.parseHTML(templete));

        //将一维数组根据列数转置成二维数组
        function trans(arr,columnNum){
            var rowlength= 0, rowIndex= 0,rows=new Array();
            rows[0]=new Array()
            arr.forEach(function(value){
                rowlength+=value.place||1;
                if(rowlength>columnNum){
                    rowlength=value.place||1;
                    rowIndex++;
                    rows[rowIndex]=new Array();
                }
                rows[rowIndex].push(value)
            })
            return rows
        }


        var vm=avalon.define(data.dynamicformId,function(vm){
            vm.data=[];
            vm.rows=[];
            vm.options={};
            vm.columnNum=0;
            avalon.mix(vm,options);
            vm.$init=function(){
                if (inited) return
                inited = true
               fb.requestJson({
                   type:"POST",
                   dataType:"JSON",
                   localUrl:options.dataSource,
                   success:function(result){
                       if(result.success){
                           vm.data=result.data;
                           vm.options=result.options;
                           vm.rows=trans(vm.data,vm.columnNum)
                       }else{

                       }
                   }
               })
            };
            vm.submit=function(){
                if(vm.options.submit==="form") return;
                var data={};
                vm.data.forEach(function(obj){
                    switch(obj.type){
                        case 'daterange':if(obj.field){
                            data[obj.field+'-start']=obj.starttime;
                            data[obj.field+'-end']=obj.endtime;
                        };break;
                        case 'fileupload':if(obj.field){
                            var upload=new Array()
                            obj.files.forEach(function(file){
                                upload.push({
                                    "done": file.done,
                                    "fileKey": file.fileKey,
                                    "fileLocalToken": file.fileLocalToken,
                                    "name": file.name
                                })
                            })
                            data[obj.field]=obj.files
                        };break;
                        case 'multilevel':if(obj.fields&&obj.fields.length>0){
                            for(var i=0;i<obj.fields.length;i++){
                                data[obj.fields[i]]=obj.values[i]
                            }
                        };break;
                        default:if(obj.field){
                            data[obj.field]=obj.value
                        };break;
                    }

                })
                fb.requestJson({
                    type:vm.options.method,
                    dataType:'JSON',
                    localUrl:vm.options.action,
                    data:data,
                    success:function(){

                    }
                })
            };
            vm.open=function(index){
                avalon.scan(document.getElementById('popwin_'+index),avalon.vmodels)
                avalon.vmodels['popwin_'+index].toggle=true
            }
            return vm
        })

        vm.$watch("columnNum",function(a){
            vm.rows=trans(vm.data,a)
        })

        avalon.scan(element,vm)

        return vm;
    }

    widget.defaults = {
        columnNum:4,
        dataSource:""
    }
});