var args1 = process.argv.slice(2)
//
//if(!args1 || args1.length ==0){
//    console.log("no params");
//    return;
//}

var fs = require('fs')
var readline = require("./node-readline.js");
var root = args1.length>1?(args1[1]+"/"):"";
console.log("root:",root);
var source=args1[0];
var isTemplate=false;
//if(source.indexOf(".d.ts")>-1){
//    return;
//}
if(source.indexOf("\\template\\")>-1) {
    isTemplate = true;
}
var target=source.replace(".ts",".js")
var references = [];
parse(root+source,references);

var childProcess = require('child_process');
var StringDecoder =  require('string_decoder').StringDecoder;
//exec tsc
var decoder = new StringDecoder('utf8');
//--suppressImplicitAnyIndexErrors --removeComments " -out "+root+target+
var cmd = "tsc --sourceMap "+(args1.length>1?" --rootDir "+args1[1]:"")+" -out "+ target+" "+references .join(" ") ;
var tsc = childProcess.exec(cmd);
console.log("cmd:",cmd);
console.log("tsc:",decoder.write(tsc));

//exec tsc end
function getPath(path,rel){
    return path;
}
function parse(source,refs){
    console.log("parse:",source);
    var r = readline.fopen(source,"r");
    if(r===false)
    {
        console.log("Error, can't open ", source)
        process.exit(1)
    }

    do
    {
        var line= "";
        line = readline.fgets(r);
        //line = line.replace(/(^\s*)|(\s*$)/g,"");
        if(line != false)
        {
            var reg = new RegExp("path=\"[^ ]*\"");

            if(reg.test(line)){
                var path = reg.exec(line);
                if(path && path.length>0 && path[0].indexOf(".d.ts")<0 && line.indexOf("merge=\"No\"")<0){
                    path = path[0].substring(6,path[0].length-1);// .replace("../template","template");
                    //path = path.indexOf("template/")>-1?path:"js/"+path;
                    parse(isTemplate?"template\\js\\"+path:root+path,refs);
                }
            }
            //fs.writeSync(w, line + "\n", null, 'utf8')
        }

        if(refs.indexOf(source)<0){
            refs.push(source);
        }
    }
    while (!readline.eof(r))

}
