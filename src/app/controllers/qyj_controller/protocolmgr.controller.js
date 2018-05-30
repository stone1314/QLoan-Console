/**
 * Created by LanYang on 2017/10/27.
 */
ProtocolMgrController.$inject = ['$scope', 'ProtocolMgrService','$timeout','toastr','$rootScope','$uibModal'];

function ProtocolMgrController($scope,ProtocolMgrService,$timeout,toastr,$rootScope,$uibModal) {
    $scope.Model={
        name: "",
        tableList: {}
    };
    $scope.initPage = function(){

    };
    //��ȡ����б�
    let getProtocolList = function (no, size, reInit){
        let postData = {
            "pageIndex": no ? no : 1,
            "pageSize": size ? size : 10,
            "msgType": "SYS"
        };
        ProtocolMgrService.getProtocolList(postData).then(function(data){
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
    getProtocolList(pageIndex, pageSize, true);

    //���ط�ҳ����
    $scope.$on("dr.protocolPagination", function (scope, no, size, state){
        $scope.curPage = no;
        if ($scope.column && $scope.sort) {
            getProtocolList(no, size, false, $scope.column, $scope.sort);
        } else {
            getProtocolList(no, size, false, null, null);
        }
    });
    //����
    $scope.query =function(){
        getProtocolList(null, null, true);
    };
    //�鿴����
    $scope.openDetails = function(){

    };
}

angular.module('controller').controller("ProtocolMgrController", ProtocolMgrController);
