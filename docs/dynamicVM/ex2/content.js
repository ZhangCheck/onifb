/**
 * Created by Administrator on 2016/8/17 0017.
 */
require(["./dynamicform/avalon.dynamicform"],function(){
    var vm=avalon.define({
        $id:'main',
        $opts:{
            columnNum:4,
            dataSource:"./ex2/ex2.json"
        }
    })
    avalon.scan()
})