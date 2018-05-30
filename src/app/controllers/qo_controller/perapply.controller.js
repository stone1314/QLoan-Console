/**
 * Created by HaihuaHuang on 2017/7/20.
 */
import preApplyModal from '../../templates/qo_modal/modal-preApplyDetail.html';
import  proChangeHistory from '../../templates/qo_modal/modal-proChangeHistory.html';
import CertifyModal from '../../templates/qo_modal/modal-certifyInfo.html';

PreApplyController.$inject = ['$scope', '$location', 'toastr', '$filter', 'CommonService', 'PreApplyService', '$uibModal', '$compile', 'encryptionServer']
function PreApplyController($scope, $location, toastr, $filter, CommonService, PreApplyService, $uibModal, $compile, encryptionServer) {
    let datatables;
    let currentuser = encryptionServer.getCurrentUserInfo("currentuser_obj");
    $scope.viewModel =
        {
            show: false,
            preCode: null,
            customerName: null,
            city: null,
            preStatus: null,
            applyDate: null,
            customerIdCard: null,
            salesName: null,
            productType: null,
            productName: null,
        };

    $scope.model = {
        citylist: {},
        statusList: {},
        productTypeList: {},
        productList: {},
        isShowMore: "",
    }

    $scope.reset = function () {
        $scope.viewModel = {};
    }

    $scope.popup = {opened: false};
    $scope.open = function () {
        if ($scope.popup.opened) {
            $scope.popup.opened = false;
        } else {
            $scope.popup.opened = true;
        }
    };


    $scope.initPage = function () {
        getCity($scope);
        getPreStatus($scope);
        getAllPreLogo($scope);
    }

    /*查询*/
    $scope.query = function () {
        datatables = $("#ngAdverts").dataTable();
        datatables.fnUpdate();
    }

    // Init Datatable
    $scope.setTableOptions = {
        ajax: function (data, callback, settings) {
            var arrayObj = new Array();
            let preStatus = $scope.viewModel.preStatus;
            if (preStatus != null) {
                arrayObj.push(preStatus);
                preStatus = arrayObj;
            }
            var param = JSON.stringify({
                preAppCode: $scope.viewModel.preCode,
                customerName: $scope.viewModel.customerName,
                cityName: $scope.viewModel.city,
                preAppStatusList: preStatus,
                createdTime: $scope.viewModel.applyDate,
                customerIdNo: $scope.viewModel.customerIdCard,
                salesName: $scope.viewModel.salesName,
                productName: $scope.viewModel.productType,
                productCode: $scope.viewModel.productName,
                pageIndex: (data.start / data.length) + 1,
                pageSize: "10",
                column: data.columns[data.order[0].column].data,
                sort: data.order[0].dir,
            });
            console.log(param);
            $.ajax({
                type: "POST",
                url: PreApplyService.getUrl(),
                cache: false,
                data: param,
                contentType: "application/json;",
                success: function (result) {
                    console.log('getAllPreAppInfo',result);
                    var resultData = {};
                    if (result.body && result.body.rows) {
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
            {data: 'preAppCode'},
            {data: 'createdTime'},
            {data: 'cityName'},
            {data: 'productName'},
            {data: 'applyAmt'},
            {data: 'customerName'},
            {data: 'customerIdNo'},
            {data: 'salesName'},
            {data: 'preAppStatusName'},
            {data: 'appCode'},
            {data: 'appStatusName'},
            {data: "id"}
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
                "sWidth": "80px",
                "bAutoWidth": false,
                "mRender": function () {
                    return null;
                },
            },
            {
                "title": "预申请号",
                targets: 2,
                "mRender": function (data) {
                    return "<lable value='" + data + "'>" + data + "</lable>";
                }
            },
            {
                "title": "预申请时间",
                targets: 3,
                "mRender": function (data) {
                    var result = $filter("date")(data, "yyyy-MM-dd");
                    return result;
                }
            },
            {
                "title": "申请城市",
                targets: 4
            },
            {
                "title": "产品名称",
                targets: 5,
                "sWidth": "160px"
            },
            {
                "title": "申请金额",
                targets: 6
            },
            {
                "title": "客户姓名",
                targets: 7
            },
            {
                "title": "客户证件号码",
                targets: 8
            },
            {
                "title": "客户经理",
                targets: 9,
                "sWidth": "100px"
            },
            {
                "title": "预审结果",
                targets: 10
            },
            {
                "title": "申请号",
                targets: 11
            },
            {
                "title": "申请状态",
                targets: 12
            },
            {
                "title": "认证状态",
                targets: 13,
                render: function (data, type, row, meta) {
                    return '<a id="' + data + '" href="javascript:void(0)" ng-click="viewCreditfy(' + row.preAppCode + ')" >查看</a>';
                },
                "fnCreatedCell": function (nRow) {
                    $compile(nRow)($scope);
                }

            }

        ],
        /*    sScrollY: "400px",*/
        sScrollX: "100%",
        sScrollXInner: "150%",
        bScrollCollapse: true,//保持必要的宽度
        bPaginate: true,//是否有分页
        "bProcessing"  : true,
         bJQueryUI  : true,
      //  column: {rightColumns: 1}, //固定的列数
      /*  fixedColumns: {
            rightColumns: 1,
        },*/
        "bSort": true, //排序功能
        "fnInitComplete": function () {
            datatables = $("#ngAdverts").dataTable();
        },
        "order": [[1, "desc"]]

    };


    //获取城市信息
    let getCity = function (scope) {
        var data = {prefix: "Qone", dataVersion: "2"};
        CommonService.getCityList(data).then(function (result) {
            if (result.responseStatus) {
                scope.model.citylist = result.body;
            }
        });
    }

    //获取所有申请结果
    let getPreStatus = function (scope) {
        let data = {
            code: "PRE_ENTER_STATUS",
            dataVersion: "2"
        }
        PreApplyService.getAllPreStatus(data).then(function (data) {
            console.log('获取所有申请结果',data);
            if (data.responseStatus) {
                console.log('结果集',data.body.result);
                scope.model.statusList = data.body[0].RESULT;
            }
        });

    }

    //获取所有产品类型
    let getAllPreLogo = function (scope) {
        let data = {};
        PreApplyService.getAllProduct(data).then(function (data) {
            if (data.responseStatus) {
                scope.model.productTypeList = data.body;
            }
        });
    }
    $("#selProduct").change(function () {
        let productLogo = $(this).val();
        let data = {
            "productLogo": productLogo
        }
        console.log(data);
        PreApplyService.getProductByLogo(data).then(function (data) {
            console.log(data);
            if (data.responseStatus) {
                $scope.model.productList = data.body.result;
            }
        });

    });
    //是否加载更多筛选条件
    $scope.loadMore = function () {
        if ($scope.model.isShowMore) {
            $scope.model.isShowMore = false;
        }
        else {
            $scope.model.isShowMore = true;
        }
    }
    $scope.skip = function () {
        //let lable = $("#ngAdverts tr td  :checked").parents('tr').find("lable")[0];
        let rows = datatables.api().row('.selected').data();
        if (rows) {
            let code = rows.preAppCode;
            let data = {
                preAppCode: code,
                certifyType: "Merchant"
            }
            PreApplyService.skipCertify(data)
                .then(function (data) {
                    if (data.responseCode != "10000") {
                        toastr.warning(data.responseMsg, "Warning");
                        return;
                    }
                    toastr.success("跳过运营商认证成功！", "");
                });
        }
        else {
            toastr.error("请选择一条数据！");
        }
    }

    //查看认证状态
    $scope.viewCreditfy = function (code) {
        console.log(code);
        if (code) {
            let modalInstance = $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: CertifyModal,
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

                    $scope.Model = {Tab: "0"};
                    //设置Tab显示
                    $scope.getTabState = function (tabIndex) {
                        $scope.Model.Tab = tabIndex;
                    }

                    let data = {
                        preAppCode: code,
                    };

                    getCertify(data, $scope);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };

                }]
            });
        }
    }
    //获取认证信息
    let getCertify = function (data, scope) {
        PreApplyService.getCertifyWithPreAppCode(data).then(function (result) {
            if (result.responseStatus) {
                console.log(result.body);
                scope.Certifies = result.body;
            }
        });
    }

    //查看
    $scope.view = function () {
        let rows = datatables.api().row('.selected').data();
        console.log('rows',rows);
        if (rows) {
            // let code = $(lable).attr('value');
            let code = rows.preAppCode;
            let modalInstance = $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: preApplyModal,
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.close = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.title = "查看";

                    $scope.productChangeHistory = function () {
                        console.log($scope.model.APP_CODE);
                        let appCode = $scope.model.APP_CODE;
                        $uibModal.open({
                            size: 'lg',
                            backdrop: 'static',
                            keyboard: false,
                            animation: true,
                            template: proChangeHistory,
                            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                                console.log(1, appCode);
                                $scope.init = function () {
                                    var data = {appCode: appCode, pageIndex: 1, pageSize: 100};
                                    PreApplyService.getProductChangeHistory(data).then(function (obj) {
                                        console.log(2, obj);
                                        if (obj.responseStatus) {
                                            if (obj.body.result.length > 0) {
                                                $scope.model = {productHistorys: obj.body.result};
                                            }

                                        }
                                    });
                                }
                                $scope.cancel = function () {
                                    $uibModalInstance.dismiss('cancel');
                                };
                            }]
                        });
                    }

                    $scope.init = function () {
                        let data = {
                            preAppCode: code
                        }
                        PreApplyService.getAppInfoByPreApplyCode(data).then(function (result) {
                            console.log(result);
                            if (result.responseStatus) {
                                $scope.model = {
                                    PRE_APP_CODE: result.body.preAppCode,
                                    PRE_APP_STATUS_NAME: result.body.preAppStatusName,//preAppStatus
                                    APP_CODE: result.body.appCode,
                                    APP_STATUS_NAME: result.body.appStatusName,//appStatus
                                    CREATED_TIME: result.body.createdTime,
                                    PRODUCT_NAME: result.body.productName,
                                    PRE_APP_LOANS: result.body.preAppLoans,
                                    PRE_APP_CUSTOMER: result.body.preAppCustomers,
                                    PRE_APP_JOB: result.body.preAppJobs,
                                    PRE_APP_HOUSE: result.body.preAppHouses,
                                    PRE_APP_BANKCARDS: result.body.preAppBankCards,
                                    PRODUCT_CHANGED_STATE: result.body.productChangedState,
                                    PRODUCT_CODE: result.body.productCode,
                                    productName: result.body.productName,
                                    changeProductFlag: result.body.changeProductFlag,
                                    CITY_NAME:rows.cityName

                                }
                                let contacts = result.body.preAppContacts;
                                for (var i = 0; i < contacts.length; i++) {
                                    switch (contacts[i]["contactProperty"]) {
                                        case "CONTACT_RELATIVE1":
                                            $scope.CONTACT1 = {
                                                name: contacts[i]["name"],
                                                relationship: contacts[i]["relationship"],
                                                mobile: contacts[i]["mobile"],
                                                relationshipMemo: contacts[i]["relationshipMemo"],
                                            }
                                            break;
                                        case "CONTACT_RELATIVE2":
                                            $scope.CONTACT2 = {
                                                name: contacts[i]["name"],
                                                relationship: contacts[i]["relationship"],
                                                mobile: contacts[i]["mobile"],
                                                relationshipMemo: contacts[i]["relationshipMemo"],
                                            }
                                            break;
                                        case "CONTACT_JOB_CERT":
                                            $scope.CONTACT_JOB = {
                                                name: contacts[i]["name"],
                                                relationship: contacts[i]["relationship"],
                                                mobile: contacts[i]["mobile"],
                                                comDept: contacts[i]["comDept"],
                                                comPosition: contacts[i]["comPosition"],
                                            }
                                            break;
                                    }
                                }
                            }
                        });
                    };
                }]
            });
        }
        else {
            toastr.error("请选择一条数据！");
        }
    };
}
angular.module("controller").controller("PreApplyController", PreApplyController);