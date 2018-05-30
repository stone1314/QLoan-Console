/**
 * Created by HaihuaHuang on 2017/7/21.
 */
import md_product from '../../templates/qo_modal/modal-proDetail.html';


ProManageController.$inject = ['$scope', '$location', 'toastr', 'PromanageService', 'CommonService', '$uibModal', '$filter', 'encryptionServer'];
function ProManageController($scope, $location, toastr, PromanageService, CommonService, $uibModal, $filter, encryptionServer) {
    $scope.viewModel = {Name: null, Terms: "", dropDown: {}, city: {}, department: {}, mycity: {}};

    var datatables;
    let currentuser = encryptionServer.getCurrentUserInfo("currentuser_obj");
    $scope.dropdownmodel = [];
    $scope.dropdowndata = [];
    $scope.dropdownsettings = {scrollableHeight: '400px', scrollable: true};
    $scope.dropdowncustomTexts = {buttonDefaultText: '请选择适用部门'};

    $scope.more = function () {
        if ($scope.viewModel.show) {
            $scope.viewModel.show = false;
        } else {
            $scope.viewModel.show = true;
        }
    };

    //设置关联部门
    $scope.skip = function () {
        $scope.view(1, "设置关联部门");
    };

    //重置内容框
    $scope.reset = function () {
        $scope.viewModel = {Name: null, Terms: "", dropDown: {}, city: {}, department: {}, mycity: {}};
        $scope.dropdownmodel = [];

    };

    //查看单条记录详情
    $scope.view = function (state, title) {
        // var rows = $("#ngProduct tr td  :checked")[0];
        var dts = $("#ngProduct").DataTable();
        var rows = dts.rows('.selected').data()[0];

        if (rows) {
            var productId = rows.id;

            let modalInstance = $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: md_product,
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.dropdowndata = [];
                    getDepment($scope);

                    $scope.init = function () {
                        var data = {id: productId, pageIndex: "1", pageSize: "10"};
                        PromanageService.getPromanage(data).then(function (result) {
                            if (result.responseCode == "10000") {
                                var row = result.body.result[0];
                                if (row) {
                                    $scope.model = {
                                        code: row.productCode,
                                        title: title,
                                        state: state,
                                        productName: row.productName,
                                        productCode: row.productCode,
                                        appCityName: row.appCityName,
                                        departments: row.cobraProductDepartmentMap,
                                        yearRate: row.yearRate,
                                        consultationChargeRatio: row.consultationChargeRatio,
                                        serviceChargeRatio: row.serviceChargeRatio,
                                        reservesRatio: row.reservesRatio,
                                        defaultInterestRatio: row.defaultInterestRatio,
                                        lateFeeRatio: row.lateFeeRatio,
                                        prepaymentRatio: row.prepaymentRatio,
                                        isActived: row.isActived
                                    };
                                    $scope.dropdowndata = getDropdown($scope.dropdowndata, $scope.model.departments);
                                }
                            } else {
                                toastr.error("记录查询失败！");
                            }
                        });
                    };

                    let getDropdown = function (data1, data2) {
                        $scope.dropdwonState = [];
                        $.each($scope.dropdowndata, function (index, value) {
                            var obj = {id: "", state: "", name: ""};
                            var b = false;
                            $.each($scope.model.departments, function (rindex, rvalue) {
                                if (value.id == rvalue.cobraDepartmentCode) {
                                    b = true;
                                    return;
                                }
                            });
                            obj = {id: value.id, state: b, name: value.label};
                            $scope.dropdwonState.push(obj);
                            b = false;
                        });
                    };


                    $scope.save = function (productCode) {

                        var obj = [];
                        $.each($scope.dropdwonState, function (index, value) {
                            if (value.state) {
                                obj.push(value.id);
                            }
                        });

                        var data = {"productCode": $scope.model.code, "departmentCodes": obj};

                        PromanageService.updateProDepMap(data).then(function (result) {
                            console.log(result);
                            if (result.responseStatus) {
                                // toastr.success("修改成功！");
                                $uibModalInstance.dismiss('cancel');
                                //location.reload();
                            } else {
                                toastr.error("修改失败！");
                            }
                        });
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }]
            });
        } else {
            toastr.info("请选择记录！");
        }
    };


    //页面初始化加载
    $scope.init = function () {
        getCity($scope);
        getDepment($scope);
    };
    //获取城市信息
    let getCity = function (scope) {
        var data = {prefix: "Qone", dataVersion: "2"};
        CommonService.getCityList(data).then(function (result) {
            if (result.responseStatus) {
                scope.viewModel.dropDown.cities = result.body;
            }
        });
    };
    let getDepment = function ($scope) {
        var data = {pageIndex: "1", pageSize: "100"};
        CommonService.getDepment(data).then(function (result) {
            if (result.responseCode == "10000") {
                //  var list = [];
                $.each(result.body.result, function (index, value) {
                    if (value.isDeleted == "0" && value.isActived == "0") {
                        var obj = {id: value.departmentCode, label: value.departmentName};
                        $scope.dropdowndata.push(obj);
                    }
                });
            }
        });
    };


    //同步产品信息
    $scope.synchronization = function () {
        var data = {};
        PromanageService.synPro(data).then(function (result) {
            console.log(result);
            if (result.responseStatus) {
                toastr.success("同步成功！");
            }
        });
    };

    //启用/禁用状态修改
    $scope.active = function () {
        var data = {};
        PromanageService.updatePromanageState(data).then(function (result) {
            if (result.responseStatus) {
                toastr.success("记录状态修改成功！");
                location.reload();
            }
        });
    };

    //查询获取条件
    $scope.query = function () {
        datatables.fnUpdate();
    };


    // Init Datatable
    $scope.setTableOptions = {
        ajax: function (data, callback, settings) {
            console.log(data);
            console.log(data.columns[data.order[0].column].data);
            console.log(data.order[0].dir);
            var deps = [];
            var terms = $scope.viewModel.Terms;
            var city = "";
            console.log(terms);
            //期数
            if (isNaN(terms) || terms == "") {
                terms = null;
            }
            //多选下拉
            $.each($scope.dropdownmodel, function (index, value) {
                deps.push(value.id);
            });
            //地区判断
            if ($scope.viewModel.dropDown.city) {
                city = $scope.viewModel.dropDown.city;
            }
            console.log(data.length);
            var param = JSON.stringify({
                productTerms: terms,
                productName: $scope.viewModel.Name,
                appCityName: city,
                departmentCodes: deps,
                pageIndex: (data.start / data.length) + 1,
                pageSize: "10",
                column: data.columns[data.order[0].column].data,
                sort: data.order[0].dir,

            });
            console.log(param);
            $.ajax({
                type: "POST",
                url: PromanageService.getUrl(),
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
                    if (returnData.data != undefined) {
                        callback(returnData);
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
            {data: 'id'},
            {data: 'id'},
            {data: 'productName'},
            {data: 'cobraProductDepartmentMap'},
            {data: 'productTerms'},
            {data: 'yearRate'},
            {data: 'consultationChargeRatio'},
            {data: 'serviceChargeRatio'},
            {data: 'reservesRatio'},
            {data: 'defaultInterestRatio'},
            {data: 'lateFeeRatio'},
            {data: 'prepaymentRatio'},
            {data: 'isActived'}
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
                className: 'select-checkbox',
                "sWidth": "70px",
                "bAutoWidth": false,
                "mRender": function () {
                    return null;
                },
            },
            {
                "title": "产品名称",
                targets: 2,
            },
            {
                "title": "适用部门",
                targets: 3,
                render: function (data) {
                    var cows = "";
                    $.each(data, function (index, value) {
                        cows += value.departmentName + ",";
                    });
                    return cows;
                },
            },
            {
                "title": "产品期数",
                targets: 4
            },
            {
                "title": "年利率",
                targets: 5,
                "mRender": function (val) {
                    return $filter("ProductRate")(val);  //(val * 100).toFixed(2) + '%';
                },

            },
            {
                "title": "借款咨询费率",
                targets: 6,
                "mRender": function (val) {
                    return $filter("ProductRate")(val);
                },
            },
            {
                "title": "借款服务费率",
                targets: 7,
                "sWidth": "100px",
                "mRender": function (val) {
                    return $filter("ProductRate")(val);
                },
            },
            {
                "title": "逾期风险补偿金费率",
                targets: 8,
                "mRender": function (val) {
                    return $filter("ProductRate")(val);
                },
            },
            {
                "title": "罚息费率",
                targets: 9,
                "mRender": function (val) {
                    return $filter("ProductRate")(val);
                },
            },
            {
                "title": "违约金费率",
                targets: 10,
                "mRender": function (val) {
                    return $filter("ProductRate")(val);
                },
            },
            {
                "title": "提前还款手续费率",
                targets: 11,
                "mRender": function (val) {
                    return $filter("ProductRate")(val);
                },
            },
            {
                "title": "状态",
                targets: 12,
                "mRender": function (data) {
                    if (data == 0) {
                        return "<lable class='label label-danger' value='" + data + "'>已禁用</lable>";
                    } else {
                        return "<lable class='label label-success' value='" + data + "'>已启用</lable>";
                    }
                }
            }
        ],
        /*  sScrollY: "300px",
         sScrollX: "100%",
         sScrollXInner: "130%",*/
        bScrollCollapse: true,//保持必要的宽度
        bPaginate: true,//是否有分页
        "fnInitComplete": function () {
            datatables = $("#ngProduct").dataTable();
            console.log(datatables);
        }
        // column: {rightColumns: 1}, //固定的列数

    };


    /*     var table = $('#ngProduct').DataTable();
     table.on( 'select', function ( e, dt, type, indexes ) {
     console.log(e);
     if ( type === 'row' ) {
     var data = table.rows( indexes ).data().pluck( 'id' );

     // do something with the ID of the selected items
     }
     } );*/


}
angular.module("controller").controller("ProManageController", ProManageController);