/**
 * Created by LanYang on 2017/10/27.
 */
import md_loadMsg from '../../templates/model-loadMsgDetail.html';
LoanMsgController.$inject = ['$scope', 'LoanMsgService','$timeout','toastr','$rootScope','$uibModal'];

function LoanMsgController($scope,LoanMsgService,$timeout,toastr,$rootScope,$uibModal) {
    $scope.Model= {
        tableList:{},
        userID: ""
    };
    $scope.initPage = function(){

    };
    //��ȡ����б�
    let getLoadMsgList = function (no, size, reInit){
        let postData = {
            "pageIndex": no ? no : 1,
            "pageSize": size ? size : 10,
            "msgType": "LOAN",
            "userId": $scope.Model.userID ? $scope.Model.userID : null,
            "msgReceiver": $scope.Model.userID ? $scope.Model.userID : null,
            "receiverType": "msg_receiver_type_sales"
        };
        LoanMsgService.getLoadMsgList(postData).then(function(data){
            if(data.responseCode!="10000"){
                toastr.warning(data.responseMsg, "Warning");
                return;
            }
            //������
            $scope.Model.tableList=data.body;
            if (reInit) {
                $timeout(function () {
                    $rootScope.$broadcast('modelInitialized', this);
                }, 500);
            }
        });
    };

    //����ҳ���״μ����б�
    let pageIndex = 1, pageSize = 10;
    getLoadMsgList(pageIndex, pageSize, true);

    //���ط�ҳ����
    $scope.$on("dr.loanPagination", function (scope, no, size, state){
        $scope.curPage = no;
        if ($scope.column && $scope.sort) {
            getLoadMsgList(no, size, false, $scope.column, $scope.sort);
        } else {
            getLoadMsgList(no, size, false, null, null);
        }
    });
    //��ѯ
    $scope.query = function(){
        getLoadMsgList(null, null, true);
    };


    //�鿴����
    $scope.skipLoad = function (data) {
        if (data){
            let modalInstance = $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: md_loadMsg,
                controller: ['$scope', '$uibModalInstance', function($scope,$uibModalInstance){
                    $scope.Model = {
                        "id": data.id,
                        "msgReceiver": data.msgReceiver,
                        "custName": data.custName,
                        "contractSysNo": data.contractSysNo,
                        "contractDisplayNo": data.contractDisplayNo,
                        "qcAppCode": data.qcAppCode,
                        "preAppCode": data.preAppCode,
                        "msgTitle": data.msgTitle,
                        "msgContent": data.msgContent,
                        "msgStatus": data.msgStatus,
                        "createTime":data.createTime
                    };
                    /*LoanMsgService.queryLoadMsgById(id).then(function(result){
                        if(result.responseStatus){
                            var data = result.body;
                            $scope.Model = {
                                "id": data.id,
                                "msgReceiver": data.msgReceiver,
                                "custName": data.custName,
                                "contractSysNo": data.contractSysNo,
                                "contractDisplayNo": data.contractDisplayNo,
                                "qcAppCode": data.qcAppCode,
                                "preAppCode": data.preAppCode,
                                "msgTitle": data.msgTitle,
                                "msgContent": data.msgContent,
                                "msgStatus": data.msgStatus,
                                "createTime":data.createTime
                            };
                        }else{
                            toastr.error("��ѯ�����������" + result.responseMsg);
                        }
                    });*/

                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };

                }]
            });
        }
    };
}

angular.module('controller').controller("LoanMsgController", LoanMsgController);
