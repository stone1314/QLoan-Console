/**
 * Created by LanYang on 2017/12/14.
 */
import versionTpl from "../../templates/modal-version-add.html";
import versionMgr_modal from "../../templates/modal-versionMgr.html";
const PlatformList = [{name:"qloan_android",code:"qloan_android"}, {name:"qloan_ios",code:"qloan_ios"}];

VersionMgrController.$inject = ['$scope', 'toastr', '$filter', '$timeout', '$rootScope', '$uibModal', '$state', 'VersionMgrService','$q','$stateParams'];
function VersionMgrController($scope, toastr, $filter, $timeout, $rootScope, $uibModal, $state, VersionMgrService,$q,$stateParams) {
    let dateFilter = $filter('date');
    $scope.Model= {
        tableData:{},
        dropDown: {
            platformList: PlatformList,
        },
        query: {
            platform: $stateParams.platform ? $stateParams.platform : "qloan_ios",
        },
    };

    let pageNo = 1, pageSize = 10;
    /*版本管理列表*/
    let getVersionManageList = function(no, size, reInit){
        let postData = {
            "pageNo": no ? no : 1,
            "pageSize": size ? size : 10,
            "name": $scope.Model.query.platform ? $scope.Model.query.platform : "qloan_ios"
        };
        VersionMgrService.getVersionManageList(postData)
            .then(function(data){
                if(data.responseCode!="10000"){
                    toastr.warning(data.responseMsg, "Warning");
                    return;
                }
                //绑定数据
                $scope.Model.tableData = angular.copy(data.body);
                if (reInit) {
                    $timeout(function () {
                        $rootScope.$broadcast('modelInitialized', this);
                    }, 500);
                }
            });
    };

    $scope.changePlatform = function(){
        getVersionManageList(null, null, true);
    };

    $scope.initPage = function(){
        //首次加载列表
        getVersionManageList(1, 10, true);
    };

    /*加载分页数据*/
    $scope.$on("dr.reloadPagination", function (scope, no, size, state){
        $scope.curPage = no;
        getVersionManageList(no, size, false);
    });

    /**
     * 添加版本-modal
     * */
    $scope.createNewVersion = function (pageType,platform) {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: versionTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.viewModel = {
                    statusList: [{name:"启用",code:"1"}, {name:"禁用",code:"0"}],
                    platformList: PlatformList,
                    postData: {
                        version: "",
                        platform: platform,
                        state: "",
                        downloadUrl: "",
                        description: "",
                        isUpdate: "false"
                    }
                };
                let dismissModal = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.ok = function () {
                    addVersion($scope,pageType,dismissModal); // 新增包
                };
                $scope.cancel = dismissModal;
            }]
        });
        modalInstance.opened.then(function () {
            // console.log('modal is opened');
        });
        modalInstance.result.then(function (result) {
            // console.log(result);
        }, function (reason) {
            // console.log(reason);
        });
    };

    /**
     * 版本管理-查看和编辑modal
     * */
    $scope.versionMgrModal = function (pageType,vData) {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: versionMgr_modal,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.viewModel = {
                    pageTitle: "",
                    postData: {
                        id: "", // ID
                        version: "",
                        platform: "",
                        description: "",
                        state: "", // 状态
                        createTime: "",
                        updateTime: "",
                        downloadTime: "", //下载次数
                        downloadUrl: "",
                    },
                    pageType: pageType,
                };
                if(pageType === "view" || pageType === "edit"){
                    $scope.viewModel.postData.id = vData.id;
                    $scope.viewModel.postData.version = vData.version;
                    $scope.viewModel.postData.platform = vData.platform;
                    $scope.viewModel.postData.description = vData.description;
                    $scope.viewModel.postData.state = vData.state; // 状态
                    $scope.viewModel.postData.createTime = dateFilter(vData.createTime, 'yyyy-MM-dd HH:mm:ss');
                    $scope.viewModel.postData.updateTime = dateFilter(vData.updateTime, 'yyyy-MM-dd HH:mm:ss');
                    $scope.viewModel.postData.downloadTime = vData.downloadTime; //下载次数
                    $scope.viewModel.postData.downloadUrl = vData.downloadUrl; //下载地址
                }

                if(pageType === "view"){
                    $scope.viewModel.pageTitle ="查看包";
                }else if (pageType === "edit"){
                    $scope.viewModel.pageTitle ="编辑包";
                    $scope.ok = function () {
                        upVersion($scope, dismissModal); // 更新包
                    };
                }

                let dismissModal = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.cancel = dismissModal;
            }]
        });
        modalInstance.opened.then(function () {
            // console.log('modal is opened');
        });
        modalInstance.result.then(function (result) {
            // console.log(result);
        }, function (reason) {
            // console.log(reason);
        });
    };


    //编辑
    let upVersion = function (scope, callback) {
        let formData = getValidatedFormData(scope);
        if (!formData) {
            return false;
        }
        VersionMgrService.upVersion(formData)
            .then(function (data) {
                if (data && (data.code == 200 || data.responseCode == "10000")) {
                    toastr.success("修改成功！", "Success");
                    callback();
                    getVersionManageList(1, 10, true);
                } else {
                    toastr.error(data.responseMsg);
                }
            })
            .catch(function (error) {
                toastr.error(error, "Error");
            });
    };

   //新增
    let addVersion = function (scope,pageType,callback) {
        if(scope.viewModel.postData.state === "1"){
            scope.viewModel.postData.state = true;
        }else{
            scope.viewModel.postData.state = false;
        }
        let postData = scope.viewModel.postData;
        if(postData && formDataValidate(scope,pageType)){
            VersionMgrService.addVersion(postData).then(function (data) {
                 if (data && (data.code == 200 || data.responseCode == "10000")) {
                        toastr.success("修改成功！", "Success");
                        callback();
                        getVersionManageList(1, 10, true);
                 } else {
                        toastr.error(data.responseMsg);
                 }
            }).catch(function (error) {
                 toastr.error(error, "Error");
            });
        }
    };

    /**
     * 对要提交的数据进行验证
     * @param scope
     * @returns {boolean}
     */
    let formDataValidate = function (scope,pageType) {
        if(pageType==="add"){
             if (scope.viewModel.postData.version === undefined || scope.viewModel.postData.version.trim() === "") {
                 toastr.error("请输入版本号！");
                 return false;
             }
             if (scope.viewModel.postData.platform === undefined || scope.viewModel.postData.platform.trim() === "") {
                 toastr.error("请选择平台！");
                 return false;
             }
            if (scope.viewModel.postData.downloadUrl === undefined || scope.viewModel.postData.downloadUrl.trim() === "") {
                toastr.error("请输入下载地址！");
                return false;
            }
            if (scope.viewModel.postData.description === undefined || scope.viewModel.postData.description.trim() === "") {
                toastr.error("请输入描述！");
                return false;
            }
        }else{
            if (scope.viewModel.postData.downloadUrl === undefined || scope.viewModel.postData.downloadUrl.trim() === "") {
                toastr.error("请输入下载地址！");
                return false;
            }

            if (scope.viewModel.postData.description === undefined || scope.viewModel.postData.description.trim() === "") {
                toastr.error("请输入描述！");
                return false;
            }
        }
        return true;
    };

    /**
     * 返回验证通过数据，未验证通过返回 null
     * @param scope
     * @returns {*}
     */
    let getValidatedFormData = function (scope) {
        let formData = null;
        if (formDataValidate(scope,'')) {
            formData = {
                "id": scope.viewModel.postData.id,
                "version": scope.viewModel.postData.version,
                "platform": scope.viewModel.postData.platform,
                "downloadUrl": scope.viewModel.postData.downloadUrl.trim(),
                "description": scope.viewModel.postData.description.trim(),
            };
        }
        return formData;
    };


    /**
     * 进入版本管理
     * */
    $scope.entryVersion = function (id, version, platform) {
        $state.go('main.hotUpdate', {id:id, version:version, platform:platform});
    };

    //删除
    $scope.delete = function (id) {
        VersionMgrService.deleteVersion(id).then(function (data){
            if(data.responseStatus==true){
                toastr.success("删除成功！", "Success");
                getVersionManageList(1, 10, true);
            }else if(data.responseStatus==false){
                toastr.error(data.responseMsg);
            }
        });
     };
    //启用和禁用
    $scope.setVersionState = function(id, state){
        VersionMgrService.disableVersion(id, !state).then(function (data){
            if(data.responseStatus==true){
                toastr.success("操作成功！", "Success");
                getVersionManageList(1, 10, true);
            }else if(data.responseStatus==false){
                toastr.error(data.responseMsg);
            }
        });
    };
    //设置是否更新
    $scope.setIsUpdate = function(id, isUpdate){
        let p = {
            "id": id,
            "isUpdate": !isUpdate
        };
        VersionMgrService.setIsUpdate(p).then(function (data){
            if(data.responseStatus==true){
                toastr.success("操作成功！", "Success");
                getVersionManageList(1, 10, true);
            }else if(data.responseStatus==false){
                toastr.warning(data.responseMsg, "warning");
            }
        });
    };


}
angular.module('controller').controller("VersionMgrController", VersionMgrController);
