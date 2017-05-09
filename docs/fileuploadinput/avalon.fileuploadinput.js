/**
 * Created by Administrator on 2016/7/12 0012.
 */
define(['avalon',
    'text!./avalon.fileuploadinput.html',
    'css!./avalon.fileuploadinput.css',
    '../fileuploader/avalon.fileuploader',
    '../dialog/avalon.dialog',
    '../draggable/avalon.draggable'], function (avalon, template) {
    var widget = avalon.ui.fileuploadinput = function (element, data, vmodels) {
        var widgetId = data.fileuploadinputId,
            options = data.fileuploadinputOptions,
            isInited = false;
        template = template.replace(new RegExp("DIALOG_ID", "g"), widgetId).replace(new RegExp("UPLOADER_ID", "g"), widgetId);

        var vmodel = avalon.define(widgetId, function (vm) {
            avalon.mix(vm, options);

            if (vm.files && vm.files.length > 0) {
                vm.fileuploaderOpts.previews = vm.files;
                var nameArr = new Array(),
                    keyArray = new Array()

                vm.files.forEach(function (file) {
                    nameArr.push(file.name)
                    keyArray.push(file.fileKey)
                })
                vm.value = keyArray.join(";")
                vm.text = nameArr.join(";")
            }
            else{
                vm.value ="";
                vm.text ="";
            }

            //选中效果
            vm.focus = false;
            vm.mouseIn = function () {
                vm.focus = true;
            }
            vm.mouseOut = function () {
                vm.focus = false;
            }

            vm.$init = function (continueScan) {
                if (isInited) return;
                isInited = true;
                element.innerHTML = template;


                var duplexName = (element.msData["ms-duplex"] || "").trim(),
                    duplexModel;

                if (duplexName && (duplexModel = avalon.getModel(duplexName, vmodels))) {
                    duplexModel[1].$watch(duplexModel[0], function (newValue) {
                        vmodel.files = newValue;
                    })
                }

                //监听files的变化，来改变文件上传控件中的文件
                vm.$watch("files", function (n, o) {
                    avalon.nextTick(function () {
                        var nameArr = new Array(),
                            keyArray = new Array()

                        if (vm.files && vm.files.length > 0) {
                            vm.files.forEach(function (file) {
                                nameArr.push(file.name)
                                keyArray.push(file.fileKey)
                            })
                            vm.value = keyArray.join(";")
                            vm.text = nameArr.join(";")
                        }else{
                            vm.value =""
                            vm.text = ""
                        }

                        if (duplexModel) {
                            duplexModel[1][duplexModel[0]] = vm.files
                        }
                    });
                })


                if (continueScan) {
                    continueScan()
                } else {
                    avalon.log("请尽快升到avalon1.3.7+")
                    if (typeof options.onInit === "function") {
                        options.onInit.call(element, vmodel, options, vmodels)
                    }
                }
            }


            //展示弹出框
            vm.showDialog = function (diglogId) {
                avalon.vmodels[diglogId].toggle = true;
            }
        })

        return vmodel;
    }

    widget.defaults = {
        value: "",
        width:'100%',
        text: "",
        field:"",
        files: [],
        dialogOpts: {
            width: 800,
            title: "文件上传",
            type: 'alert',
            onConfirm: function (e, vmodel) {
                var id = vmodel.$id.replace('fileuploadDialog-', ""),
                    filevm = avalon.vmodels['fileuploadUploader-' + id],
                    vm = avalon.vmodels[id];
                if (filevm.previews.length == 0) {
                    vm.files.removeAll()
                    vm.files=new Array();
                }
                else {
                    vm.files = filevm.previews
                }
            }
        },
        fileuploaderOpts: {
            head: {
                visible: false
            },
            previews: [],
            acceptFileTypes: "image.*,*.txt,*.js",
            addButtonText: "添加文件",
            uploadButtonText: "开始上传",
            noPreviewText: "",
            previewStageHeight: 200,
            showProgress: true
        }
    }
})