/**
 * Created by HaihuaHuang on 2017/6/16.
 */

MessageCenterController.$inject = ['$scope', '$location', '$uibModal', 'MessageService', 'toastr'];
function MessageCenterController($scope, $location, $uibModal, MessageService, toastr) {

    $scope.Model = {msg: {}};

    $scope.sendMessage = function () {
        var message = $scope.Model.msg;
        if (message != "") {
            MessageService.sendMessage(message).then(function (result) {
                // console.log(result);
                if (result.responseCode == '10000') {
                    toastr.success(result.responseMsg, "Success！");
                } else {
                    toastr.error("发送失败！原因：" + result.message);
                }
            });
        }
    };
}
angular.module("controller").controller("MessageCenterController", MessageCenterController)