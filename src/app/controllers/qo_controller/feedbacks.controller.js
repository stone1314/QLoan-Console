/**
 * Created by HaihuaHuang on 2017/7/24.
 */

import  md_feedback from '../../templates/qo_modal/model-feedBackDetail.html';

FeedBackController.$inject = ['$scope', '$location', 'toastr', 'FeedBackService', '$filter', 'CommonService','$uibModal','encryptionServer']
function FeedBackController($scope, $location, toastr, FeedBackService, $filter, CommonService,$uibModal,encryptionServer) {
    var datatables;
    let currentuser = encryptionServer.getCurrentUserInfo("currentuser_obj");
    $scope.Model = {name: "", city: "", Cities: '', department: "", departmentes: "", content: ""};
    $scope.viewModel = {show: false};
    $scope.more = function () {
        if ($scope.viewModel.show) {
            $scope.viewModel.show = false;
        } else {
            $scope.viewModel.show = true;
        }
    };

    //重置
    $scope.reset = function () {
        $scope.Model = {name: "", city: "", Cities: '', department: "", departmentes: "", content: ""};
    }

    //初始化
    $scope.init = function () {
        getCity($scope);
        getDepment($scope);
    }


    //获取城市信息
    let getCity = function (scope) {
        var data = {prefix: "Qone", dataVersion: "2"};
        CommonService.getCityList(data).then(function (result) {
            if (result.responseStatus) {
                scope.Model.Cities = result.body;
            }
        });
    };
    let getDepment = function (scope) {
        var data = {pageIndex: "1", pageSize: "100"};
        CommonService.getDepment(data).then(function (result) {
            console.log(result);
            if (result.responseCode == "10000") {
                scope.Model.departmentes = result.body.result;
            }
        });
    }


    //意见反馈详情
    $scope.skip = function () {
        //var rows = $("#feedback tr td  :checked")[0];
        let rows = datatables.api().row('.selected').data();
        if (rows) {
            var id = rows.id;
            //console.log(id);
            let modalInstance = $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: md_feedback,
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    FeedBackService.getFeedback(id).then(function (result) {
                        console.log(result);
                        if (result.responseStatus) {
                            var data = result.body;
                            //console.log(data);
                            $scope.Model = {
                                "id": data.id,
                                "content": data.content,
                                "submiterId": data.submiterId,
                                "createdTime": data.createdTime,
                                "name": data.name,
                                "departmentName": data.departmentName,
                                "city": data.city
                            };
                        } else {
                            toastr.error("查询反馈详情出错！" + result.responseMsg);
                        }
                    });
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        } else {
            toastr.info("请选择要查看的记录！");
        }
    };

    //查询
    $scope.query = function () {
        datatables.fnUpdate();
    }

    // Init Datatable
    $scope.setTableOptions = {
        ajax: function (data, callback, settings) {
            var param = JSON.stringify({
                name: $scope.Model.name,
                content: $scope.Model.content,
                city: $scope.Model.city,
                depart: $scope.Model.department,
                pageNo: (data.start / data.length) + 1,
                pageSize: "10",
                column: data.columns[data.order[0].column].data,
                sort: data.order[0].dir
            });
            console.log(param);
            $.ajax({
                type: "POST",
                url: FeedBackService.getUrl(),
                cache: false,
                data: param,
                contentType: "application/json;",
                success: function (result) {
                    var returnData = {};
                    // returnData.draw = result.body.rows;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.body.rows;//返回数据全部记录
                    returnData.recordsFiltered = result.body.rows;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.body.result;//返回的数据列表
                    console.log(returnData);
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
            {data: "id"},
            {data: 'id'},
            {data: 'name'},
            {data: 'departmentName'},
            {data: 'city'},
            {data: 'content'},
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
                "title": "全选",
                targets: 1,
                "bSortable": false,
                "sWidth": "70px",
                "bAutoWidth": false,
                "className": 'select-checkbox',
                "mRender": function () {
                    return null;
                },
            },
            {
                "title": "意见编号",
                targets: 2,
                "bSortable": false
            },
            {
                "title": "客户经理",
                targets: 3,
                "bSortable": false
            },
            {
                "title": "部门",
                targets: 4,
                "bSortable": false
            },
            {
                "title": "城市",
                targets: 5,
                "bSortable": false
            },
            {
                "title": "意见反馈",
                targets: 6,
                "sWidth": "300px"
            },
            {
                "title": "创建时间",
                targets: 7,
                render: function (data, type, row, meta) {
                    return $filter("date")(data, "yyyy-MM-dd");
                }
            }
        ],

        bScrollCollapse: true,//保持必要的宽度
        bPaginate: true,//是否有分页
        "fnInitComplete": function () {
            datatables = $("#feedback").dataTable();
        }
    };


}
angular.module("controller").controller("FeedBackController", FeedBackController);