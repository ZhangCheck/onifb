/**
 * Created by cailingling on 2016/1/26 0026.
 */
define(["../avalon.getModel","text!./avalon.comboBox.html","css!./avalon.comboBox.css"],
    function(avalon,sourceHtml){
        var widget=avalon.ui.comboBox=function(element, data, vmodels){
            var options=data.comboBoxOptions;
            var id=options.id||data.comboBoxId;
            //对textBox button的html进行处理
            var  template=sourceHtml.replace(/###/g,id);
            var $element=avalon(element);
            var styleReg = /^(\d+).*$/;
            var vmodel=avalon.define(data.comboBoxId,function(vm){
                avalon.mix(vm,options);
                vm["selectedValue"]=vm.selectedValue;//input框设置默认值
                vm.dataStatus=false;
                vm.showSelectContent=function(e,$this){//展开选择框内容
                    e.stopPropagation();
                    vm.toggle=!(vm.toggle);
                    if(vm.list.length>0){
                        vm.dataStatus=false;
                        //vm.toggle=!(vm.toggle);
                        var item=element.getElementsByTagName("li");
                        if(vm.list.length>vm.listNumber){//将选择框中设定一个高度，当超过限定的条数时出现滚动条
                            var height=0;
                            var _listNumber=0;
                            if(vm.search){
                                _listNumber=vm.listNumber+1;
                            }else{
                                _listNumber=vm.listNumber;
                            }
                            avalon.each(item,function(i,v){
                                if(i<_listNumber){
                                    height+=avalon(item[i])[0].clientHeight;
                                }else{
                                    return;
                                }

                            });
                        }
                        vm.selHeight=(height==0?"auto":height);//设置选择框的高度

                    }else{
                        vm.dataStatus=true;
                    }


                }

                vm.selectValue=function($this){
                    var selectVal=$this.innerText;
                    vm["selectedValue"]=selectVal;
                    vm["selectedCode"]=$this.getAttribute("code");
                    vm.toggle=false;
                }

                vm.enterSelected=function(e){//回车默认选择第一个类目
                    var theEvent = e || window.event;
                    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                    if(code==13){
                        var item=element.getElementsByTagName("li");
                        for(var i=0;i<item.length;i++){
                            if((item[i].innerText).indexOf(vm.searchValue)>=0){
                                vm["selectedValue"]=item[i].innerText;
                                vm["selectedCode"]=item[i].getAttribute("code");
                                vm.toggle=false;
                                break;
                            }
                        }
                    }
                }

                vm.$init=function(continueScan){
                    require(["./textbox/avalon.textbox","./button/avalon.button"],function(){
                        element.appendChild(avalon.parseHTML(template));
                        avalon.scan(element,vm);
                        var item=element.getElementsByTagName("li");
                        avalon.each(item,function(i){
                            avalon.bind(item[i],"click",function(e){
                                e.stopPropagation();
                                if(avalon(item[i]).hasClass("oni-comboBox-searchWarp")){
                                }else{
                                    vm.toggle=false;
                                }

                            });
                        });

                        avalon.bind(document, "click", function(e){
                            e.stopPropagation();
                            vm.toggle=false;
                        });
                    });

                    if(continueScan){
                        continueScan()
                    }

                }

                //textbox中的值在选择框中高亮
                function importShow(val){
                    vm.iconStatus=!vm.iconStatus;
                    if(val){
                        var value=vm["selectedValue"];
                        var item=element.getElementsByTagName("li");

                        avalon.each(item,function(i,v){
                            if((item[i].innerHTML).trim()==value){
                                avalon(item[i]).addClass("selected");
                            }else{
                                avalon(item[i]).removeClass("selected");
                            }

                        });
                    }
                }

                vm.$watch("comboBoxDefalut"+id,function(val){//textbox中的值在选择框中高亮
                    importShow(val);
                });

                vm.$watch("toggle",function(val){//textbox中的值在选择框中高亮
                    vm.searchValue="";
                    if(val){
                        var item=element.getElementsByTagName("li");
                        avalon.each(item,function(i,v){
                            if(avalon(item[i]).hasClass("oni-comboBox-searchWarp")){
                            }else{
                                avalon(item[i]).removeClass("hide");
                                avalon(item[i]).removeClass("show");
                            }

                        });
                    }
                    importShow(val);
                });

                //显示与搜索内容匹配的值（模糊查询）
                vm.$watch("searchValue",function(val){
                    var item=element.getElementsByTagName("li");
                    avalon.each(item,function(i,v){
                        if(avalon(item[i]).hasClass("oni-comboBox-searchWarp")){
                        }else{
                            if((v.innerText).indexOf(val)>=0||!val){
                                avalon(item[i]).removeClass("hide");
                                avalon(item[i]).addClass("show");
                            }else{
                                avalon(item[i]).removeClass("show");
                                avalon(item[i]).addClass("hide");
                            }
                        }

                    });
                })
            });
            return vmodel;
        }
        widget.defaults={
            listNumber:6,//显示6条数据超过6条出现滚动条
            list:[],//选择框数据
            toggle:false,
            iconStatus:false,
            width:200,
            selectedValue:"",//input的默认值
            selectedCode:"",
            selHeight:"auto",//选择框的默认高度
            selWidth:"100%",//选择框的默认宽度
            nodataText:"空",
            search:true,//是否具有搜索功能
            searchValue:""
        }
    return avalon ;
});