/**
 * Created by Administrator on 2016/2/23 0023.
 */

define(["./avalon.animateImpl"], function() {
    var defaults={
        properties:{

        },
        options:{
            before:avalon.noop,
            step:function(){
                console.log("一帧")
            },
            after:avalon.noop,
            duration:1000,
            model:"none"
        }
    }
    var animate = avalon.bindingHandlers.animate = function(data, vmodels) {
        var args = data.value.match(avalon.rword) || []
        var VMId=args[0]||"$"
        var UID=data.element.UID=String(Math.random() + Math.random()).replace(/\d\.\d{4}/, "animate")
        var ID  = args[1] || UID
        var opts = args[2] ||"animate"
        var model, vmOptions
        if (VMId != "$") {
            model = avalon.vmodels[VMId]//如果指定了此VM的ID
            if (!model) {
                return
            }
        }
        if (!model) {//如果使用$或绑定值为空，那么就默认取最近一个VM，没有拉倒
            model = vmodels.length ? vmodels[0] : null
        }
        var fnObj = model || {}
        if (model && typeof model[opts] === "object") {//如果指定了配置对象，并且有VM
            vmOptions = model[opts]
            if (vmOptions.$model) {
                vmOptions = vmOptions.$model
            }
            fnObj = vmOptions
        }

        var element = data.element
        var $element = avalon(element)
        var widgetData=avalon.getWidgetData(element, opts)
        var widgetOptions={}
        var widgetProperties={}
        for(key in widgetData)
        {
            if(key.indexOf("options")!==-1)
            {
                widgetOptions[key.replace("options","").toLowerCase()]=widgetData[key]
            }
            if(key.indexOf("properties")!==-1)
            {
                widgetProperties[key.replace("properties","").toLowerCase()]=widgetData[key]
            }
        }
        var dataOptions=avalon.mix({},defaults.options,vmOptions?vmOptions.options : {},$element.element["data-options"]||{},widgetOptions)
        var dataProperties=avalon.mix({},defaults.properties,vmOptions?vmOptions.properties:{},$element.element["data-properties"]||{},widgetProperties)
        var options={
            options:dataOptions,
            properties:dataProperties
        }

        element.setAttribute("avalonAnimate",element.getAttribute("ms-animate"));
        element.removeAttribute("ms-animate");
        try{
            model[ID]=new Animate(element,options);
            model.$model[ID]=new Animate(element,options);
            var newmodel=avalon.define(ID,function(vm){
                vm[ID]=new Animate(element,options);
                vm.$skipArray=[ID]
                return vm
            })
        }catch(e)
        {
            var newmodel=avalon.define(ID,function(vm){
                vm[ID]=new Animate(element,options);
                vm.$skipArray=[ID]
                return vm
            })
        }
    }


});