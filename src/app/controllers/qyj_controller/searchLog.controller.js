/**
 * Created by HaihuaHuang on 2017/6/16.
 */
SearchLogController.$inject = ['$scope', '$location', 'ModifiUserService', 'toastr', '$timeout', '$rootScope'];
function SearchLogController($scope, $location, ModifiUserService, toastr, $timeout, $rootScope) {
    $scope.Model = {
        loginlog: {},
        mobile: ""
    };
    $scope.initPage = function () {

    };
    //列表
    let getSource = function (no, size, reInit, column, sort){
        let postData = {
            "pageNo": no ? no : 1,
            "pageSize": size ? size : 10,
            "colName": $scope.Model.mobile ? "login_mobile" : "",
            "colValue": $scope.Model.mobile ? $scope.Model.mobile : ""
        };
        ModifiUserService.getUserLoginLog(postData).then(function (result) {
            if (result.responseCode == '10000' ) {
                $scope.Model.loginlog = result.body;
                if (reInit) {
                    $timeout(function () {
                        $rootScope.$broadcast('modelInitialized', this);
                    }, 500);
                }
            } else if (result.responseCode != '10000') {
                toastr.error("查询结果出错：" + result.responseMsg);
            }
        })
    };

    let pageSize = 10, pageNo = 1;
    getSource(pageNo, pageSize, true);

    //加载分页数据
    $scope.$on("dr.reloadPagination", function (scope, no, size, state) {
        $scope.curPage = no;
        getSource(no, size, false, null, null);
    });

    //查询
    $scope.queryChannel = function () {
        getSource(null, null, true);
    }

}
angular.module('controller').controller("SearchLogController", SearchLogController);

