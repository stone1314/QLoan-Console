/**
 * Created by HaihuaHuang on 2017/6/16.
 */
import md_repayment from '../../templates/modal-repayment-show.html';
SearchCompactController.$inject = ['$scope', '$location', 'CompactService', '$timeout', '$rootScope', 'toastr', '$uibModal']
function SearchCompactController($scope, $location, CompactService, $timeout, $rootScope, toastr, $uibModal) {
    $scope.Model= {
        records:{},
        contractSysNo:""
    };
    $scope.date = {};
    $scope.popup = {
        opened: false
    };
    $scope.open = function () {
        $scope.popup.opened = true;
    };

    $scope.date2 = {};
    $scope.popup2 = {
        opened2: false
    };
    $scope.open2 = function () {
        $scope.popup2.opened2 = true;
    };



    $scope.init = function () {
        getRecords(1, 8, true);
    };

    let getRecords = function (no, size, reInit) {
        var data = {
            "pageNo": no,
            "pageSize": size
        };
        CompactService.getContractList(data).then(function (result) {
           // console.log(result);
            if (result.responseCode == "10000" && result.body != null) {
                $scope.Model.records = result.body;
                if (reInit) {
                    $timeout(function () {
                        $rootScope.$broadcast('modelInitialized', this);
                    }, 500);
                }
            }
        });
    }


    $scope.openRepayment = function (id) {
        // let data = {
        //     "pageIndex": "1",
        //     "pageSize": "30",
        //     "contractDisplayNo": id//'YWPZ022017052704006810'
        // };
        let data = {
            "pageIndex": "1",
            "pageSize": "30",
            "qcAppCode": id//'YWPZ022017052704006810'
        };
        let plans = {};
        CompactService.getRepaymentPlan(data).then(function (result) {
          //  console.log(result);
            if (result.responseCode == "10000" && result.body.list.length > 0) {
                plans = result.body.list;  //repayStatusId;   还款状态(0.未还1.已还2.欠款3.当期只还一部分)无配置表
                let modalInstance = $uibModal.open({
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    animation: true,
                    template: md_repayment,
                    controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                        $scope.viewModel = {records: {}};
                        $scope.viewModel.records = plans;
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    }]
                });
             } else if (result.body.list.length == 0) {
                toastr.info("无还款计划！", '提示：');
                return false;
            }
        });

    };
    /**
     * 加载分页数据
     */
    $scope.$on("dr.userPagination", function (scope, no, size) {
        getRecords(no, size);
    });


    let pageSize = 10, pageNo = 1;
    /*查询数据*/
    $scope.query = function(){
        let sysNo = $scope.Model.contractSysNo;
        getUserInfoListbyName(pageNo,pageSize,sysNo)
    };
    //根据系统合同编号模糊查询
    let getUserInfoListbyName = function(no,size,sysNo){
        let data ={
            pageNo:no,
            pageSize:size,
            name:sysNo
        };
        CompactService.getContractList(data).then(function (result) {
            if (result.responseCode == "10000" && result.body != null) {
                $scope.Model.records = result.body;
                // if (reInit) {
                //     $timeout(function () {
                //         $rootScope.$broadcast('modelInitialized', this);
                //     }, 500);
                // }
            }
        });
    }




}

//过滤还款计划中的   还款状态
let repayStatusFilter = function () {
    let ret = function (repayStatus) {
        if (repayStatus == 0) {
            return "未还";
        }
        if (repayStatus == 1) {
            return "已还";
        }
        if (repayStatus == 2) {
            return "欠款";
        }
        if (repayStatus == 3) {
            return "当期只还一部分";
        }
    }
    return ret;
};


angular.module("controller").controller("SearchCompactController", SearchCompactController)
    .filter('repayStatusFilter', repayStatusFilter);