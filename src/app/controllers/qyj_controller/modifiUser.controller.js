/**
 * Created by LanYang on 2017/10/27.
 */
ModifiUserController.$inject = ['$scope', '$location', 'ModifiUserService', 'toastr', '$timeout', '$rootScope'];
function ModifiUserController($scope, $location, ModifiUserService, toastr, $timeout, $rootScope) {
    $scope.Model= {
        records:{},
        userName:""
    };
    $scope.initPage = function () {

    };

    //列表
    let getRecords = function (no, size, reInit) {
        let postData ={
            "pageNo": no ? no : 1,
            "pageSize": size ? size : 10,
            "name": $scope.Model.userName ? $scope.Model.userName : ""
        };
        ModifiUserService.getUserInfoList(postData).then(function (result) {
            if (result.responseCode == "10000" && result.body != null) {
                $scope.Model.records = angular.copy(result.body);
                if (reInit) {
                    $timeout(function () {
                        $rootScope.$broadcast('modelInitialized', this);
                    }, 500);
                }
            }
        });
    };

    let pageNo = 1, pageSize = 10;
    getRecords(pageNo, pageSize, true);

    //分页
    $scope.$on("dr.reloadPagination", function (scope, no, size, state) {
        $scope.curPage = no;
        getRecords(no, size, false, null, null);
    });

    //查询
    $scope.query = function(){
        getRecords(null, null, true);
    };

    //解锁
    $scope.debLock = function (userid) {
        ModifiUserService.unlockAccount(userid).then(function (result) {
            if (result.responseCode == '10000') {
                toastr.success("解锁成功！", "结果：");
                $scope.initPage();
            } else {
                toastr.error("解锁失败！原因：" + result.responseMsg, "结果：");
            }
        })
    };


}
angular.module("controller").controller("ModifiUserController", ModifiUserController);