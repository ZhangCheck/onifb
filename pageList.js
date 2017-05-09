require.config({
    baseUrl:'oniui',
    paths:{
        avalon:'avalon.shim',
        echarts: 'echarts',
        domReady:'domReady'
    },
    map:{
        '*':{
            'css':'require.css',
            'text':'require.text'
        }
    },
    shim:{
        avalon: { exports: "avalon" },
        echarts:{exports:"echarts"}
    }
});

require(["avalon.fb","dropdown/avalon.dropdown","simplegrid/avalon.simplegrid","css!../projectCommon/pageList","domReady!"],function(){
    var vm = avalon.define({
        $id: "mainCtl",
        fbMode:avalon.cookie.get("fbMode",16),
        $pages:[
            {name:"前端库API",url:"oniui/index.html#!/apis?fbMode=16",author:"前端战队"},
            {name:"css规范与参考",url:"oniui/index.html#!/doc?doc=CSS%E8%A7%84%E8%8C%83",author:"张传开"},
            {name:"类似Jquery的dom操作方式",url:"oniui/index.html#!/doc?doc=%E4%BD%BF%E7%94%A8AsJQuery",author:"张传开"},
            {name:"字体图标",url:"iconfontslist.html",author:"杨颖"}
        ],
        $projectModuleOpt:{
            columns: [{text:"名称",field:"name",width:150},{text:"功能",field:"fun"},{text:"API",field:"api"},{text:"责任人",field:"author",width:100},{text:"状态",field:"state",width:100}],
            data:[
                    {name:"swipepager",fun:"移动端滑动分页",api:"oniui/index.html#!/widgets?widgetId=swipepager",path:"oniui/swipepager/",author:"张传开",state:"完成"},
                    {name:"imgCentral",fun:"图片居中布局",api:"oniui/index.html#!/widgets?widgetId=imgCentral",path:"oniui/imgCentral/",author:"张传开",state:"完成"},
                    {name:"formLayout表单自适应布局",fun:"表单自适应布局",api:"oniui/index.html#!/widgets?widgetId=formLayout",path:"oniui/formLayout/",author:"蔡玲玲",state:"完成"},
                    {name:"textBoxDialog-textbox弹窗",fun:"带对话框的text-box",api:"oniui/index.html#!/widgets?widgetId=textBoxDialog",path:"oniui/textBoxDialog",author:"蔡玲玲",state:"完成"},
                    {name:"comboBox-可输入可选择选择组件",fun:"带选择的text-box",api:"oniui/index.html#!/widgets?widgetId=comboBox",path:"oniui/comboBox/",author:"蔡玲玲",state:"完成"},
                    {name:"simplegrid维护",fun:"simplegrid编辑功能",api:"oniui/index.html#!/widgets?widgetId=simplegrid",path:"oniui/simplegrid",author:"李永"},
                    {name:"tree维护",fun:"tree编辑功能",api:"oniui/index.html#!/widgets?widgetId=tree",path:"oniui/tree",author:"李永",state:"完成"},
                    {name:"mobile",fun:"用于在网页中展示移动端项目",api:"oniui/index.html#!/widgets?widgetId=tree",path:"oniui/tree",author:"张传开",state:"完成"},
                    {name:"treeGrid",fun:"分层级可收缩的表格",api:"oniui/index.html#!/widgets?widgetId=treeGrid",path:"oniui/treeGrid",author:"张顺顺",state:"进行中"},
                    {name:"charts",fun:"报表维护，加入地图（以江苏省为例）和更多报表（用iframe内嵌http://echarts.baidu.com/examples.html)",api:"oniui/index.html#!/widgets?widgetId=treeGrid",path:"oniui/treeGrid",author:"蔡玲玲",state:"进行中"}
            ]
        },

        $dataSourceOpt:{
            data:[
                {value:'16',label:'本地环境'},
                {value:'10',label:'联调环境（先远程联调机，失败后请求本地数据）'},
                {value:'6',label:'联调环境（只远程联调机）'},
                {value:'9',label:'发布环境（先远程发布机，失败后请求本地数据）'},
                {value:'5',label:'发布环境（只远程发布机）'}
            ],
            width:500,
            listWidth:500,
            onChange: function() {
                avalon.cookie.set("fbMode",avalon.vmodels['dataSource'].value)
            }
        },

        $issueOpt:{
            columns: [{text:"组件",field:"name",width:150},{text:"问题",field:"issue"},{text:"责任人",field:"author",width:100},{text:"状态",field:"state",width:100}],
            data:[
                {name:"accordion",issue:"默认样式修改（高度改成和textbox高度相同、去掉背景灰色）",author:"杨颖",state:"已解决"},
                {name:"accordion",issue:"增加merge属性，默认值为true,如果为true时，只有第一个上部和最后一个下部带圆角边，且各琴键共享一条边",author:"蔡玲玲",state:"已解决"},
                {name:"simplegrid",issue:"simplegrid ex11 ex6 ex7 ex8 ex9 ex10 ex13 ex14 ex15 ex16无法显示表",author:"李永",state:"已解决"},
                {name:"simplegrid",issue:"simplegrid ex3  显露源码",author:"李永",state:"已解决"},
                {name:"simplegrid",issue:"ex12 不正常",author:"李永",state:"已解决"},
                {name:"simplegrid",issue:"FB_FE_LIB/pageList.html中“短期维护内容”表中多出'0'行,把表格19个样例都检查一遍",author:"李永，顺顺",state:""},
                {name:"simplegrid",issue:"以pageList.html为例，页面缩放后，表中部分列超出不显示了",author:"李永，顺顺",state:""},
                {name:"simplegrid",issue:"ex11,拖动滚动条时，画面会重新定位，关闭这个功能",author:"李永，顺顺",state:""},
                {name:"simplegrid",issue:"ex1,同一页面有两张表时，第一张表滚动条不正常(估计是计算表A的滚动高度时错用了第二张表的vm）",author:"李永，顺顺",state:"已解决"},
                {name:"simplegrid",issue:"ex15没有源码展示",author:"李永",state:""},
                {name:"carousel",issue:"无法正常显示",author:"张传开",state:"已解决"},
                {name:"checkboxlist",issue:"exX 代码移到下面",author:"蔡玲玲",state:"已解决"},
                {name:"coupledatepicker",issue:"ex1 图标未对齐，文字“今天”离图标应留有间距，两个日期框中间的“-”没有居中对齐",author:"杨颖",state:"已解决"},
                {name:"fileuploader,live,preview",issue:"缺少源代码显示",author:"蔡玲玲",state:"已解决"},
                {name:"mask,menu,spinner",issue:"默认皮肤不对",author:"杨颖",state:"已解决"},
                {name:"notice",issue:"ex1 功能不对",author:"薛晓峰",state:"已关闭"},
                {name:"pager",issue:"exX 无法显示",author:"蔡玲玲",state:"已解决"},
                {name:"spinner,textbox",issue:"exX代码移到下面",author:"蔡玲玲",state:"已解决"},
                {name:"swipepager",issue:"ex1 页面美化 + 源码展示",author:"张传开",state:"已解决"},
                {name:"imgCentral",issue:"源码展示,ie8下图片不展示",author:"张传开",state:"已解决"},
                {name:"textbox",issue:"ex4 列表条目高度加大、列表底色应不透明",author:"杨颖",state:"已解决"},
                {name:"miniswitch",issue:"出现不明源码",author:"薛晓峰",state:"已解决"},
                {name:"rating",issue:"鼠标移上去颜色未变",author:"薛晓峰",state:"已解决"},
                {name:"timer",issue:"鼠标无法拖动选择",author:"薛晓峰",state:"已解决"},
                {name:"button",issue:"ie8下button组件api无法打开（可能原因：button的配置项json格式问题）",author:"薛晓峰",state:"已解决"},
                {name:"textboxdialog",issue:"ie8图标展示有问题，弹窗tree不显示",author:"蔡玲玲",state:"已解决"},
                {name:"mask",issue:"在ie8下输入有问题",author:"崔若楠",state:"进行中"},
                {name:"fileuploader",issue:"在ie8下上传按钮无法正常显示，点button无法打开选择框",author:"崔若楠",state:"已解决"},
                {name:"at",issue:"在ie8下组件不弹提示框并不显示默认值",author:"崔若楠",state:"已解决"}
            ]
        },
        
        $projectStructure:[
            {path:"definitions",fun:"库级定义"},
            {path:"fonts",fun:"库级字体图标"},
            {path:"icons",fun:"库级图片图标"},
            {path:"images",fun:"库级图片资源"},
            {path:"jess",fun:"库可视化工具"},
            {path:"model",fun:"库级静态接口数据"},
            {path:"oniui",fun:"对oniui库的扩展库"},
            {path:"projectCommon：项目模板",fun:" 通用部分"},
            {path:"projectNormal: 项目模板",fun:"常规项目"},
            {path:"projectRouter: 项目模板",fun:"单页面项目"},
            {path:"iconfontslist.html",fun:" 库图标清单"},
            {path:"pageList.html",fun:" 库页面清单"},
            {path:"grunt_index.bat",fun:" 从本地启动库首页"},
            {path:"grunt_index_server.bat",fun:" 启动web服务并访问库首页"},
            {path:"interfaceState.html",fun:"接口状态"},
            {path:"server.js",fun:" 本地服务"}
        ]
    });
    $('#mainCtl').show();
    avalon.scan();
})