/**
 * Created by CHECK on 2015/11/10.
 */
define(["avalon.fb","../browser/avalon.browser", "css!../chameleon/oniui-common.css", "css!/avalon.swipepager.css", "animation/avalon.animation"], function (fb) {
    /** @class avalon.ui.swipepagerOptionsStruct**/
    avalon.ui.swipepagerOptionsStruct = {
        tip: "加载中...",
        enable: true,
        numPerPage: 10,
        interface: null,
        pageField: "page",
        numPerPageField: "rows",
        scrollCon:null,
        tipFixBottom:0
    };

    var widget = avalon.ui.swipepager = function (/**@type HTMLElement**/dom, data, vmodels) {
        var options = data.swipepagerOptions,
            $dom = avalon(dom),
            tip = document.createElement("div"),
            $tip = avalon(tip),
            inited = false;


        var vm = avalon.define({
            $id: data.swipepagerId,
            tip: options.tip,
            overflow: false,
            toEnd: false,
            $isSwiping: false,
            $page: -1,
            $dataAjax: null,
            $isLoading: false,
            $isEnd: false,
            $isFirst: true,
            $domHeight:0,
            $load: function () {
                if(!options.interface || (!options.interface.localUrl&&!options.interface.remoteUrl)){return;}
                if (vm.$isLoading ) {
                    return;
                }
                if (vm.$dataAjax) vm.$dataAjax.abort();

                vm.$page++;
                vm.$isLoading = true;

                var spData = {};
                spData[options.numPerPageField] = options.numPerPage;
                spData[options.pageField] = vm.$page+1;

                //tip.innerText = vm.tip;



                if (vm.$isFirst) {
                    $(tip).hide();
                } else {
                    vm.$showTip();
                }
                // 分页的时候不显示信息加载中....
                vm.$tempAlert=function(){}
                vm.$dataAjax = fb.requestJson(avalon.mix({}, options.interface, {
                    data: avalon.mix(options.interface.data, spData),
                    success: function (data) {
                        if (options.interface.success) options.interface.success(data);
                        vm.$isEnd = data.total <= (vm.$page + 1) * options.numPerPage;

                        if(vm.$isEnd){
                            vm.$showTip("已到最后一页了");
                        }else{
                            $(tip).remove();
                        }

                        vm.$isFirst = false;
                        vm.$isSwiping = false;
                        vm.$isLoading = false;
                    },
                    error: function () {
                        vm.$isFirst = false;
                        vm.$isSwiping = false;
                        vm.$isLoading = false;
                        if (options.interface.error) options.interface.error();
                    },
                    view: "#" + $(dom).generateId().attr("id"),
                    alert: vm.$isFirst?undefined:vm.$tempAlert
                }));

            },
            //$timer: null,
            swipeAndScroll:function(e){
                if(vm.$isLoading) return;
                if(vm.$scrollCustom){
                    vm.$scrollCustom = false;
                    return;
                }
                var viewH = $(options.scrollCon).height();
                var contentH = options.scrollCon.scrollHeight;
                var scrollTop = avalon(options.scrollCon).scrollTop();

                if((contentH <= viewH && vm.$isFirst) || (scrollTop / (contentH - viewH) >= 0.95 && scrollTop - vm.$lastScrollPos>0)){
                    if (!vm.$isEnd) {
                        vm.$load();
                        vm.$isLoading = true;
                    }
                }
                vm.$lastScrollPos = avalon(options.scrollCon).scrollTop();
            },
            $showTip:function(msg){
                var scrollCon = null;
                if (options.scrollCon) {
                    scrollCon = $(options.scrollCon).get(0);
                } else {
                    scrollCon = $(dom).get(0);
                }
                $(scrollCon).append($(tip));
                $(tip).html(msg?msg:options.tip);
                $(tip).show();
                avalon(scrollCon).scrollTop(50000);
            },
            $init: function (continueScan) {
                if (inited) return;inited = true;
                if (!options.scrollCon) {
                    options.scrollCon=dom;
                }

                if ($dom.height() < 30) {
                    avalon.log("需要给swipepage定义高度，以计算滚动");
                }
                //tip.innerHTML = '<div class="s-tip"></div>';
                $(tip).addClass("s-tip");
                $dom.addClass("swipepager");

                if (options.enable) {
                    vm.$domHeight = $(dom).height();
                    if(avalon.platform.android){
                        $(dom).bind("scroll",vm.swipeAndScroll)
                    }else{
                        $(dom).bind("swipeup", vm.swipeAndScroll)
                    }
                } else {
                    $dom.addClass("disabled");
                }

                vm.$load();

                if (continueScan) {
                    continueScan()
                }
            },
            $lastScrollPos:-1,
            $scrollCustom:false,
            $remove:function(){
                clearInterval(vm.$timer);
            }
        })
        return vm;
    }

    /** @class avalon.ui.swipepagerOptionsStruct**/
    widget.defaults = avalon.ui.swipepagerOptionsStruct;
})