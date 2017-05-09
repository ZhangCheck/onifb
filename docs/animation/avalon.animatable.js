/**
 * Created by Administrator on 2016/2/23 0023.
 */

define(["./avalon.animate"], function() {
    var defaults={
         before:avalon.noop,
         step:avalon.noop,
         after:avalon.noop
    }
    var animatable = avalon.bindingHandlers.animatable = function(data, vmodels) {
        var args = data.value.match(avalon.rword) || []
        var VMId=args[0]||"$"
        var ID  = args[1] || "AnimateId"
        var opts = args[2] ||"animatable"
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
        var options=avalon.mix({}, defaults, vmOptions || {}, data[opts] || {}, avalon.getWidgetData(element, opts))
        model["animate_"+VMId+"_"+ID]=new Animate(element,options);
        model.$model["animate_"+VMId+"_"+ID]=new Animate(element,options);
    }


});