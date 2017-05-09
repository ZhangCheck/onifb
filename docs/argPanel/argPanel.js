/**
 * Created by CHECK on 2015/10/7.
 */
/*require.config({
    paths:{
        jquery:"jquery.min.js",
        avalon:"avalon.js"
    },
    shim:{
        jquery:{
            exports:"jQuery"
        },
        avalon:{
            exports:"avalon"
        }
    }
})*/
define(["avalon", "css!argPanel/ckArgPanel.css"], function(avalon) {
    var widget = avalon.ui.arg_panel = function(element, data, vmodels) {
        var options = data.arg_panelOptions;

    }
    widget.defaults = {
        prop:"default"
    }
    return avalon;
})