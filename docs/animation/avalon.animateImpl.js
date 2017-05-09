/**
 * Created by Administrator on 2016/2/23 0023.
 */
define(["./avalon.animation"], function() {

    //获取元素中有关animate的参数


    var enter=function(element,parentElement,afterElement,callback){
        var proterties=animate.getProterties(element);
        var effect='show'
        if(proterties&&proterties.effect)
        {
            switch(proterties.effect){
                case "slide" :
                    effect=proterties.effect+'Down'
                    break;
                default :effect=proterties.effect
                    break;
            }
            delete proterties.effect
        }
        if(element.parentNode==parentElement){
            if(element.style.display!=='none')
            {
                if(callback) callback.call()
                return;
            }
        }
        else{
            if(effect==='fade')
            {
                element.style.opacity="0"
            }
            else
            {
                element.style.display='none'
            }
            parentElement.appendChild(element)
        }
        if(proterties) {
            if(effect==='fade')
            {
                proterties.after=function(){
                    if(callback) callback.call()
                }
                avalon(element).animate({opacity:"1"},proterties);
            }
            else
            {
                proterties.after=function(){
                    if(callback) callback.call()
                }
                avalon(element)[effect](proterties)
            }
        }
        else{
            proterties.after=function(){
                if(callback) callback.call()
            }
            avalon(element)[effect]()
        }

    }
    var leave=function(element,callback){
        var proterties=animate.getProterties(element);
        if(!element.getAttribute("olddisplay"))
        {
            if(callback) callback.call()
            return;
        }
        var effect='hide'
        if(proterties&&proterties.effect)
        {
            switch(proterties.effect){
                case "slide" :
                    effect=proterties.effect+'Up'
                    break;
                default :effect=proterties.effect
                    break;
            }
            delete proterties.effect
        }
        if(proterties) {
            if(effect==='fade')
            {
                proterties.after=function(){
                    if(callback) callback.call()
                    element.style.display='none'
                }
                avalon(element).animate({opacity:"0"},proterties);
            }
            else
            {
                proterties.after=function(){
                    if(callback) callback.call()
                }
                avalon(element)[effect](proterties)
            }
        }
        else{
            proterties.after=function(){
                if(callback) callback.call()
            }
            avalon(element)[effect]()
        }
    }

    function dealOptions(options)
    {
        if(options.fps)
        {
            avalon.fn.animate.fps=options.fps
            delete options.fps
        }
        return options
    }
    Animate=function(element,properties){
        var that=this
        //判断animate对象是否存在，若存在则直接使用该对象
        if(element.getAttribute("avalonAnimate")!==null){
            var args=element.getAttribute("avalonAnimate").match(avalon.rword)||[]
            var VMId=args[0]||"$"
            var ID  = args[1] || element.UID
            var model=avalon.vmodels[ID]||avalon.vmodels[VMId]||avalon.vmodels[0]
            if(model&&model[ID])
            {
                that=model[ID]
                that.element=element
                if(properties!==void(0)){
                    that.properties=properties
                }
                return that
            }
        }
        else{
            return null
        }
        that.element=element
        that.properties=properties
        that.clearQueue=false
        that.gotoEnd=true
        that.breakOff=false
        that.queue=[]
        that.elemInit=false
        that.animateInit=false
        if(properties.stopOptions){
             that.clearQueue=properties.stopOptions.clearQueue||false
            that.gotoEnd=properties.stopOptions.gotoEnd||false
        }
        that.excuteAnimate=function()
        {
            var options=dealOptions(that.properties.options)
            var properties={}
            if(that.properties.properties){
                properties=that.properties.properties
            }
            that.breakOff=false
            switch(options.model)
            {
                case "slide":
                    if(that.animateInit)
                    {
                        avalon(that.element).slideToggle(options)
                    }
                    else if(avalon(that.element).css("display")==="none"||that.element.parentNode.className==="avalonHide") {
                        avalon(that.element).slideDown(options)
                    }
                    else{
                        avalon(that.element).slideUp(options)
                    }
                    break;
                case "fade":
                    if(that.animateInit)
                    {
                        avalon(that.element).fadeToggle(options)
                    }
                    else if(avalon(that.element).css("display")==="none"||that.element.parentNode.className==="avalonHide") {
                        avalon(that.element).css("display","")
                        avalon(that.element).fadeIn(options)
                    }
                    else{
                        avalon(that.element).fadeOut(options)
                    }
                    break;
                case "expand":
                    if(that.animateInit)
                    {
                        avalon(that.element).toggle(options)
                    }
                    else if(avalon(that.element).css("display")==="none"||that.element.parentNode.className==="avalonHide") {
                        avalon(that.element).show(options)
                    }
                    else{
                        avalon(that.element).hide(options)
                    }
                    break;
                default :  avalon(that.element).animate(properties,options); break;
            }
            that.animateInit=true
        }
        that.stopAnimate=function()
        {
            avalon(that.element).stop(that.clearQueue,that.gotoEnd)
            that.breakOff=true
        }
        that.setOptions=function(options){
            that.properties.options=options
        }
        that.setProperties=function(properties){
            that.properties.properties=properties
        }
    }
});