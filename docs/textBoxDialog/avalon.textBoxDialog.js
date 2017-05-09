/**
 * Created by cailingling on 2016/1/22 0022.
 */


define(["../avalon.getModel","text!./avalon.textBoxDialog.html","css!./avalon.textBoxDialog.css"],
    function(avalon,sourceHtml){
    var widget=avalon.ui.textBoxDialog=function(element, data, vmodels){
        var options=data.textBoxDialogOptions;
        var id=options.id||data.textBoxDialogId;//由于textBox弹窗一个页面可能出现多个，对textbox,dialog组件vmodel设定一个唯一的值
        //对textBox弹窗html进行处理
        var  template=sourceHtml.replace(/###/g,id);
        template=template.replace(/XXXXXXXXXXXXXXXXXXXX/g,options.fileTemplate);

        var $element=avalon(element);
        var vmodel=avalon.define(data.textBoxDialogId,function(vm){
            avalon.mix(vm,options);
            vm.width=vm.width;

            if(vm.iconPosition=="left"){
                vm.buttonPos="buttonPosLeft";
            }else if(vm.iconPosition=="right"){
                vm.buttonPos="buttonPosRight";
            }else{
                vm.buttonPos="";
            }
            vm.showTextBoxDialog=function(dialogId){
                avalon.vmodels[dialogId].toggle=true;
            };

            vm.fileTemplateFun=function(){
                if(vm.fileTemplateUrl){
                    var file=vm.fileTemplateUrl;
                    var reg= new RegExp(/.html$/);
                    if(reg.test(file)){
                        return file;
                    }
                }else{
                    return "";
                }
            }

            vm["textBoxDialogOpts-"+id]={
                title:vm.title,
                onOpen:function(){
                    vm.onOpen();
                },
                onClose:function(){
                    vm.onClose();
                },
                onCancel:function(){
                    vm.onCancel();
                },
                onConfirm:function(){
                    vm.onConfirm();
                }
            }

            vm.$init=function(continueScan){
               require(["./textbox/avalon.textbox","./button/avalon.button","./dialog/avalon.dialog","./mmRequest/mmRequest"],function(){
                    element.appendChild(avalon.parseHTML(template));

                    avalon.scan(element,vm);

               })
                if(continueScan){
                    continueScan()
                }
            }

        });
        return vmodel;
    }
    widget.defaults={
        iconPosition:"right",
        fileTemplateUrl:"",
        fileTemplate:"",
        selectedValue:"",
        selectedCode:"",
        title:"",//弹窗的标题
        width:200,
        onOpen:function(){
            console.log("open");
        },
        onClose:function(){
            console.log("close");
        },
        onCancel:function(){
            console.log("cancel");
        },
        onConfirm:function(){
            console.log("confirm");
        }
    }

    return avalon ;
});
