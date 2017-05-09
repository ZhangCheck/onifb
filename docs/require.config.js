
require.config({
    baseUrl:'../',
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
