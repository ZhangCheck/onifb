/**
 * Created by cailingling on 2016/2/1 0001.
 */

define(["../avalon.getModel"],function(avalon){
    var widget=avalon.ui.formLayout=function(element,data,vmodels){
        var options=data.formLayoutOptions;

        function optsJsonArray(json){//将参数名称以opts结尾的属性，单独放一个数组中
            var optsJsonArr=[];
            var reg= new RegExp(/OPTS$/);
            avalon.each(json,function(i,v){
                if(reg.test(i.toUpperCase())){
                    var optsJson={};
                    optsJson[i]=v;
                    optsJsonArr.push(optsJson);
                }
            });
            return optsJsonArr;
        }

        var vmodel=avalon.define(data.formLayoutId,function(vm){
            avalon.mix(vm,options);
            vm.$init=function(continueScan){
                require(["./textbox/avalon.textbox","./textBoxDialog/avalon.textBoxDialog","./datepicker/avalon.datepicker",
                    "./dropdown/avalon.dropdown","./comboBox/avalon.comboBox"],function(){
                    //判断是否有参数
                    if(options){
                        var column=options.column;//一行显示的列数
                        var $table=document.createElement("table");
                        $table.width="100%";
                        $table.setAttribute("class","formLayout");
                        var $tbody=document.createElement("tbody");

                        var optsJson=optsJsonArray(options);
                        if(optsJson.length>0){
                            var tr="<tr>";
                            avalon.each(optsJson,function(i,opts){
                                avalon.each(opts,function(optsName,optsValue){
                                    var widgetOpts=optsValue.opts||{};
                                    var type=optsValue["type"].toUpperCase();
                                    tr+='<td class="fl-label" ms-css-width="'+options.titleWidth+'">'+optsValue["name"]+':</label></td>';//标题
                                    var vmodelId=optsName.substr(0,(optsName.toUpperCase()).lastIndexOf("OPTS"));
                                    var vIdOpt=","+vmodelId+','+optsName;
                                    var duplex=vmodelId+"_value";
                                    if(type=="TEXTBOX"){
                                        tr+='<td><input ms-widget="textbox'+vIdOpt+'" data-textbox-width="100%" ms-duplex="'+duplex+'"/></td>';
                                        vm[optsName]=avalon.mix({},widgetOpts);
                                    }else if(type=="DATE"){
                                        tr+='<td><input ms-widget="datepicker'+vIdOpt+'" data-datepicker-width="100%"  ms-duplex="'+duplex+'"/></td>';
                                        vm[optsName]=avalon.mix({},widgetOpts);
                                    }else if(type=="DROPDOWN"){
                                        var containerId=widgetOpts.container||"";
                                        tr+='<td><div class="formLayout-dropDownWarp">' +
                                                '<div ms-widget="dropdown'+vIdOpt+'" data-dropdown-width="100%"  ms-duplex="'+duplex+'"></div>' +
                                                '<div id="'+containerId+'" class="formLayout-dropDownWarp-content"></div>' +
                                            '</div></td>';
                                        vm[optsName]=avalon.mix({},widgetOpts);
                                    }else if(type=="TEXTBOXDIALOG"){
                                        tr+='<td><div ms-widget="textBoxDialog'+vIdOpt+'"  ms-duplex="'+duplex+'"></div></td>';
                                        avalon.mix({width:"100%"},widgetOpts);
                                        vm[optsName]=avalon.mix({width:"100%"},widgetOpts);
                                    }else if(type=="COMBOBOX"){
                                        tr+='<td><div ms-widget="comboBox'+vIdOpt+'"  ms-duplex="'+duplex+'"></div></td>';
                                       vm[optsName]=avalon.mix({width:"100%"},widgetOpts);
                                    }

                                    if((i+1)%column==0&&(i+1)!=optsJson.length){
                                        tr+="</tr><tr>"
                                    }
                                    if(((i+1)%column!=0||(i+1)%column==0)&&(i+1)==optsJson.length){
                                        tr+="</tr>";
                                    }
                                });
                            });
                            $tbody.appendChild(avalon.parseHTML(tr));
                            $table.appendChild($tbody);
                            element.appendChild($table);
                            avalon.scan(element,vm);
                        }

                    }
                    if(continueScan){
                        continueScan();
                    }
                });
            }
        });

        return vmodel;
    }

    widget.defaults={
        column:3,//一行显示的列数
        titleWidth:100//标题宽度

    }
    return avalon ;
});