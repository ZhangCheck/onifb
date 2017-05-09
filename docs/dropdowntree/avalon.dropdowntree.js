//avalon 1.3.6 2014.11.06
/**
 *
 * @cnName 下拉框
 * @enName dropdown
 * @introduce
 *
 <p>因为原生<code>select</code>实在是难用，avalon的dropdown组件在兼容原生<code>select</code>的基础上，对其进行了增强。</p>
 <ul>
 <li>1，支持在标题和下拉菜单项中使用html结构，可以用来信息的自定义显示</li>
 <li>2，同时支持通过html以及配置项两种方式设置组件</li>
 <li>3，通过配置，可以让下拉框自动识别在屏幕中的位置，来调整向上或者向下显示</li>
 </ul>
 */
define(["avalon",
    "text!./avalon.dropdowntree.html",
    "../avalon.getModel",
    "../scrollbar/avalon.scrollbar",
    "css!../chameleon/oniui-common.css",
    "css!./avalon.dropdowntree.css",
    "../tree/avalon.tree"
], function (avalon, template) {
    var styleReg = /^(\d+).*$/;
    var ie6 = !-[1,] && !window.XMLHttpRequest;
    var widget = avalon.ui.dropdowntree = function (element, data, vmodels) {
        var $element = avalon(element),
            elemParent = element.parentNode,
            options = data.dropdowntreeOptions,
            templates, titleTemplate, treeTemplate,
            blurHandler,
            scrollHandler,
            resizeHandler,
            keepState = false

        //将元素的属性值copy到options中
        "multiple,size".replace(avalon.rword, function (name) {
            if (hasAttribute(element, name)) {
                options[name] = element[name]
            }
        })
        //将元素的属性值copy到options中
        options.enable = !element.disabled

        //读取template
        templates = options.template = options.getTemplate(template, options)
            .replace(/MS_OPTION_ID/g, data.dropdowntreeId).split("MS_OPTION_TEMPLATE")
        titleTemplate = templates[0]
        treeTemplate = templates[1]

        //由于element本身存在ms-if或者内部包含ms-repeat等绑定，在抽取数据之前，先对element进行扫描
        element.removeAttribute("ms-duplex");
        avalon.scan(element, vmodels);

        avalon(element).css('display', 'none');

        //转换option
        _buildOptions(options);

        var titleNode, listNode;
        var vmodel = avalon.define(data.dropdowntreeId, function (vm) {
            avalon.mix(vm, options);
            vm.$skipArray = ["widgetElement", "duplexName", "menuNode", "dropdownNode", "scrollWidget", "rootElement"];
            if (vm.multiple && vm.$hasDuplex && vm.$skipArray.indexOf("value") === -1) {
                vm.$skipArray.push("value")
            }
            vm.widgetElement = element;
            vm.rootElement = {}
            vm.menuWidth = "auto";   //下拉列表框宽度
            vm.menuHeight = vm.height;  //下拉列表框高度
            vm.focusClass = false
            vm.$init = function (continueScan) {
                var title;
                titleNode = avalon.parseHTML(titleTemplate);
                title = titleNode.firstChild;
                elemParent.insertBefore(titleNode, element);
                title.appendChild(element);
                titleNode = title;

                //设置title宽度
                vmodel.titleWidth = computeTitleWidth();
                //设置label值
                setLabelTitle(vmodel.value);

                //注册blur事件
                blurHandler = avalon.bind(document.body, "click", function (e) {
                    //判断是否点击发生在dropdown节点内部
                    //如果不在节点内部即发生了blur事件
                    if (titleNode.contains(e.target)) {
                        vmodel._toggle()
                        return
                    } else if (listNode && listNode.contains(e.target)) {
                        return
                    }
                    if (!vmodel.__cursorInList__  && vmodel.toggle) {
                        vmodel.toggle = false;
                    }
                })

                if (vmodel.position) {
                    //监听window的滚动及resize事件，重新定位下拉框的位置
                    scrollHandler = avalon.bind(window, "scroll", _positionListNode)
                    resizeHandler = avalon.bind(window, "resize", _positionListNode)
                }

                var duplexName = (element.msData["ms-duplex"] || "").trim(),
                    duplexModel;

                if (duplexName && (duplexModel = avalon.getModel(duplexName, vmodels))) {
                    duplexModel[1].$watch(duplexModel[0], function(newValue) {
                        vmodel.value = newValue;
                    })
                }
                vmodel.$watch("value", function (n, o) {
                    avalon.nextTick(function () {
                        var onChange = avalon.type(vmodel.onChange) === "function" && vmodel.onChange || false
                        if (keepState) {
                            keepState = false
                            return
                        }
                        function valueStateKeep(stateKeep) {
                            if (stateKeep) {
                                keepState = true
                                vmodel.value = o
                            } else {
                                if (duplexModel) {
                                    duplexModel[1][duplexModel[0]] = n
                                    element.value = n
                                }
                                vmodel.currentOption = setLabelTitle(n);
                            }
                        }

                        if ((onChange && onChange.call(element, n, o, vmodel, valueStateKeep) !== false) || !onChange) {
                            if (duplexModel) {
                                duplexModel[1][duplexModel[0]] = n
                                element.value = n
                            }
                            vmodel.currentOption = setLabelTitle(n);
                        }
                    })
                });
               /* //同步disabled或者enabled
                var disabledAttr = element.msData["ms-disabled"],
                    disabledModel,
                    enabledAttr = element.msData["ms-enabled"],
                    enabledModel;

                if (disabledAttr && (disabledModel = avalon.getModel(disabledAttr, vmodels))) {
                    disabledModel[1].$watch(disabledModel[0], function (n) {
                        vmodel.enable = !n;
                    });
                    vmodel.enable = !disabledModel[1][disabledModel[0]];
                }

                if (enabledAttr && (enabledModel = avalon.getModel(enabledAttr, vmodels))) {
                    enabledModel[1].$watch(enabledModel[0], function (n) {
                        vmodel.enable = n;
                    })
                    vmodel.enable = enabledModel[1][enabledModel[0]];
                }
                vmodel.enable = !element.disabled;

                //同步readOnly
                var readOnlyAttr = vmodel.readonlyAttr,
                    readOnlyModel;

                if (readOnlyAttr && (readOnlyModel = avalon.getModel(readOnlyAttr, vmodels))) {
                    readOnlyModel[1].$watch(readOnlyModel[0], function (n) {
                        vmodel.readOnly = n;
                    });
                    vmodel.readOnly = readOnlyModel[1][readOnlyModel[0]];
                }*/


                avalon.scan(element.parentNode, [vmodel].concat(vmodels));
                if (continueScan) {
                    continueScan()
                } else {
                    avalon.log("请尽快升到avalon1.3.7+")
                    if (typeof options.onInit === "function") {
                        options.onInit.call(element, vmodel, options, vmodels)
                    }
                }
            }

            /**
             * @interface 当组件移出DOM树时,系统自动调用的销毁函数
             */
            vm.$remove = function () {
                if (blurHandler) {
                    avalon.unbind(window, "click", blurHandler)
                }
                if (scrollHandler) {
                    avalon.unbind(window, "scroll", scrollHandler)
                }
                if (resizeHandler) {
                    avalon.unbind(window, "resize", resizeHandler)
                }
                vmodel.toggle = false;
                listNode && vmodel.container && vmodel.container.contains(listNode) && vmodel.container.removeChild(listNode);
                avalon.log("dropdown $remove")
            }

            //下拉列表的显示依赖toggle值，该函数用来处理下拉列表的初始化，定位
            vm._toggle = function (b) {

                //为了防止显示时调整高度造成的抖动，将节点初始化放在改变toggle值之前
                if (!listNode) {//只有单选下拉框才存在显示隐藏的情况
                    var list;
                    listNode = createListNode();
                    list = listNode.firstChild;
                    vmodel.container.appendChild(listNode)
                    listNode = list
                    vm.rootElement = list
                    avalon.scan(list, [vmodel].concat(vmodels))
                    vmodel.menuNode = document.getElementById("menu-" + vmodel.$id)     //下拉列表框内层容器 （包裹滚动条部分的容器）
                    vmodel.dropdownNode = document.getElementById("list-" + vmodel.$id) //下拉列表框内容（有滚动条的部分）
                }

                //如果参数b不为布尔值，对toggle值进行取反
                if (typeof b !== "boolean") {
                    vmodel.toggle = !vmodel.toggle;
                    return;
                }

                if (!b) {
                    avalon.type(vmodel.onHide) === "function" && vmodel.onHide.call(element, listNode, vmodel);
                } else {
                    var firstItemIndex, selectedItemIndex, value = vmodel.value;
                    if (avalon.type(value) !== "array") {
                        value = [value];
                    }

                    //计算activeIndex的值
                    if (vmodel.activeIndex == null) {
                        avalon.each(vmodel.data, function (i, item) {
                            if (firstItemIndex === void 0 && item.enable) {
                                firstItemIndex = i;
                            }
                            if (item.value === value[0]) {
                                selectedItemIndex = i;
                                return false;
                            }
                            return true;
                        });

                        if (!selectedItemIndex) {
                            selectedItemIndex = firstItemIndex;
                        }
                        vmodel.activeIndex = selectedItemIndex || 0;
                    }
                    vmodel.scrollWidget = avalon.vmodels["scrollbar-" + vmodel.$id];
                    vmodel._styleFix();
                    vmodel._position();
                    if (avalon.type(vmodel.onShow) === "function") {
                        vmodel.onShow.call(element, listNode, vmodel);
                    }
                }
            };

            vm.$watch("toggle", function (b) {
                vmodel.focusClass = b
                vmodel._toggle(b);
            });

            vm.toggle = false;

            vm._position = function () {
                var $titleNode = avalon(titleNode);
                //计算浮层当前位置，对其进行定位，默认定位正下方
                //获取title元素的尺寸及位置
                var offset = $titleNode.offset(),
                    outerHeight = $titleNode.outerHeight(true),
                    $listNode = avalon(listNode),
                    $sourceNode = avalon(titleNode.firstChild),
                    listHeight = $listNode.height(),
                    $window = avalon(window),
                    css = {},
                    offsetParent = listNode.offsetParent,
                    $offsetParent = avalon(offsetParent);

                while ($sourceNode.element && $sourceNode.element.nodeType != 1) {
                    $sourceNode = avalon($sourceNode.element.nextSibling);
                }

                //计算浮层的位置
                if (options.position && offset.top + outerHeight + listHeight > $window.scrollTop() + $window.height() && offset.top - listHeight > $window.scrollTop()) {
                    css.top = offset.top - listHeight;
                    $listNode.addClass("m-up");
                    $sourceNode.addClass("m-up");
                } else {
                    $listNode.removeClass("m-up");
                    $sourceNode.removeClass("m-up");
                    css.top = offset.top + outerHeight - $sourceNode.css("borderBottomWidth").replace(styleReg, "$1");
                }

                if (offsetParent && (offsetParent.tagName !== "BODY" && offsetParent.tagName !== "HTML")) {
                    //修正由于边框带来的重叠样式
                    css.top = css.top - $offsetParent.offset().top + listNode.offsetParent.scrollTop;
                    css.left = offset.left - $offsetParent.offset().left + listNode.offsetParent.scrollLeft;
                } else {
                    //修正由于边框带来的重叠样式
                    css.left = offset.left;
                }

                vm.listWidth=$sourceNode.css("width")+$sourceNode.css("paddingLeft").replace(styleReg, "$1")*1+$sourceNode.css("paddingRight").replace(styleReg, "$1")*1+2
                vm.menuWidth= vm.listWidth-2

                //显示浮层
                $listNode.css(css);
            }
            //是否当前鼠标在list区域
            vm.__cursorInList__ = false

            vm._listenter = function () {
                vmodel.__cursorInList__ = true
            }

            vm._listleave = function () {
                vmodel.__cursorInList__ = false
            };

            //当下拉列表中的项目发生改变时，调用该函数修正显示，顺序是修正下拉框高宽 --> 滚动条更新显示 --> 定位下拉框
            vm._styleFix = function (resetHeight) {
                var MAX_HEIGHT = options.height || 200,
                    $menu = avalon(vmodel.menuNode),
                    height = ''

                if (resetHeight) {
                    vmodel.menuHeight = ''
                    avalon(vmodel.dropdownNode).css({'height': ''});
                }

                height = vmodel.dropdownNode.scrollHeight
                vmodel.menuWidth = !ie6 ? vmodel.listWidth - $menu.css("borderLeftWidth").replace(styleReg, "$1") - $menu.css("borderRightWidth").replace(styleReg, "$1") : vmodel.listWidth;
                if (height > MAX_HEIGHT) {
                    vmodel._disabledScrollbar(false);
                    height = MAX_HEIGHT;
                    avalon(vmodel.dropdownNode).css({
                        "width": vmodel.menuWidth - vmodel.scrollWidget.getBars()[0].width()
                    });
                } else {
                    vmodel._disabledScrollbar(true);
                    avalon(vmodel.dropdownNode).css({
                        "width": vmodel.menuWidth
                    })
                }
                vmodel.menuHeight = height;
                vmodel.updateScrollbar();
                vmodel.scrollTo(vmodel.activeIndex);
            };

            //利用scrollbar的样式改变修正父节点的样式
            vm.updateScrollbar = function () {
                vmodel.scrollWidget.update();
            }

            //通过当前的activeIndex，更新scrollbar的滚动位置
            vm.scrollTo = function (activeIndex) {

                if (!vmodel.dropdownNode) return;
                //计算是否需要滚动
                var nodes = siblings(vmodel.dropdownNode.firstChild),
                    $activeNode = avalon(nodes[activeIndex]),
                    menuHeight = vmodel.menuHeight,
                    nodeTop = nodes.length ? $activeNode.position().top - avalon(nodes[0]).position().top : 0,
                    nodeHeight = nodes.length ? $activeNode.height() : 0,
                    scrollTop = vmodel.dropdownNode.scrollTop

                if (nodeTop > scrollTop + menuHeight - nodeHeight || nodeTop + nodeHeight < scrollTop) {
                    vmodel.scrollWidget.scrollTo(0, nodeTop + nodeHeight - menuHeight)
                }
            }

            //禁用滚动条，当下拉列表的高度小于最大高度时，只显示当前高度，需要对滚动条做禁用
            vm._disabledScrollbar = function (b) {
                vmodel.scrollWidget && (vmodel.scrollWidget.disabled = !!b)
            }

        });

        vmodel.$watch("enable", function (n) {
            if (!n) {
                vmodel.toggle = false;
            }
        });

        vmodel.$watch("readOnly", function (n) {
            if (!!n) {
                vmodel.toggle = false;
            }
        });

        function _buildOptions(opt) {
            //为options添加value与duplexName
            //如果原来的select元素绑定了ms-duplex，那么取得其值作value
            //如果没有，则先从上层VM的配置对象中取，再没有则从内置模板里抽取
            var duplexName = (element.msData["ms-duplex"] || "").trim()
            var duplexModel
            if (duplexName && (duplexModel = avalon.getModel(duplexName, vmodels))) {
                opt.value = duplexModel[1][duplexModel[0]]
                opt.$hasDuplex = true
            } else {
                /*var values = []
                Array.prototype.forEach.call(element.options, function (option) {
                    if (option.selected) {
                        values.push(parseData(option.value))
                    }
                })*/
                //opt.value = values
            }
            if (!opt.multiple) {
                if (Array.isArray(opt.value)) {
                    opt.value = opt.value[0] !== void 0 ? opt.value[0] : ""
                }
                //尝试在当前的data中查找value对应的选项，如果没有，将value设置为data中的option第一项的value
                var option = opt.data.filter(function (item) {
                        return item.value === opt.value && !item.group
                    }),
                    options = opt.data.filter(function (item) {
                        return !item.group
                    })

                if (option.length === 0 && options.length > 0) {
                    opt.value = options[0].value

                    //如果存在duplex，同步该值
                    if (duplexModel) {
                        duplexModel[1][duplexModel[0]] = opt.value
                    }
                }
            }

            //处理data-duplex-changed参数
            var changedCallbackName = $element.attr("data-duplex-changed"),
                changedCallbackModel;    //回调函数
            if (changedCallbackName && (changedCallbackModel = avalon.getModel(changedCallbackName, vmodels))) {
                opt.changedCallback = changedCallbackModel[1][changedCallbackModel[0]]
            }
            opt.duplexName = duplexName

            //处理container
            var docBody = document.body, container = opt.container;

            // container必须是dom tree中某个元素节点对象或者元素的id，默认将dialog添加到body元素
            opt.container = (avalon.type(container) === "object" && container.nodeType === 1 && docBody.contains(container) ? container : document.getElementById(container)) || docBody;

            //处理树的配置项
            opt.treeOptions={
                children:opt.treeData,
                data: {
                    simpleData: {
                        enable: true,
                        pIdKey: "pid"
                    },
                    key:{
                        name:'label',
                        title:'title'
                    }
                },
                callback:{
                    onExpand:function(leaf){
                        vmodel._styleFix(true)
                    },
                    onCollapse:function(leaf){
                        vmodel._styleFix(true)
                    },
                    onClick:function(leaf){
                        vmodel.value=leaf.leaf.value;
                        vmodel._toggle()
                    }
                }
            };
            delete opt.treeData;
        }

        function createListNode() {
            return avalon.parseHTML(treeTemplate);
        }

        //设置label以及title
        function setLabelTitle(value) {
            /*if (!vmodel.multiple && avalon.type(value) === "array") {
                value = value[0];
            }*/

            var option = vmodel.treeOptions.children.$model.filter(function (item) {
                return item.value === value;
            });

            option = option.length > 0 ? option[0] : null

            if (!option && vmodel.treeOptions.children.length) {
                avalon.log("[log] avalon.dropdown 设置label出错");
            } else if (option) {
                vmodel.label = option.label;
                vmodel.title = option.title || option.label || "";
            }
            return option;
        }

        //计算title的宽度
        function computeTitleWidth() {
            var title = document.getElementById("title-" + vmodel.$id),
                $title = avalon(title);
            if (!title) return "auto";
            return vmodel.width - $title.css("paddingLeft").replace(styleReg, "$1") - $title.css("paddingRight").replace(styleReg, "$1");
        }

        //定位listNode
        function _positionListNode() {
            if ( listNode) {
                vmodel._position();
            }
        }

        return vmodel;
    };

    widget.version = "1.0";

    widget.defaults = {
        container: null, //@config 放置列表的容器
        width: 200, //@config 自定义宽度
        listWidth: 200, //@config 自定义下拉列表的宽度
        titleWidth: 0,  //@config title部分宽度
        height: 200, //@config 下拉列表的高度
        enable: true, //@config 组件是否可用
        readOnly: false, //@config 组件是否只读
        readonlyAttr: null, //@config readonly依赖的属性
        currentOption: null,  //@config 组件当前的选项
        data: [], //@config 下拉树数据模型
        value: [], //@config 设置组件的初始值
        label: "", //@config 设置组件的提示文案，可以是一个字符串，也可以是一个对象
        multiple: false, //@config 是否为多选模式
        listClass: "",   //@config 列表添加自定义className来控制样式
        title: "",
        titleClass: "",   //@config title添加自定义className来控制样式
        activeIndex: null,
        size: 1,
        menuNode: null,
        dropdownNode: null,
        scrollWidget: null,
        position: true, //@config 是否自动定位下拉列表
        onSelect: null,  //@config 点击选项时的回调
        onShow: null,    //@config 下拉框展示的回调函数
        onHide: null,    //@config 下拉框隐藏的回调函数
        onChange: null,  //@config value改变时的回调函数
        $hasDuplex: false,
        multipleChange: false,
        keyboardEvent: true,  //@config 是否支持键盘事件
        getTemplate: function (str, options) {
            return str
        },
        treeData:{children:[{name:'无数据'}]},
        onInit: avalon.noop     //@config 初始化时执行方法
    };

    //用于将字符串中的值转换成具体值
    function parseData(data) {
        try {
            data = data === "true" ? true :
                data === "false" ? false :
                    data === "null" ? null :
                        +data + "" === data ? +data : data;
        } catch (e) {
        }
        return data
    }


    var hasAttribute = document.documentElement.hasAttribute ? function (el, attr) {
        return el.hasAttribute(attr)
    } : function (el, attr) {//IE67
        var outer = el.outerHTML, part = outer.slice(0, outer.search(/\/?['"]?>(?![^<]*<['"])/));
        return new RegExp("\\s" + attr + "\\b", "i").test(part);
    }
    return avalon;

    function siblings(n) {
        var r = [];

        for (; n; n = n.nextSibling) {
            if (n.nodeType === 1) {
                r.push(n);
            }
        }

        return r;
    }

});

