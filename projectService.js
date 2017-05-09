/**
 * Created by CHECK on 2015/12/11.
 */
var fs= require('fs'), path = require('path'),cps=[],cpns=[],addSourceUrl,coped=0;
var childProcess = require('child_process')
var md = function(dst){
    var test = "about.html";
    var ext = path.extname(dst)
    var dir = ext==""? dst:path.dirname(dst);
    if(!fs.existsSync(dir)){
        var pathes = dir.split(path.sep),curPath="";
        for(var x= 0;x<pathes.length;x++){
            curPath += pathes[x]+path.sep;
            if(!fs.existsSync(curPath)){
                try{
                    fs.mkdirSync(curPath);
                }catch (ex){
                    console.log(ex);
                }
            }
        }
        
    }
}
var svnIgnore = function(dst){
        try{
            //childProcess.execSync("svn propedit svn:ignore "+dst)
            //childProcess.execSync("TortoiseProc.exe /closeonend:1 /command:ignore /path:"+dst)
        }catch(ex){
            //console.log("svn 忽略文件时出错：",dst)
        }
}
var cd = function( src, dst , srcObj, filter, callback){
    cdi(src,dst,srcObj,filter,callback);
    function copy(){
        if(cps.length>0){
            var f=cps.shift(),na=cpns.shift(),readable,writable
            md(f.dst);
            if(srcObj.svnIgnore) svnIgnore(dst);
            try{
                readable = fs.createReadStream(f.src );
                writable = fs.createWriteStream(f.dst );
                if(addSourceUrl && f.over && path.extname(f.src) == ".js" ){
                    writable.write("//# sourceURL="+ f.src+"\n");
                }
                readable.pipe( writable );                
             }catch(ex){
                coped ++;
                console.log("copy Error:",ex);
                copy();
             }
             readable.on('end',function(a,b,c){
                    console.log('coped:',this.path);
                    copy();
                }).on('error',function(){
                    coped ++;
                    console.log('Copy Error:',this.path);
                    copy();
                })
        }else{
            console.log("file copy end.");
            if(callback){
                callback();
            }
        }
    }
    copy();
};
var cdi = function(src,dst,srcObj,filter,callback){
    src = path.normalize(src);
    var st = fs.statSync(src),mch;
    var temp = src.split(path.sep);

    if(filter){
        mch = temp[temp.length-1].match(filter);
    }
	
    if(!filter || !mch){
		if(st.isDirectory()){
            md(dst);
            if(srcObj.svnIgnore) svnIgnore(dst);
            
            var paths = fs.readdirSync( src);
            paths.forEach(function( childDir ){
                if(!filter || !childDir.match(filter)){
                    var _src = path.normalize(src + path.sep + childDir),
                        _dst = path.normalize(dst + path.sep + childDir),
                        readable, writable;

                    if(fs.existsSync(_src)){
                        var st = fs.statSync( _src);
                        if( st.isFile()){
                            cdi(_src,_dst,srcObj.watch,filter,callback);
                        }else if( st.isDirectory() ){
                            es( _src, _dst, cdi , srcObj, filter,callback);
                        }
                    }else{
                        console.log("No File：",_src);
                    }
                }

            });
        }else if(st.isFile() && path.basename(src).replace(/\..*/,"")!=""){
            var isExists = fs.existsSync(dst);
            if((!isExists || srcObj.watch))
            {
				var old = cpns.indexOf(dst)
				if(old==-1){
					cps.push({src:src, dst:dst, over:srcObj.watch});
					cpns.push(dst)
				}else{
					cps[old].src = src;
					cps[old].over = srcObj.watch;
				}
            }
        } 
    }
}
var md1 = function (dirpath, mode) {
    var ext = path.extname(dirpath)
    if(ext){
        dirpath = path.dirname(dirpath);
    }
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split(path.sep).forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
        });
    }
    return true;
};
var es = function( src, dst, callback ){
    src = path.normalize(src);
    dst = path.normalize(dst);
    //var absSrc = path.isAbsolute(src)?src:process.

    var otherParam = Array.prototype.splice.call(arguments,0);
    otherParam.splice(2,1);

    if(fs.existsSync( src )){
        callback.apply({},otherParam)
    }else{
        console.log("Source file not found:",src);
    }
}
var dl = function(src){
    if(fs.existsSync(src)){
        var st = fs.statSync(src);
        if(st.isDirectory()){
            var files = [];
            files = fs.readdirSync(src);
            files.forEach(function(file,index){
                var curPath = src + "/" + file;
                if(fs.statSync(curPath).isDirectory()) { // recurse
                    dl(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(src);

        }else if(st.isFile()){
            fs.unlinkSync(src);
        }else{
            console.log("[Warning]:delete file failed,file is not dir and file:",src)
        }
    }else {
        console.log("[Warning]:delete file failed,file not exist:",src)
    }
}
var updateLib = function(srcObj,action){
    if(action===void(0)) action="add";
    var src = path.normalize(srcObj.src),dst=path.normalize(srcObj.dst);
    if(src==""||/$(\.\/)?FB_FE_LIB(\/)?(oniui(\/))?^/.test(src)) return;
    if(action=="changed"||action=="add"){
        es(src ,dst, cd,srcObj,new RegExp("(\\.svn)|(\\.ex\\d*\\.html)|(\\.doc\\.html)|(\\.test\\.html)"+(srcObj.filter?"|"+srcObj.filter:"")),null);
    }else if(action=="delete"){
        dl(src);
    }
}
module.exports = {
    init:function(grunt,libConfig){
        addSourceUrl = libConfig.addSourceUrl
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.event.on('watch', function(action, filepath) {
            filepath = path.normalize(filepath);
            var hasFound;
            for(var i= 0,il=libConfig.libImports.length;i<il;i++){
                var item=libConfig.libImports[i], src = path.normalize(item.src);
                if(item.watch!=false){
                    if(fs.statSync(src).isDirectory()){
                        if(filepath.indexOf(src)>=0){
                            if(item.filter && item.filter !='' && filepath.match(item.filter)){
                                return;
                            }
                            cps.push({src:filepath, dst:item.dst+filepath.replace(src,""), over:true});
                            cpns.push(item.dst)
                            updateLib(item,action);
                            hasFound = true;
                            break;
                        }
                    }else{
                        if(src == filepath){
                            cps.push({src:item.src, dst:item.dst, over:true});
                            cpns.push(item.dst)
                            updateLib(item,action);
                            hasFound=true;
                            break;
                        }
                    }
                }
            }
        });
        grunt.registerTask('initProject', '', function() {
            for(var i= 0,il=libConfig.libImports.length;i<il;i++){
                updateLib(libConfig.libImports[i]);
            }
            grunt.task.run(['updateLibWatch'])
            console.log("Init project end.");
        });
        grunt.registerTask('updateLibWatch','',function(){
            var _watches=[];
            for(var i= 0,il=libConfig.libImports.length;i<il;i++){
                var item = libConfig.libImports[i];
                if(item.watch!=false){
                    var src = path.normalize(item.src);
                    if(fs.statSync(src).isDirectory()){
                        _watches.push(src+"*");
                        console.log("watch:",src+"*");
                    }else{
                        _watches.push(src);
                        console.log("watch:",src);
                    }
                }
            }
            grunt.config('watch.lib.files', _watches);
        });

        grunt.registerTask('publish','',function(){
            var common = {
                appDir: './',
                dir: '../release',
                baseUrl:'js',
                paths:{
                    avalon:'fb_lib/avalon.shim',
                    //echarts: 'fb_lib/echarts',
                    domReady:'fb_lib/domReady'
                },
                map:{
                    '*':{
                        'css':'fb_lib/require.css',
                        'text':'fb_lib/require.text'
                    }
                },
                shim:{
                    avalon: { exports: "avalon" }
                    //echarts:{exports:"echarts"}
                },

                modules:[],

                keepBuildDir:true,
                allowSourceOverwrites:false,
                removeCombined: true,
                fileExclusionRegExp: '{0}',
                generateSourceMaps:false,
                preserveLicenseComments:false,
                optimizeCss: 'standard',
                optimize: "uglify2",
                uglify2: {
                    output: {
                        beautify: false
                    },
                    compress: {
                        sequences: false,
                        global_defs: {
                            DEBUG: false
                        }
                    },
                    warnings: true,
                    mangle: false
                }
            }
            common.dir = libConfig.publish.dir;
            common.modules = libConfig.publish.modules;

            if(!libConfig.publish.compress){
                common.optimizeCss = "none";
                common.optimize = "none";
            }
            if(libConfig.publish.generateSourceMaps){
                common.generateSourceMaps = true;
                preserveLicenseComments = true;
            }
            var exclude = "^(r|build|Gruntfile)\\.js|.*\\.scss$|.*\\.ts$|.*\\.less$|^FB_FE_LIB$|^node_modules$|^package\\.json$|^\\.idea$|^\\.svn$|^\\.gitignore$|(?!.*server)^.*\\.bat$|\\.editorconfig$|\\.jshintrc$|^LICENSE$|.*\\.min\\.js$";
            var excludeForOther = "^(r|build|Gruntfile)\\.js|.*\\.scss$|.*\\.ts$|.*\\.less$|^FB_FE_LIB$|^node_modules$|^package\\.json$|^\\.idea$|^\\.svn$|^\\.gitignore$|(?!.*server)^.*\\.bat$|\\.editorconfig$|\\.jshintrc$|^LICENSE$";
            fs.writeFileSync('build.js',"("+JSON.stringify(common).replace('"{0}"',"/"+exclude+"/")+")");

            if(!fs.existsSync(common.dir)){
                fs.mkdirSync(common.dir);
            }else if(libConfig.publish.clean){
                console.log('clean...')
                var paths = fs.readdirSync(common.dir);
                var regex = new RegExp("^\\.idea$|^\\.svn$");

                paths.forEach(function( childDir ){
                    var mch = childDir.match(regex)
                    if(!mch){
                        var _src = path.normalize(common.dir + path.sep + childDir);
                        dl(_src);
                    }
                })
            }

            //copy other file but js and css
            es("./",common.dir,cd,{watch:true},new RegExp(excludeForOther),function(){
                require('child_process').execSync('node r.js -o build.js',{stdio:[0,1,2]});
            });//+"|.*\\.map$|.*.js$|.*\\.css$"

            grunt.task.run('watch');

        });
        grunt.registerTask('coding', ['initProject','watch']);
    }
}

