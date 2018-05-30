/**
 * Created by HaihuaHuang on 2017/7/24.
 */
import  md_depment from '../../templates/qo_modal/model-depmentDetal.html';

DepartmentsController.$inject = ['$scope', '$location', 'toastr', '$filter', 'DepmentService', '$uibModal', '$timeout','encryptionServer']
function DepartmentsController($scope, $location, toastr, $filter, DepmentService, $uibModal, $timeout,encryptionServer) {
    var datatables;
    let currentuser = encryptionServer.getCurrentUserInfo("currentuser_obj");
    $scope.Model = {Name: "", Code: ""};
    // 重置条件查询框
    $scope.reset = function () {
        $scope.Model = {Name: "", Code: ""};
    }


    //查询
    $scope.query = function () {
        datatables.fnUpdate();
    };


    //启用禁用
    $scope.upstate = function () {
        let rows = datatables.api().row('.selected').data();
        if (rows) {
            var depId = rows.id;
            var depState = rows.isActived;
            if (depState == 0)
                depState = 1;
            else
                depState = 0;
            var data = {id: depId, isActived: depState};
            console.log(data);
            DepmentService.updateDepmentState(data).then(function (result) {
                console.log(result);
                if (result.responseStatus) {
                    toastr.success("修改成功！");
                    datatables.fnUpdate();
                }
            });
        }
        else {
            toastr.info("请选择记录！");
        }
    }

    //修改
    $scope.update = function () {
        let rows = datatables.api().row('.selected').data();
        if (rows) {
            var depId = rows.departmentCode;
            let modalInstance = $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: md_depment,
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.model = {DEPARTMENT_NAME: "", DEPARTMENT_CODE: "", DESCRIPTION: "", ID: ""};
                    $scope.init = function () {
                        var data = {"departmentCode": depId, "pageIndex": "1", "pageSize": "1"};
                        console.log(data);
                        DepmentService.getDepment(data).then(function (result) {
                            console.log(result);
                            if (result.responseCode == "10000") {
                                $scope.model = {
                                    DEPARTMENT_NAME: result.body.result[0].departmentName,
                                    DEPARTMENT_CODE: result.body.result[0].departmentCode,
                                    DESCRIPTION: result.body.result[0].description,
                                    ID: result.body.result[0].id
                                };
                            }
                        });
                    };

                    $scope.save = function () {
                        var data = {
                            "id": $scope.model.ID, "departmentName": $scope.model.DEPARTMENT_NAME,
                            "departmentCode": $scope.model.DEPARTMENT_CODE, "description": $scope.model.DESCRIPTION,
                            "changedUser": currentuser.userName
                        };

                        DepmentService.updateDepment(data).then(function (result) {
                            if (result.responseStatus) {
                                 toastr.success("修改成功！");
                                $uibModalInstance.dismiss('cancel');
                                datatables.fnUpdate();
                            } else {
                                toastr.error("修改失败！" + result.responseMsg);
                            }
                        });
                    }

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }]
            });
        } else {
            toastr.info("请选择要修改的记录！");
        }
    }


    //删除部门信息
    $scope.remove = function () {
       // var rows = $("#ngDepment tr td  :checked")[0];
        let rows = datatables.api().row('.selected').data();
        if (rows) {
            var value = rows.id;
            var data = {"id": value, "changedUser": "testName"};
            DepmentService.deleteDepment(data).then(function (result) {
                if (result.responseCode == "10000") {
                    toastr.success("删除成功！");
                    datatables.fnUpdate();

                } else {
                    toastr.error("删除失败！");
                }
            });
        } else {
            toastr.info("请选择要删除的记录！");
        }
    }

    //添加部门
    $scope.add = function () {
        //获取身份信息
        let modalInstance = $uibModal.open({
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: md_depment,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.model = {DEPARTMENT_NAME: "", DEPARTMENT_CODE: "", DESCRIPTION: ""};
                $scope.save = function () {
                    if (Validate($scope)) {
                        var data = {
                            "departmentName": $scope.model.DEPARTMENT_NAME,
                            "departmentCode": $scope.model.DEPARTMENT_CODE,
                            "description": $scope.model.DESCRIPTION,
                            "isDeleted": 0,
                            "isActived": 0,
                            "createdUser": currentuser.userName,
                            "changedUser": currentuser.userName
                        }
                        console.log(data);
                        DepmentService.addDepment(data).then(function (result) {
                            console.log(result);
                            if (result.responseStatus) {
                                toastr.success("添加部门成功！");
                                $uibModalInstance.dismiss('cancel');
                                datatables.fnUpdate();
                            } else {
                                toastr.error("添加部门失败！" + result.responseMsg);
                            }
                        });
                    }
                }

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

            }]

        });
    }

    function Validate(scope) {
        var bl = true;
        if (!scope.model.DEPARTMENT_NAME) {
            toastr.error("请填写部门名称！");
            bl = false;
        }
        if (!scope.model.DEPARTMENT_CODE) {
            toastr.error("请填写部门CODE！");
            bl = false;
        }
        return bl;
    }


    // Init Datatable
    //$timeout( function(){
    $scope.setTableOptions = {
        ajax: function (data, callback, settings) {
            console.log(data);
            console.log(data.columns[data.order[0].column].data);
            console.log(data.order[0].dir);
            var param = JSON.stringify({
                departmentCode: $scope.Model.Code,
                departmentName: $scope.Model.Name,
                pageIndex: (data.start / data.length) + 1,
                pageSize: "10",
                column: data.columns[data.order[0].column].data,
                sort: data.order[0].dir
            });
            console.log(param);
            $.ajax({
                type: "POST",
                url:   DepmentService.getUrl(),
                cache: false,
                data: param,
                contentType: "application/json;",
                success: function (result) {
                    var returnData = {};
                    returnData.recordsTotal = result.body.rows;//返回数据全部记录
                    returnData.recordsFiltered = result.body.rows;//后台不实现过滤功能，每次查询均视作全部结果
                    console.log(result.body.result);
                    returnData.data = result.body.result;//返回的数据列表
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
            {data: "id"},
            {data: 'departmentName'},
            {data: 'departmentCode'},
            {data: 'isActived'},
            {data: 'description'},
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
                //render: function (data, type, row, meta) {
                //    return "<input  class='datatable-checks' type='checkbox' value='" + data + "' />";
                //},
                "sWidth": "50px",
                "bAutoWidth": false,
                "className": 'select-checkbox',
                "mRender": function () {
                    return null;
                },
            },
            {
                "title": "部门名称",
                targets: 2,
                "sWidth": "300px"
            },
            {
                "title": "部门代码",
                targets: 3,
                "sWidth": "300px"
            },
            {
                "title": "状态",
                targets: 4,
                "sWidth": "10%",
                "mRender": function (data) {
                    if (data == 1) {
                        return "<lable class='label label-danger' value='" + data + "'>已禁用</lable>";
                    } else {
                        return "<lable class='label label-success' value='" + data + "'>已启用</lable>";
                    }
                }
            },
            {
                "title": "说明",
                targets: 5
            },
            {
                "title": "创建时间",
                targets: 6,
                "sWidth": "150px",
                "mRender": function (data) {
                    var result = $filter("date")(data, "yyyy-MM-dd");
                    return result;
                }
            }
        ],
        bScrollCollapse: true,//保持必要的宽度
        bPaginate: true,//是否有分页
        "fnInitComplete": function () {
            datatables = $("#ngDepment").dataTable();
        },
        "order": [[ 1, "desc" ]]
    };
}
angular.module("controller").controller("DepartmentsController", DepartmentsController);