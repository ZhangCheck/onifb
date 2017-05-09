//# sourceURL=FB_FE_LIB\oniui\video\avalon.video.js
define([
    "../avalon.fb",
    "./video.dev",
    "css!./video-js.css"
], function(fb) {
    var widget = avalon.ui.video = function(element, data, vmodels) {
        var playerId = $(element).attr('id')
        if(!playerId || playerId==""){
            playerId = "player"+Math.random().toString().substr(2);
            $(element).get(0).setAttribute('id',playerId);
        }
        
        var options = data.videoOptions 
        
        vmodel = avalon.define(data.videoId, function(vm) {
            avalon.mix(vm, options)
            vm.$player = null
            vm.$init = function() {
                vm.$player = videojs(playerId); 
                vm.onReady(vm.$player);
            }
			vm.$remove = function(){
				vjs.players[playerId] = null;
			}
        })
        
        return vmodel
    }
    
    widget.defaults = {
        onReady:avalon.noop
    }
    
    return avalon
})
/**
 * 参考链接
 阿里大数据的UI设计稿
 http://www.cnblogs.com/xuxiace/archive/2012/03/07/2383180.html
 Onion UI 控件集
 http://wiki.corp.qunar.com/pages/viewpage.action?pageId=49957733
 http://wiki.corp.qunar.com/pages/viewpage.action?pageId=49956129
 来往
 http://m.laiwang.com/market/laiwang/event-square.php?spm=0.0.0.0.Hg4P8X

 ExtJS初级教程之ExtJS Grid(二)

 http://blog.csdn.net/letthinking/article/details/6321767

 http://wenku.baidu.com/view/2f30e882e53a580216fcfe34.html

 http://ued.taobao.org/blog/2013/03/modular-scalable-kissy/

 http://gist.corp.qunar.com/jifeng.yao/gist/demos/pager/pager.html
 //http://www.datatables.net/
 各种UI的比例
 http://www.cnblogs.com/xuanye/archive/2009/11/04/1596244.html
 jQueryUI theme体系调研 http://hi.baidu.com/ivugogo/item/605795f7a5c27a1ea62988e4?qq-pf-to=pcqq.discussion
 */

