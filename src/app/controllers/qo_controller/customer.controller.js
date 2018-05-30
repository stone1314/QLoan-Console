/**
 * Created by V-XiongXiang on 2017/7/26.
 */

import md_user from '../../templates/qo_modal/modal-customerDetail.html';
import md_approve from '../../templates/qo_modal/modal-approveDetail.html';


CustomerController.$inject = ['$scope', 'toastr', '$timeout', '$uibModal', '$filter', 'CustomerService' , '$compile', 'CommonService','encryptionServer']
function CustomerController($scope, toastr, $timeout, $uibModal, $filter, CustomerService , $compile, CommonService,encryptionServer) {

    let currentuser = encryptionServer.getCurrentUserInfo("currentuser_obj");
    $scope.Model = {
        Id: "", Name: "", ID_NO: "", City: "", SaleName: "",
        Product: {
            Logo: "", Name: ""
        },
        Products: {},
        Cities: []
    };
    var datatables;

    $scope.UserInfo = {};
    $scope.viewModel = {show: false};
    $scope.more = function () {
        if ($scope.viewModel.show) {
            $scope.viewModel.show = false;
        } else {
            $scope.viewModel.show = true;
        }
    };
    //重置条件
    $scope.reset = function () {
        $scope.Model = {
            Id: "", Name: "", ID_NO: "", City: "", SaleName: "",
            Product: {
                Logo: "", Name: ""
            },
            Products: {},
            Cities: []
        };
    }


    //根据用户id获取用户详细信息
    $scope.getUser = function (idNo, userid, $event) {
        console.log($event);
        var data = {"id": userid};
        var dataCertify = {"idNo": idNo};

        console.log(data);
        let modalInstance = $uibModal.open({
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: md_user,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.Model = {Tab: "0"};
                //设置Tab显示
                $scope.getTabState = function (tabIndex) {
                    $scope.Model.Tab = tabIndex;
                }

                CustomerService.getCustomer(data).then(function (result) {
                    console.log(result);
                    if (result.responseStatus) {
                        $scope.UserInfo = result.body;
                    }
                });
                console.log(dataCertify);

                getCertify(dataCertify, $scope);


                $scope.cancel = function () {
                    $uibModalInstance.close();
                };
            }]
        });
    }

    //获取认证信息
    let getCertify = function (data, scope) {
        CustomerService.getCertifyById(data).then(function (result) {
            if (result.responseStatus) {
                scope.Certifies = result.body;
            }
        });
    }

    //根据用户id获取认证状态
    $scope.getApprove = function (NoId, $event) {
        if ($event) {
            let modalInstance = $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: md_approve,
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

                    $scope.Model = {Tab: "0"};
                    //设置Tab显示
                    $scope.getTabState = function (tabIndex) {
                        $scope.Model.Tab = tabIndex;
                    }

                    var data = {"idNo": NoId};
                    getCertify(data, $scope);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        }
    }

    //初始化
    $scope.init = function () {
        getCity($scope);
        getProductLogo($scope);
        CommonService.getRelationShip().then(function (result) {
            var arr = [];
            if (result.responseStatus) {
                var data = result.body[0].RESULT;
                $.each(data, function (index, value) {
                    arr.push(value);
                });
            }
            console.log(result);
            //   $cookieStore.put("RELATIONSHIP", arr);
        });
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
    //获取产品LOGO信息
    let getProductLogo = function (scope) {
        CustomerService.getProductLogo().then(function (result) {
            console.log(result);
            if (result.responseStatus) {
                scope.Model.ProductLogo = result.body;
            }
        });
    };
    //根据logocode获取产品
    $scope.getProductByLogo = function () {
        var logo = $scope.Model.Product.Logo;
        var data = {"productLogo": logo};
        console.log(data);
        CustomerService.getProductByLogo(data).then(function (result) {
            console.log(result);
            if (result.responseStatus) {
                $scope.Model.Products = result.body.result;
            }
        });
    }

    //查看信息
    $scope.detail = function () {
        var rows = datatables.api().rows('.selected').data()[0];
        if (rows) {
            console.log(rows);
            var idNo = rows.value;
            var appid =rows.appid;
            $scope.getUser(idNo, appid, null);
        } else {
            toastr.info("请选择要查看的记录！");
        }

    }

    //查询按钮
    $scope.query = function () {
        datatables = $("#ngCustomer").dataTable();
        datatables.fnUpdate();
    }


    // Init Datatable
    $scope.setTableOptions = {
        ajax: function (data, callback, settings) {
            var product = $scope.Model.Product.Name;
            if (!product) {
                product = null;
            }
            var param = JSON.stringify({
                departmentCode: $scope.Model.Code,
                name: $scope.Model.Name,
                idNo: $scope.Model.ID_NO,//客户身份证
                id: $scope.Model.Id,//客户编号
                city: $scope.Model.City,//申请城市
                salesName: $scope.Model.SaleName,//客户经理
                intentionalProduct: product,//产品信息
                pageIndex: (data.start / data.length) + 1,
                pageSize: "10",
                column: data.columns[data.order[0].column].data,
                sort: data.order[0].dir
            });
            console.log(param);
            $.ajax({
                type: "POST",
                url:  CustomerService.getUrl(),
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
            {data: 'id'},
            {data: 'id'},
            {data: 'name'},
            {data: 'idNo'},
            {data: 'age'},
            {data: 'salesName'},
            {data: 'city'},
            {data: 'intentionalProduct'},
            {data: 'createdTime'},
            {data: 'idNo'}
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
                "title": "客户姓名",
                targets: 2
                ,
                "mRender": function (data, type, row, meta) {
                    return '<a   href="javascript:void(0)"  ng-click="getUser(\'' + row.idNo + '\',' + row.appId + ',$event)" >' + data + '</a>';
                },
                "fnCreatedCell": function (nRow) {
                    $compile(nRow)($scope);
                }
            },
            {
                "title": "身份证号",
                targets: 3
            },
            {
                "title": "客户年龄",
                targets: 4
            },
            {
                "title": "客户经理",
                targets: 5
            },
            {
                "title": "城市",
                targets: 6
            },
            {
                "title": "意向产品",
                targets: 7
            },
            {
                "title": "创建时间",
                targets: 8,
                "mRender": function (data) {
                    return $filter("date")(data, "yyyy-MM-dd");

                }
            },
            {
                "title": "认证状态",
                targets: 9,
                /*   "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {

                 $(nTd).html('<a href="javascript:void(0)"  ng-click="getApprove(\'' + iRow.idNo + '\',$event)">查看</a>');
                 $compile(nTd)($scope);
                 }*/
                render: function (data, type, row, meta) {
                    return '<a   href="javascript:void(0)"  ng-click="getApprove(\'' + row.idNo + '\',$event)">查看</a>';
                },
                "fnCreatedCell": function (nRow) {
                    $compile(nRow)($scope);
                }
            }
        ],

        sScrollY: "500px",
        sScrollX: "100%",
        sScrollXInner: "130%",
        bScrollCollapse: true,//保持必要的宽度
        bPaginate: true,//是否有分页
        //column: {rightColumns: 1}, //固定的列数
        "fnInitComplete": function () {
            datatables = $("#ngCustomer").dataTable();
        }
    };
}
angular.module("controller").controller("CustomerController", CustomerController)
