
//@ sourceUrl=./avalon.simplegrid.ex19.html

require(["simplegrid/avalon.simplegrid"], function() {
    var vm = avalon.define({
        $id:"test",
        $Opt:{
            useInnerRequest:true,
            interface:{
                remoteUrl:"ex1/gridData.json",
                localUrl:"ex1/gridData.json",
                type:"POST",
                status:"200",
                //data:{'pageSize':10,'pageNum':1},
                success:function(data){
                    //none
                }
            },

            pageable: true,
            rowSingleLine:false,
            pager: {
                perPages: 10,
                showPages: 5,
                options: [10, 20, 30, 40]
            },
            argFormat:function(args,pageNum,pageSize){
                return avalon.mix(args,{"pageSize":pageSize,"pageNum":pageNum})
            },
            dataFormat:function(vmodel,interfaceData,options) {
                vmodel.pager.totalItems=interfaceData.total
                var columns=new Array();
                for(var i=0;i<interfaceData.cols.length;i++)
                {
                    columns.push({field: interfaceData.cols[i].field, text:interfaceData.cols[i].text , resizable: true, align: "center"})
                }
                vmodel.columns=vmodel.getColumns(columns,options)
                return interfaceData.data
            }
        }
    })
    avalon.scan();
});
//@ sourceUrl=./avalon.simplegrid.ex18.html