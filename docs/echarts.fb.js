/**
 * Created by Administrator on 2015/12/1.
 */
define(["./avalon.fb",'echarts/echarts','domReady'],function(fb,echarts){
    //打印对象
    var fb = fb||{};
    if(!window.echarts) window.echarts = echarts;
    fb.copydy = function(copyText){
        var props = "";
        for(var p in copyText){
            if(typeof(copyText[p])=="function"){
                copyText[p]();
            }else{
                props+= p + "=" + copyText[p] + "\n";
            }
        }
        if (window.clipboardData) {
            window.clipboardData.setData("Text", props) ;
        }
        else {
            var flashcopier = 'flashcopier';
            if(!document.getElementById(flashcopier)) {
                var divholder = document.createElement('div');
                divholder.id = flashcopier;
                document.body.appendChild(divholder);
            }
            document.getElementById(flashcopier).innerHTML = '';
            var divinfo = '<embed src="../js/_clipboard.swf" FlashVars="clipboard='+encodeURIComponent(props)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
            document.getElementById(flashcopier).innerHTML = divinfo;
        }
        alert('copy成功！\n'+props);
    };

    //动态展示列表行数
    fb.getRows = function(){
        var rows;
        var offsetHeight=$(".menu-content").get(0).offsetHeight;
        if(offsetHeight>520){
            rows=10;
        }else if(offsetHeight>480){
            rows=9;
        }else if(offsetHeight>440){
            rows=8;
        }else if(offsetHeight>400){
            rows=7;
        }else if(offsetHeight>360){
            rows=6;
        }else{
            rows=5;
        }
        return rows;
    };
    fb.getSeries=function(result){
        for(var line_arry=new Array,i=0;i<result.length;i++){
            var series={
                name:"1",
                type:"line",
                stack:"总量",
                symbol:"emptyCircle",
                itemStyle:{
                    normal:{
                        areaStyle:{
                            color:"rgba(220, 20, 60, 0.3)"}
                    }
                },
                data:[]
            };
            line_arry.push(series)
        }
        return line_arry
    };
    window.fb = fb;
    return fb;
});