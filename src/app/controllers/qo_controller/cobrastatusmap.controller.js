/**
 * Created by HaihuaHuang on 2017/7/24.
 */
import cobraStatusMapModal from '../../templates/qo_modal/modal-cobrastatusmapDetail.html';
CobrasSatusMapController.$inject = ['$scope', '$location', 'toastr', 'CobraStatusMapService', '$filter', '$uibModal', 'encryptionServer']

function CobrasSatusMapController($scope, $location, toastr, CobraStatusMapService, $filter, $uibModal, encryptionServer) {

    let datatables;
    let currentuser = encryptionServer.getCurrentUserInfo("currentuser_obj");
    $scope.model = {
        category: null,
        cobraApplyStatus: null,
        applyState: null,

    }

    $scope.dropDown = {
        categoryList: {},
        cobraApplyStatusList: {},
        applyStateList: {}
    }

    //获取所有分类
    let getCategory = function (scope) {
        let data = {
            prefix: "Qone",
            code: "STATUS_PRODUCT_CATEGROY",
            dataVersion: "2"
        }
        CobraStatusMapService.getCacheForPidKey(data).then(function (data) {
            //console.log(data);
            if (data.responseStatus) {
                scope.dropDown.categoryList = data.body[0].RESULT;
            }
        });

    }
    //获取COBRA申请状态
    let getCobraStatus = function (scope) {
        let data = {
            prefix: "Qone",
            code: "COBRA_ENUM_PRE_APP_MAIN_APP_STATUS_FOR_APP",
            dataVersion: "2"
        }
        CobraStatusMapService.getCacheForPidKey(data).then(function (data) {
            //console.log(data);
            if (data.responseStatus) {
                scope.dropDown.cobraApplyStatusList = data.body[0].RESULT;
            }
        });

    }
    //获取申请状态
    let getApplyStatus = function (scope) {
        let data = {
            prefix: "Qone",
            code: "ENTER_STATUS",
            dataVersion: "2"
        }
        CobraStatusMapService.getCacheForPidKey(data).then(function (data) {
            console.log(data);
            if (data.responseStatus) {
                scope.dropDown.applyStateList = data.body[0].RESULT;
            }
        });
    }

    $scope.initPage = function () {
        getCategory($scope);
        getCobraStatus($scope);
        getApplyStatus($scope);
    }

    $scope.reset = function () {
        $scope.model = {};
    }
    /*查询*/
    $scope.query = function () {
        datatables = $("#cobrastatusmap").dataTable();
        datatables.fnUpdate();
    }

    // Init Datatable
    $scope.setTableOptions = {
        ajax: function (data, callback, settings) {
            var param = JSON.stringify({
                category: $scope.model.category,
                cobraAppStatus: $scope.model.cobraApplyStatus,
                appStatus: $scope.model.applyState,
                pageNo: (data.start / data.length) + 1,
                pageSize: "10",
                column: data.columns[data.order[0].column].data,
                sort: data.order[0].dir,
            });
            console.log(param);
            $.ajax({
                type: "POST",
                url: CobraStatusMapService.getUrl(),
                cache: false,
                data: param,
                contentType: "application/json;",
                success: function (result) {
                    console.log(result);
                    if (result.body && result.body.rows) {
                        var resultData = {};
                        resultData.recordsTotal = result.body.rows;//返回数据全部记录
                        resultData.recordsFiltered = result.body.rows;//后台不实现过滤功能，每次查询均视作全部结果
                        resultData.data = result.body.result;
                        if (resultData.data != undefined) {
                            callback(resultData);
                        }
                    }
                },
                beforeSend: function (xhr) {
                    let token = currentuser.token;
                    xhr.setRequestHeader("authorization", token);
                }

            });
        }
        ,
        columns: [
            {data: "id"},
            {data: "id"},
            {data: 'category'},
            {data: 'cobraAppStatus'},
            {data: 'createdTime'}
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
                "sWidth": "70px",
                "bAutoWidth": false,
                className: 'select-checkbox',
                "mRender": function () {
                    return null;
                },
            },
            {
                "title": "分类",
                targets: 2,
                //"bVisible": false
            },
            {
                "title": "COBRA申请状态名称",
                targets: 3
            },
            {
                "title": "创建时间",
                targets: 4,
                "mRender": function (data) {
                    var result = $filter("date")(data, "yyyy-MM-dd");
                    return result;
                }
            }
        ],
        bScrollCollapse: true,//保持必要的宽度
        bPaginate: true,//是否有分页
        "fnInitComplete": function () {
            datatables = $("#cobrastatusmap").dataTable();
        }

    };

    $scope.remove = function () {

        let rows = datatables.api().row('.selected').data();
        if (rows) {
            // let url="http://172.29.20.29:8080/qoneapi/bk/map/deleteAppStatusMapping/"+id+"";
            let url = CobraStatusMapService.deleteAppStatusMapping() + rows.id;
            //console.log(url);
            $.post(url, function (data) {
                if (data.responseCode != "10000") {
                    toastr.error(data.responseMsg);
                }
                toastr.error("删除成功!");
                //location.reload();
                //datatables = $("#cobrastatusmap").dataTable();
                //datatables.fnUpdate();
            });
        }
        else {
            toastr.error("请选择一条数据！");
        }
    }
    $scope.clearStatusCache = function () {
        let paramData = {}
        CobraStatusMapService.clearAppStatusCache(paramData).then(function (data) {
            if (data.responseCode != "10000") {
                toastr.warning(data.responseMsg, "Warning");
                return;
            }
            toastr.success("清除状态缓存成功！", "");
        });
    }

    $scope.setMapping = function () {
        let id = "";
        $("input[name='boxs']:checked").each(function (i, item) {
            id = $(item).val();
        });
        if (id != "") {
            //修改
            let modalInstance = $uibModal.open({
                size: 'ml',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: cobraStatusMapModal,
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.title = "修改";
                    $scope.model = {
                        DESCRIPTION: "",
                        COBRA_APP_STATUS: "",
                        CATEGORY: ""
                    };
                    $scope.dropDown = {
                        categoryList: {},
                        cobraApplyStatusList: {},
                        applyStateList: {}
                    }
                    $scope.close = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.init = function () {
                        getCategory($scope);
                        getCobraStatus($scope);
                        getApplyStatus($scope);
                        //let url="http://172.29.20.29:8080/qoneapi/bk/map/getAppStatusMappingById/"+id+"";
                        let url = CobraStatusMapService.getAppStatusMappingById() + id;
                        $.post(url, function (data) {
                            if (data.responseStatus) {
                                console.log(data);
                                let sel = data.body.appStatusList;
                                for (var i = 0; i < sel.length; i++) {
                                    $("input[name='app_status']").each(function () {
                                        if ($(this).text() == sel[i]) {
                                            this.checked = true;
                                        }
                                    });
                                }
                                $scope.model = {
                                    DESCRIPTION: data.body.description,
                                    COBRA_APP_STATUS: data.body.cobraAppStatus,
                                    CATEGORY: data.body.category,
                                };
                                $("#selCategory").find("option[text='" + data.body.category + "']").attr("selected", true);
                                $("#selCobraApplyStatus").find("option[text='" + data.body.cobraAppStatus + "']").attr("selected", true);
                            }

                        });
                    }

                    $scope.save = function () {
                        var array = new Array();
                        $("input[name='app_status']:checked").each(function (i, item) {
                            array.push($(item).val());
                        });
                        let data = {
                            cobraAppStatus: $scope.model.COBRA_APP_STATUS,
                            description: $scope.model.DESCRIPTION,
                            category: $scope.model.CATEGORY,
                            appStatusList: array
                        };
                        CobraStatusMapService.addOrUpdateAppStatusMapping(data).then(function (data) {
                            if (!data.responseStatus) {
                                toastr.error(data.responseMsg);
                            }
                            toastr.error("修改成功!");
                            location.reload();

                        });
                    }

                }]
            });
        }
        else {
            //新增
            let modalInstance = $uibModal.open({
                size: 'ml',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: cobraStatusMapModal,
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.model = {
                        DESCRIPTION: "",
                        COBRA_APP_STATUS: "",
                        CATEGORY: ""
                    };
                    $scope.dropDown = {
                        categoryList: {},
                        cobraApplyStatusList: {},
                        applyStateList: {}
                    }
                    $scope.title = "添加";
                    $scope.close = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.init = function () {
                        getCategory($scope);
                        getCobraStatus($scope);
                        getApplyStatus($scope);
                    }
                    $scope.save = function () {
                        var array = new Array();
                        $("input[name='app_status']:checked").each(function (i, item) {
                            array.push($(item).val());
                        });
                        let data = {
                            cobraAppStatus: $scope.model.COBRA_APP_STATUS,
                            description: $scope.model.DESCRIPTION,
                            category: $scope.model.CATEGORY,
                            appStatusList: array
                        };
                        console.log(data);
                        CobraStatusMapService.addOrUpdateAppStatusMapping(data).then(function (data) {
                            if (!data.responseStatus) {
                                toastr.error(data.responseMsg);
                            }
                            toastr.error("添加成功!");
                            location.reload();

                        });
                    }
                }]
            });

        }
    }


}
angular.module("controller").controller("CobrasSatusMapController", CobrasSatusMapController);