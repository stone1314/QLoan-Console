/**
 * Created by HaihuaHuang on 2017/7/24.
 */

import md_setting from "../../templates/qo_modal/modal-settingDetail.html";
import  md_upload from "../../templates/qo_modal/modal-uploadAppDetail.html";

QO_GlobalSettingsController.$inject = ['$scope', 'toastr', '$uibModal', '$timeout', '$rootScope', 'Qo_GlobSettingService','encryptionServer'];
function QO_GlobalSettingsController($scope, toastr, $uibModal, $timeout, $rootScope, Qo_GlobSettingService,encryptionServer) {

    $scope.Model = {name: ""};
    var datatables;
    let currentuser = encryptionServer.getCurrentUserInfo("currentuser_obj");

    $scope.query = function () {
        datatables.fnUpdate();
    }

    $scope.addOrUpdate = function (state) {
        //var row = $("#globalsetting tr td  :checked")[0];
        let rows = datatables.api().row('.selected').data();
        if (rows) {
            if (state == 'update') {
                var id = rows.id;

                console.log(id);
                let modalInstance = $uibModal.open({
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    animation: true,
                    template: md_setting,
                    controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                        $scope.model = {
                            "id": "",
                            "description": "",
                            "displayName": "",
                            "groupRules": "",
                            "name": "",
                            "value": ""
                        };

                        getSetting(id, $scope);

                        $scope.save = function () {
                            var obj = {
                                "id": $scope.model.id,
                                "description": $scope.model.description,
                                "displayName": $scope.model.displayName,
                                "groupRules": $scope.model.groupRules,
                                "name": $scope.model.name,
                                "value": $scope.model.value
                            };
                            saveSetting(obj);
                            $uibModalInstance.close();
                        }
                        $scope.cancel = function () {
                            $uibModalInstance.close();
                        };
                    }]
                });
            }
        } else {
            toastr.info("请选择要修改的记录！");
        }
    }

    $scope.upload = function () {
        let modalInstance = $uibModal.open({
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: md_upload,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance, data) {
                $scope.title = "应用程序包上传";
                $scope.model = data || {};
                $scope.upload = function () {
                    console.log($scope.model);
                    var data = new FormData();
                    $.each($('#file')[0].files, function (i, file) {
                        data.append('upload_file', file);
                    });
                    console.log(data);
                    $.ajax({
                        url: 'https://sitqone-wh-resources.quarkfinance.com/upload/packages',
                        type: "POST",
                        contentType: false,
                        processData: false,
                        data: data,
                        beforeSend: function () {
                       //     uploading();
                        },
                        success: function (data) {
                            console.log(data);
                            if (data.length > 2) {
                                $timeout(function () {
                                    toastr.success('应用程序包上传成功');
                                });
                            } else {
                                $timeout(function () {
                                    toastr.error('文件上传失败');
                                });
                            }

                        },
                        complete: function () {
                           // completeUpLoading();
                        },
                        error: function (data) {
                            $timeout(function () {
                                toastr.error('上传应用程序包时出现错误');
                            });
                        }
                    });
                }


                $('#file').on('change', function () {
                    $('#file-name').val($('#file').val());
                });

                /* $scope.upload = function () {
                 var data = {upload_file: $scope.model.file};

                 console.log(data);
                 $.ajax({
                 url:'https://sitqone-wh-resources.quarkfinance.com/upload/packages',
                 type:'POST',
                 contentType:false,
                 processData:false,
                 data:data,
                 success:function (data) {
                 console.log(data);
                 if(data.length>2){
                 toastr.success("上传成功！");
                 }else {
                 toastr.error("上传失败！");
                 }
                 }
                 });
                 };*/

                $scope.cancel = function () {
                    $uibModalInstance.close();
                };
            }]
        });
    }



    let getSetting = function (id, scope) {
        Qo_GlobSettingService.getSetting(id).then(function (result) {
            console.log(result);
            if (result.responseStatus) {
                var data = result.body;
                console.log(data);
                scope.model = {
                    "id": data.id,
                    "description": data.description,
                    "displayName": data.displayName,
                    "groupRules": data.groupRules,
                    "name": data.name,
                    "value": data.value
                };
            } else {
                toastr.error("查询反馈详情出错！" + result.responseMsg);
            }
        });
    };

    $scope.clearAllCache = function () {
        Qo_GlobSettingService.removeCache().then(function (result) {
            if(result.responseStatus){
                toastr.success("清除缓存成功！");
            }else {
                toastr.error("清除缓存失败！"+result.responseMsg);
            }
        });
    }

    //保存设置
    let saveSetting = function (data) {
        Qo_GlobSettingService.addUpdateSetting(data).then(function (result) {
            if (result.responseStatus) {
                toastr.success("修改成功！");
                datatables.fnUpdate();
            } else {
                toastr.error("修改失败！" + result.responseMsg);
            }
        });
    }

// Init Datatable
    $scope.setTableOptions = {
        ajax: function (data, callback, settings) {


            var param = JSON.stringify({
                name: $scope.Model.name,
                pageNo: (data.start / data.length) + 1,
                pageSize: "10"
            });

            $.ajax({
                type: "POST",
                url: Qo_GlobSettingService.getUrl(),//'http://172.29.20.30:8080/qoneapi/bk/set/getGlobalSettingList',
                cache: false,
                data: param,
                contentType: "application/json;",
                success: function (result) {
                    console.log(result);
                    var returnData = {};
                    //  returnData.draw = 2;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.body.rows;//返回数据全部记录
                    returnData.recordsFiltered = result.body.rows;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.body.result;//返回的数据列表
                    //console.log(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    if (returnData.data!=undefined) {
                        callback(returnData);
                    }
                },
                beforeSend: function(xhr) {
                    let token =currentuser.token;
                    xhr.setRequestHeader("authorization", token);
                }
            });
        }
        ,
        columns: [
            {data: "id"},
            {data: "groupRules"},
            {data: 'displayName'},
            {data: 'name'},
            {data: 'value'},
            {data: 'description'}
        ],
        columnDefs: [
            {
                "title": "id",
                targets: 0,
                "bSortable": false,
                "bVisible": false
            },
            {
                "title": "选择",
                targets: 1,
                "bSortable": false,
                "sWidth": "50px",
                "bAutoWidth": false,
                "className": 'select-checkbox',
                "mRender": function () {
                    return null;
                },
            },
            {
                "title": "显示名称",
                targets: 2
            },
            {
                "title": "名称",
                targets: 3
            },
            {
                "title": "值",
                targets: 4,
                render: function (data, type, row, meta) {
                    if (data.length > 50) {
                        return data.substring(0, 50) + "……";
                    } else {
                        return data;
                    }
                }
            },
            {
                "title": "说明",
                targets: 5
            }
        ],
        /*sScrollY: "300px",
         sScrollX: "100%",
         sScrollXInner: "130%",*/
        bScrollCollapse: true,//保持必要的宽度
        bPaginate: true,//是否有分页
        "fnInitComplete": function () {
            datatables = $("#globalsetting").dataTable();
        }
    };


}
angular.module('controller').controller("QO_GlobalSettingsController", QO_GlobalSettingsController);