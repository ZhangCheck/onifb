/**
 * 路由控制以及页面准备
 */

/* require.config({
    baseUrl:'',
    paths:{
        fb:'avalon.fb',
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
 */
 
require(["avalon.fb","pages/index/scripts/models", "pages/index/scripts/utils", "pages/index/scripts/vmodels", "mmRouter/mmState" ,"domReady!"], function (fb,models, utils, vms) {
    avalon.config({
        debug: false
    })
    avalon.state("index", {
        url: "/",
        views: {
            "": {
                templateUrl: "pages/index/views/widgets/index.html"
            }
        },
        onEnter: function () {
            location.href = "#!/widgets"
        }
    })

    avalon.state("widgets", {
        url: "/widgets",
        views: {
            "": {
                templateUrl: "pages/index/views/widgets/index.html"
            }
        },
        onBeforeEnter: function () {
            vms.pages.activeNav = "组件库"

            var widgetId = utils.getHashValue("widgetId"),
                ex = utils.getHashValue("ex")

            utils.prepareWidget(widgetId, ex, vms.pages, vms.widgets, models)
        }
    })

    avalon.state("apis", {
        url: "/apis",
        views: {
            "": {
                templateUrl: "pages/index/views/apis/index.html"
            }
        },
        onBeforeEnter: function () {

            var currentApi = utils.getHashValue("api")
            utils.prepareApi(currentApi, vms.pages, vms.apis, models.apis)

        }
    })

    avalon.state("doc",{
        url: "/doc",
        views: {
            "": {
                templateUrl: "pages/index/views/doc/index.html"
            }
        },
        onBeforeEnter: function () {
            var curDoc = utils.getHashValue("doc")
            utils.prepareDoc(curDoc, vms.pages, vms.doc, models.docs)
        }
    })

    avalon.state("tools",{
        url:"/tools",
        views:{
            "":{
                templateUrl:"pages/index/views/tools/index.html"
            }
        },
        onBeforeEnter: function () {
            var curDoc = utils.getHashValue("tools")
            utils.prepareTools(curDoc, vms.pages, vms.tools, models.tools)
        }
    })

    avalon.state("download", {
        url: "/download",
        views: {
            "": {
                templateUrl: "pages/index/views/download/index.html"
            }
        },
        onBeforeEnter: function () {
            vms.pages.activeNav = "下载"
        }
    })

    avalon.history.start({
        basepath: "/mmRouter"
    })

    avalon.scan();
})