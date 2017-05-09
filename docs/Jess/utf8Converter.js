var fs = require('fs'), fileList = [];
var args = process.argv.slice(2);
if(args.length==0){
   console.log("need one argument at least");
}else{
    walk(args[0]);
    console.log(fileList);
}

function walk(path){
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(item){
        if(fs.statSync(path + '/' + item).isDirectory()){
            if(args.length>=2&&args[1]=="true") walk(path + '/' + item);
        }else{
            if(item.match('_backup.scss')||item.match('_backup.css')){
                fs.unlink(path+'/'+item,function(err){console.log(err)});
            }
            /*if(item.match(/\.scss$/) && !item.match('_backup.scss') && !item.match('_temp.scss')){
                var toFile;
                if(item.indexOf('_temp.scss')==-1){
                    toFile = path+'/'+item.replace('.scss','_temp.scss');
                    if(!fs.existsSync(toFile)){
                        fs.createReadStream(path+'/'+item).pipe(fs.createWriteStream(toFile,{encoding:'utf-8'}));
                        fileList.push(path + '/' + item);
                    }
                }else{
                    toFile = path+'/'+item;
                }

                fs.renameSync(path+'/'+item,path+'/'+item.replace('.scss','_backup.scss'));//,function(error){console.log(error)});
                //fs.unlink(path+'/'+item,function(err){console.log(err)});
                fs.renameSync(toFile,path+'/'+item);//,function(err){console.log(err)});
                //fs.renameSync()
            }*/
        }
    });
}



