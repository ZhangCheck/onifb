var fs = require('fs'), fileList = [];
var args = process.argv.slice(2);
if(args==0){
   console.log("need one argument at least");
}else{
    walk(args[0]);
    console.log(fileList);
}

function walk(path){
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item){
        if(fs.statSync(path + '/' + item).isDirectory()){
            if(args.length>=2&&args[1]==true) walk(path + '/' + item);
        }else{

            if(item.match(/\.css$/)){
                var toFile = path+'/'+item.replace('.css','.less');
                if(!fs.existsSync(toFile)){
                    fs.createReadStream(path+'/'+item).pipe(fs.createWriteStream(toFile));
                    fileList.push(path + '/' + item);
                }
            }
        }
    });
}



