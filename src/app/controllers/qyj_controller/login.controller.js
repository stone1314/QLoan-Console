/**
 * Created by LanYang on 2017/12/8.
 */

LoginController.$inject = ['$scope', '$location', 'UserInfoService', 'toastr', 'permissions', '$cookieStore','encryptionServer'];

function LoginController($scope, $location, UserInfoService, toastr, permissions, $cookieStore,encryptionServer) {
    $scope.viewModel = {
        account: "",
        password: ""
    };
    $scope.isLogin = false;
    $scope.login = function () {
        let postData = {
            "userName": $scope.viewModel.account,
            "password": $scope.viewModel.password
        };
        $scope.isLogin = true;
        UserInfoService.loginUser(postData).then(function (result) {
            $scope.isLogin = false;
            if (result.responseCode == '10000') {
                //$cookieStore.put("currentuser_obj", data);

                let userObj = angular.copy(result.body);
                encryptionServer.saveCurrentUserInfo("currentuser_obj",userObj);

                $location.path("main/portal");
            } else {
                toastr.error(result.responseMsg);
            }
        });
    };
}

angular.module('controller').controller("LoginController", LoginController);
