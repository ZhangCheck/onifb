/**
 *  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *  项目配置
 *  【警告】：grunt运行情况下，需要确保配置书写正确后再保存文件(在webstorm中失去焦点自动保存文件），因为保存文件时会引起项目更新；【警告】
 *  【建议】：关闭grunt后再配置，配置完成后重新启动grunt 【建议】
 *  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
var libConfig = {
    addSourceUrl:false,

    //---------- svn 配置 (可选)------------------//
    libUserName: "",//配置svn 账号
    libPassword: "",//配置svn 密码
    libSvn: "",//配置 svn 地址
    updateAtStart: false,
    //---------- svn 配置 结束 -------------//
	
	libCommonVersion:"", //这是项目测试时的基线版本，单个组件高于这个版本的，需要维护组件配置的version标识
	libCommonDate:"",//这是确定基线版本的时间点，格式：2016-03-14 10:00
	
    //----------- 项目类型配置 和 组件引入配置 ------------//
    libImports: [
        //----------- 项目选型（多选一）---------//
        //PC-常规项目
        {src: "FB_FE_LIB/projectNormal/", dst: "", version:"", watch: false},
        {src: "FB_FE_LIB/oniui/avalon.shim.js", dst: "js/fb_lib/avalon.shim.js", version:"", watch: true},
        {src: "FB_FE_LIB/projectCommon/pageList.html", dst: "pageList.html", version:"", watch: false},
        {src: "FB_FE_LIB/projectCommon/pageList.js", dst: "js/pageList.js", version:"", watch: false},

        //移动-常规项目
        //{src: "FB_FE_LIB/mobileNormal/", dst: "", version:"", watch: false},
        //{src: "FB_FE_LIB/oniui/avalon.mobile.shim.js", dst: "js/fb_lib/avalon.shim.js", version:"", watch: true},
        //{src: "FB_FE_LIB/projectCommon/pageListMobile.html", dst: "pageList.html", version:"", watch: false},
        //{src: "FB_FE_LIB/projectCommon/pageListMobile.js", dst: "js/pageList.js", version:"", watch: false},
        //{src: "FB_FE_LIB/oniui/mobile/", dst: "js/fb_lib/mobile/", version:"", watch: true},

        //PC-单页面项目
        //{src: "FB_FE_LIB/projectRouter/", dst: "", version:"", watch: false},
        //{src: "FB_FE_LIB/oniui/avalon.shim.js", dst: "js/fb_lib/avalon.shim.js", version:"", watch: true},
        //{src: "FB_FE_LIB/oniui/mmRouter", dst: "js/fb_lib/mmRouter", version:"", watch: true},
        //{src: "FB_FE_LIB/oniui/loading", dst: "js/fb_lib/loading/", version:"", watch: true},
        //{src: "FB_FE_LIB/projectCommon/pageList.html", dst: "pageList.html", version:"", watch: false},
        //{src: "FB_FE_LIB/projectCommon/pageList.js", dst: "js/pageList.js", version:"", watch: false},

        //移动端-单页面项目
        //{src: "FB_FE_LIB/mobileRouter/", dst: "", version:"", watch: false},
        //{src: "FB_FE_LIB/oniui/mmRouter", dst: "js/fb_lib/mmRouter", version:"", watch: true},
        //{src: "FB_FE_LIB/oniui/loading", dst: "js/fb_lib/loading/", version:"", watch: true},
        //{src: "FB_FE_LIB/projectCommon/pageList.html", dst: "pageList.html", version:"", watch: false},
        //{src: "FB_FE_LIB/projectCommon/pageList.js", dst: "js/pageList.js", version:"", watch: false},
        //{src: "FB_FE_LIB/oniui/avalon.mobile.shim.js", dst: "js/fb_lib/avalon.shim.js", version:"", watch: true},
        //{src: "FB_FE_LIB/projectCommon/pageListMobile.html", dst: "pageList.html", version:"", watch: false},
        //{src: "FB_FE_LIB/projectCommon/pageListMobile.js", dst: "js/pageList.js", version:"", watch: false},
        //{src: "FB_FE_LIB/oniui/mobile/", dst: "js/fb_lib/mobile/", version:"", watch: true},
		
        //----------- 项目选型结束 ---------//
		
		//----------- 是否是平台2.0的项目（打开即是，注释即不是）-------- //
		{src: "FB_FE_LIB/projectPlatformV2/", dst: "", version:"", watch: false},
		//----------- 是否是平台2.0的项目结束 -------- //

        //必选控件
        {src: "FB_FE_LIB/oniui/json2.js", dst: "js/fb_lib/json2.js", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/avalon.getModel.js", dst: "js/fb_lib/avalon.getModel.js", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/chameleon/", dst: "js/fb_lib/chameleon/", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/avalon.fb.js", dst: "js/fb_lib/avalon.fb.js", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/require.js", dst: "js/fb_lib/require.js", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/require.css.js", dst: "js/fb_lib/require.css.js", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/require.text.js", dst: "js/fb_lib/require.text.js", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/combo/r.js", dst: "r.js", version:"", watch: false},
        {src: "FB_FE_LIB/oniui/mmPromise/", dst: "js/fb_lib/mmPromise/", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/mmRequest/", dst: "js/fb_lib/mmRequest/", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/domReady.js", dst: "js/fb_lib/domReady.js", version:"", watch: true},
        {src: "FB_FE_LIB/iconfontslist.html", dst: "iconfontslist.html", version:"", watch: false},
        {src: "FB_FE_LIB/fonts/", dst: "fonts/", version:"", watch: false, version:"", watch: true},
        {src: "FB_FE_LIB/model/", dst: "model/", version:"", watch: false, version:"", watch: true},
        {src: "FB_FE_LIB/projectCommon/project.core.css", dst: "css/project.core.css", version:"", watch: false},
        {src: "FB_FE_LIB/interfaceState.html", dst: "interfaceState.html", version:"", watch: false},
        {src: "FB_FE_LIB/oniui/combo/css-builder.js", dst: "js/fb_lib/css-builder.js", version:"", watch: false},
        {src: "FB_FE_LIB/oniui/combo/normalize.js", dst: "js/fb_lib/normalize.js", version:"", watch: false},
        {src: "FB_FE_LIB/oniui/cookie/", dst: "js/fb_lib/cookie/", version:"", watch: true},
        {src: "FB_FE_LIB/projectCommon/server.js", dst: "server.js", version:"", watch: false},
		{src: "FB_FE_LIB/projectCommon/grunt_cmd.bat", dst: "grunt_cmd.bat",version:"", watch: false},
        {src: "FB_FE_LIB/projectCommon/grunt_coding.bat", dst: "grunt_coding.bat",version:"", watch: false},
        {src: "FB_FE_LIB/projectCommon/grunt_publish.bat", dst: "grunt_publish.bat",version:"", watch: false},
        {src: "FB_FE_LIB/projectCommon/grunt_index.bat", dst: "grunt_index.bat",version:"", watch: false},
        {src: "FB_FE_LIB/projectCommon/grunt_index_server.bat", dst: "grunt_index_server.bat",version:"", watch: false},
        {src: "FB_FE_LIB/projectCommon/package.json", dst: "package.json", version:"", watch: false},
        {src: "FB_FE_LIB/projectCommon/pageList.css", dst: "css/pageList.css",version:"", watch: false},
        {src: "FB_FE_LIB/images/dataError.png", dst: "images/dataError.png", version:"", watch: false},
        {src: "FB_FE_LIB/images/dataLoading.png", dst: "images/dataLoading.png", version:"", watch: false},
        {src: "FB_FE_LIB/oniui/dropdown/", dst: "js/fb_lib/dropdown/", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/simplegrid/", dst: "js/fb_lib/simplegrid/", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/scrollbar/", dst: "js/fb_lib/scrollbar/", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/pager/", dst: "js/fb_lib/pager/", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/loading/", dst: "js/fb_lib/loading/", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/draggable/", dst: "js/fb_lib/draggable/", version:"", watch: true},

        //可选控件
        {src: "FB_FE_LIB/oniui/button/", dst: "js/fb_lib/button/", version:"", filter:/.*\.s?css/, watch: true},
        {src: "FB_FE_LIB/oniui/buttons/", dst: "js/fb_lib/buttons/", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/carousel/", dst: "js/fb_lib/carousel/", version:"", watch: true},
        {src: "FB_FE_LIB/oniui/textbox/", dst: "js/fb_lib/textbox/", version:"", watch: true}
    ],
    //----------- 项目类型配置 和 组件引入配置 结束 ------//

    //----------- 项目发布配置 （可选）------------------//
    publish: {
        clean: true,     //发布前是否清理已有文件
        compress: true, //是否压缩代码
        generateSourceMaps: false,
        dir: '../release',  //输出目录，全部文件打包后要放入的文件夹（暂不支持向父级发布）
        modules: [					  //要优化的模块
            { name:'project.core'} 	//将依赖模块合并到一个js
        ],
    }
    //----------- 项目发布配置 结束 ------------//
}

//-------- 配置grunt -----------//
var initConfig = {
    version:"", watch: {
        //配置grunt
    }
}
var defaultTasks = [];//配置默认任务
//-------- 配置grunt 结束 ------//


var fs = require('fs'), path = require('path'), ps;
module.exports = function (grunt) {
    // update global template
    if (libConfig.updateAtStart && libConfig.libSvn != null && libConfig.libSvn != "") {
        var execSync = require('child_process').execSync, cmdStr, svnAction;
        if (!fs.existsSync('FB_FE_LIB/oniui/avalon.fb.js')) {
            svnAction = "Checkout";
            cmdStr = 'svn co ' + libConfig.libUrl + ' template --username ' + libConfig.libUserName + ' --password ' + libConfig.libPassword;
        } else {
            svnAction = "Update";
            cmdStr = 'svn up template';
        }
        try {
            console.log(svnAction + " lib resource ...");
            execSync(cmdStr);
        } catch (ex) {
            console.log(svnAction + " 'avalon.oniui.fb' failed.");
        } finally {
            console.log(svnAction + " lib resource end.");
        }
    }
    try {
        ps = require('./FB_FE_LIB/projectService.js')
    } catch (e) {
    }
    if (ps) {
        initConfig.config = {files: ["Gruntfile.js"], tasks: ["initProject"], options: {spawn: false}};//noEdit
        initConfig.lib = {files: []}//noEdit
        ps.init(grunt, libConfig);
        defaultTasks.push("coding");
    }

    grunt.initConfig(initConfig);
    grunt.registerTask('default', defaultTasks);//默认任务
};
