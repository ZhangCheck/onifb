//test3
require.config({baseUrl:'js',paths:{avalon:'fb_lib/avalon.shim',echarts: 'fb_lib/echarts',domReady:'fb_lib/domReady'},map:{'*':{'css':'fb_lib/require.css','text':'fb_lib/require.text'}},shim:{avalon: { exports: "avalon" },echarts:{exports:"echarts"}}});

require(["fb_lib/avalon.fb","fb_lib/dropdown/avalon.dropdown","fb_lib/simplegrid/avalon.simplegrid","fb_lib/mobile/avalon.mobile","css!../css/pageList","domReady!"],function(){
    var df = avalon.cookie.get("fbMode",48)
    avalon.cookie.set("fbMode",df,{path:"/",httpOnly:false})

    var vm = avalon.define({
        $id: "mainCtl",
        fbMode:df,
        currentPage:0,
        $pages:[
            {name:"首页",url:"index.html",author:"崔若楠",state:"完成"}
        ],
        $pagesOpt: {
            columns: [{text: "名称", field: "name",width:150},{text:"URL",field:"url"}, {text: "责任人", field: "author", width: 100}, {text: "状态",field: "state", width: 100}],
            selectedRow:function(index,rowData){
                window.location.href = rowData.url;
            }
        },
        $projectModuleOpt:{
            columns: [{text:"名称",field:"name",width:150},{text:"功能",field:"fun"},{text:"API",field:"api"},{text:"责任人",field:"author",width:100},{text:"状态",field:"state",width:100}],
            data:[
                {name:"模块名",fun:"模块功能",api:"<a href=''></a>",path:"",author:"作者",state:""}
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
                avalon.cookie.set("fbMode",avalon.vmodels['dataSource'].value,{path:"/",httpOnly:false})
            }
        },
        $others:[
            {name:"css规范与参考",url:"FB_FE_LIB/oniui/index.html#!/doc?doc=CSS%E8%A7%84%E8%8C%83",author:"张传开"},
            {name:"类似Jquery的dom操作方式",url:"FB_FE_LIB/oniui/index.html#!/doc?doc=%E4%BD%BF%E7%94%A8AsJQuery",author:"张传开"},
            {name:"前端库",url:"FB_FE_LIB/oniui/index.html#!/apis",author:"前端战队"},
            {name:"字体图标",url:"fontIconList.html",author:"杨颖"}
        ],
        $projectStructure:[
            {path:"js",fun:"项目模块和页面js"},
            {path:"js/fb_lib",fun:"项目中使用的通用模块"},
            {path:"css",fun:"项目级样式文件"},
            {path:"model",fun:"静态数据"},
            {path:"fonts",fun:"字体图标"},
            {path:"images",fun:"图片资源"}
        ],
        clickMobilePage:function(index){
            vm.currentPage = index
            var url = vm.$pages[index].url
            avalon.vmodels["mobile"].src = url+(url.indexOf("?")>-1?"&":"?")+"fbMode="+vm.fbMode
        },
		clickMobileNav:function(index){
			vm.currentPage = vm.$mobileNavs[index].pageIndex
			vm.currentNav = index
			vm.clickMobilePage(vm.$mobileNavs[index].pageIndex)
		}
    });
    vm.$pagesOpt.data = vm.$pages;
    avalon.scan();
    $('body').show()
    vm.clickMobilePage(0)
    
})