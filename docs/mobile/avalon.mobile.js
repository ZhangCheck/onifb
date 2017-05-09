define(["text!./avalon.mobile.html", "../avalon.fb","css!../chameleon/oniui-common.css", "css!./avalon.mobile.css"], function(template) {
   var widget = avalon.ui.mobile = function(element, data, vmodels) {
       var options = data.mobileOptions,$dom = $(element)
       var test = avalon.mix({
           $id:data.mobileId,
           $init:function(continueScan){
               $dom.html(options.$template?options.$template:template);
               continueScan();
           },
           fresh:function(){
               $dom.find('iframe').get(0).contentWindow.location.reload(true)
           }
       },options)
       var vm = avalon.define(test)
       return vm;
    }
    widget.version = 1.0
    widget.defaults = {
        src:"",
        $template:null
    }
    return avalon
})