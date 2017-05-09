/**
 * Created by CHECK on 2015/11/10.
 */
define(["avalon.fb","text!../imgCentral/avalon.imgCentral.html","css!/avalon.imgCentral.css"], function(fb, template) {
    /** @class avalon.ui.imgCentralOptionsStruct**/
    avalon.ui.imgCentralOptionsStruct = {
        src:/**@type {String}**/null,
        trim:false,
        width:"100%",
        height:"100%",
        "max-width":"none",
        "max-height":"none",
        display:"block",//"inline"|"block"|"inline-block"
        overflow:"hidden",
        "vertical-align":"middle",
        "text-align":"center",
        useScale:true,
        padding:"5px",
        background:"#fff"
    }

    var widget = avalon.ui.imgCentral = function(/**@type HTMLElement**/dom, data, vmodels) {
        var options = /** @type avalon.ui.imgCentralOptionsStruct**/data.imgCentralOptions,$dom = avalon(dom),inited = false,sample;        if(false) var dom = document.getElementById("");
        /*function getImageSize(url, callback) {
            if(!sample) sample=document.createElement("img")
            sample.setAttribute('src', url);
            sample.onload(function () {
                callback(this.width, this.naturalHeight);
            });
        }*/

        var vm = avalon.define({
            $id:data.imgCentralId,
            src:options.src,
            $imageSize:null,
            $loaded:false,
            $dom:dom,
            resize:function(){
                if(options.display!="inline" && options.useScale) {
                    var img = $(vm.$dom).find(".test");
                    var iw = img.width(), ih = img.height();
                    img.hide();
                    var dw = $(vm.$dom).width(), dh = $(vm.$dom).height();
                    img.show();

                    var p = $(vm.$dom).parent();
                    if(p.css("display")=="table-cell"){
                        $(vm.$dom).hide();

                        if(options.width!="auto"){
                            var wp = fb.math.percentToNumber(options.width);
                            $(vm.$dom).width(p.width()*wp);
                        }
                        if(options.height!="auto"){
                            var hp = fb.math.percentToNumber(options.height);
                            $(vm.$dom).height(p.height()*hp);
                        }
                        $(vm.$dom).show();
                    }

                    $(img).css("margin-top","0");
                    if (iw / ih > dw / dh && iw >= dw) {
                        img.css({width: "100%", height: "auto"});
                        if(options["vertical-align"]=="middle"){
                            ih = img.height();
                            $(img).css("margin-top",(dh-ih)/2+"px");
                        }
                    } else if (iw / ih < dw / dh && ih > dh) {
                        img.css({width: "auto", height: "100%"});
                    }
                }
            },
            onloadImg:function(){
                vm.resize();
            },
            $init:function(continueScan){
                try{
                    if(inited) return;
                    inited = true;

                    if(options.display!="inline"){
                        $(dom).width(options.width).height(options.height).css({"overflow":options.overflow,"text-align":options["text-align"]});
                        dom.innerHTML = fb.format("<img src={0} class='test'/>",options.src);

                        if(options.useScale){
                            var img =  $(dom).find(".test").get(0);
                            img.onload = function() {
                                $loaded = true;
                                vm.resize();
                            }
                        }
                    }
                    $(window).bind("resize",vm.resize);
                    if(continueScan) {
                        continueScan()
                    }
                    avalon.scan(dom);
                }catch (ex){
                    avalon.log(ex);
                }

            }
        })
        return vm;
    }

    /** @class avalon.ui.imgCentralOptionsStruct**/
    widget.defaults = avalon.ui.imgCentralOptionsStruct;
})