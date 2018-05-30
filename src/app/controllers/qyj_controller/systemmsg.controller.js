/**
 * Created by LanYang on 2017/10/27.
 */
import md_SysMsg from '../../templates/model-sysMsgDetail.html';
import md_msgAdd from '../../templates/modal-sysmsg-add.html';
import md_msgEdit from '../../templates/modal-sysmsg-edit.html';

SystemMessageController.$inject = ['$scope', 'SystemMsgService','$timeout','toastr','$rootScope','$uibModal','$filter'];

function SystemMessageController($scope,SystemMsgService,$timeout,toastr,$rootScope,$uibModal,$filter) {
    let dateFilter = $filter('date');
    $scope.Model= {
        tableList:{},
        userID: ""
    };

    $scope.initPage = function(){

    };

    //获取表格列表
    let getSysMsgList = function (no, size, reInit){
        let postData = {
            "pageIndex": no ? no : 1,
            "pageSize": size ? size : 10,
            "msgType": "SYS",
            "userId": $scope.Model.userID ? $scope.Model.userID : null,
            "msgReceiver": $scope.Model.userID ? $scope.Model.userID : null
        };
        SystemMsgService.getSysMsgList(postData).then(function(data){
            if(data.responseCode!="10000"){
                toastr.warning(data.responseMsg, "Warning");
                return;
            }
            //绑定数据
            $scope.Model.tableList=data.body;
            if (reInit) {
                $timeout(function () {
                    $rootScope.$broadcast('modelInitialized', this);
                }, 500);
            }
        });
    };

    //进入页面首次加载列表
    let pageIndex = 1, pageSize = 10;
    getSysMsgList(pageIndex, pageSize, true);

    //加载分页数据
    $scope.$on("dr.sysmsgPagination", function (scope, no, size, state){
        $scope.curPage = no;
        getSysMsgList(no, size, null);
    });

    //查看详情
    $scope.skipSys = function (id) {
        if (id){
            let modalInstance = $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: md_SysMsg,
                controller: ['$scope', '$uibModalInstance', function($scope,$uibModalInstance){
                    SystemMsgService.querySysMsgById(id).then(function(result){
                        if(result.responseStatus){
                            var data = angular.copy(result.body);
                            $scope.Model = {
                                id: data.id,
                                msgTitle: data.msgTitle,
                                receiverType: data.receiverType,
                                msgStatus: data.msgStatus,
                                createTime: data.createTime,
                                updateTime: data.updateTime,
                                msgContent: data.msgContent
                            };
                        }else{
                            toastr.error("查询反馈详情出错！" + result.responseMsg);
                        }
                    });
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
            modalInstance.opened.then(function () {
                // update attr checked of adData
            });
            modalInstance.result.then(function (result) {
                // console.log(result);
            }, function (reason) {
                // console.log(reason);
            });
        }
    };

    let getStatus = function (scope) {
        scope.isActives = [{name:"启用",code:"1"},{name:"禁用",code:"0"}];
    };

    //新增
    $scope.addModal = function () {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: md_msgAdd,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                getStatus($scope);
                $scope.formData = {
                    msgTitle: "",
                    msgContent: "",
                    receiverType: "USER",
                    msgStatus: "",
                    createTime: dateFilter(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    fontCount: 0
                };
                 watchViewModel($scope);
                //新增
                $scope.ok = function () {
                    let postData={
                        "contractDisplayNo": null,
                        "contractSysNo": null,
                        "createTime": new Date().getTime(),
                        "createUser": null,
                        "custName": null,
                        "msgContent": $scope.formData.msgContent,
                        "msgReceiver": null,
                        "msgSender": null,
                        "msgStatus": "0",
                        "msgTitle": $scope.formData.msgTitle,
                        "msgType": "SYS",
                        "preAppCode": null,
                        "qcAppCode": null,
                        "receiverType": "USER",
                        "updateTime":null,
                        "updateUser": "管控平台"
                    };
                    if(saveVerify($scope)){
                        SystemMsgService.addPushMsg(postData).then(function (data) {
                            if(data.responseCode == "10000"){
                                $uibModalInstance.dismiss('cancel');
                                getSysMsgList(1, 10, true);
                                toastr.success("保存成功！");
                            }else{

                            }
                        });
                    }
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
        modalInstance.opened.then(function () {
            // update attr checked of adData
        });
        modalInstance.result.then(function (result) {
            // console.log(result); //result关闭是回传的值
        }, function (reason) {
            // console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel
        });
    };

    //监听文字
    let watchViewModel = function($scope){
        $scope.$watch('formData.msgContent', function(newValue, oldValue) {
            $scope.formData.fontCount = newValue.length;
            if (newValue.length >100) {
                $scope.formData.msgContent = newValue.substr(0,100);
                toastr.error("消息内容不能超过100个字符.");
            }else{
                $scope.formData.msgContent = newValue;
            }
        },true);
    };

    //编辑
    $scope.editModal = function (id) {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: md_msgEdit,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                getStatus($scope);
                if(id!=undefined||id!=null){
                    SystemMsgService.querySysMsgById(id).then(function(data){
                        if(data.responseStatus==true && data.responseCode=="10000"){
                            $scope.formData = data.body;
                        }
                    });
                }else{
                    toastr.warning("获取信息异常!");
                    return;
                }
                watchViewModel($scope);
                $scope.ok = function () {
                    if ($scope.formData && saveVerify($scope)) {
                        var data = angular.copy($scope.formData);
                        data.createTime = (new Date(data.createTime)).getTime();
                        data.updateTime = new Date().getTime();
                        SystemMsgService.editPushMsg(data).then(function (data) {
                            if(data.responseCode == "10000"){
                                getSysMsgList(1, 10, true);
                                toastr.success("保存成功！");
                                $uibModalInstance.dismiss('cancel');
                            }else{
                                toastr.error("保存失败！" + data.responseMsg);
                            }
                        });
                    }
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
        modalInstance.opened.then(function () {
            // update attr checked of adData
        });
        modalInstance.result.then(function (result) {
            // console.log(result);
        }, function (reason) {
            // console.log(reason);
        });
    };
    //表单提交时验证
    let saveVerify = function(scope){
        if (scope.formData.msgTitle == "" || scope.formData.msgTitle == undefined) {
            toastr.warning("请填写标题");
            return false;
        }
        if (scope.formData.msgContent == "" || scope.formData.msgContent == undefined) {
            toastr.warning("请填写内容");
            return false;
        }
        /*if (scope.formData.msgStatus == "" || scope.formData.msgStatus == undefined) {
            toastr.warning("请选择状态");
            return false;
        }*/
        return true;
    };

    

    //删除系统消息
    $scope.delete = function (id) {
        SystemMsgService.deleteMsg(id)
            .then(function (data){
                if(data.responseCode == "10000"){
                    getSysMsgList(1, 10, true);
                    toastr.success("删除成功！", "Success");
                }
            });
    };

}
angular.module('controller').controller("SystemMessageController", SystemMessageController);
