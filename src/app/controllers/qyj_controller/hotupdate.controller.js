/**
 * Created by LanYang on 2017/12/15.
 */
import versionTpl_Sub from "../../templates/modal-hot-version-add.html";
import hotUpdate_view_edit from "../../templates/modal-hot-version-view-edit.html";
import * as constant from '../../constant';

hotUpdateController.$inject = ['$scope', 'toastr', '$filter', '$timeout', '$rootScope', '$uibModal', '$state', 'hotUpdateService', '$q', '$stateParams', "UpLoadService"];
function hotUpdateController($scope, toastr, $filter, $timeout, $rootScope, $uibModal, $state, hotUpdateService, $q, $stateParams, UpLoadService) {
    let dateFilter = $filter('date');
    $scope.version_id = $stateParams.id;
    $scope.platformVersion = $stateParams.platform +"_"+ $stateParams.version;
    $scope.platform = $stateParams.platform;

    $scope.Model = {
        tableData: {},
        dropDown: {
            channelTypeList: [{name: "安卓", code: "1"}, {name: "IOS", code: "0"}],
            channelStatusList: [{name: "有效", code: "1"}, {name: "无效", code: "0"}]
        },
        query: {
            channelType: "",
            isActive: "",
            channelName: ""
        },
    };

    let pageNo = 1, pageSize = 10;
    /*获取热更新列表*/
    let getHotUpdateList = function (no, size, reInit) {
        let postData = {
            "pageNo": no ? no : 1,
            "pageSize": size ? size : 10,
            "name": $scope.version_id
        };
        /*调取hotUpdateService*/
        hotUpdateService.getHotUpdateList(postData)
            .then(function (data) {
                if (data.responseCode != "10000") {
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

    $scope.initPage = function () {
        //首次加载列表
        getHotUpdateList(1, 10,true);
    };

    /*加载分页数据*/
    $scope.$on("dr.reloadPagination", function (scope, no, size, state){
        $scope.curPage = no;
        getHotUpdateList(no, size, false);
    });

    //生成随机hash值-热更新包管理-新增
    let getHashCode = function (scope) {
        let result = "";
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";
        result = s.join("");
        scope.viewModel.postData.packetHashValue = result;
    };
    /**
     * 热更新添加版本-modal
     * */
    $scope.addHotVersion = function () {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: versionTpl_Sub,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                //初始化数据
                $scope.viewModel = {
                    statusList: [{name: "启用", code: "1"}, {name: "禁用", code: "0"}],
                    downloadUrlZip: "",
                    uploading:false,
                    uploadingProgress: "",
                    postData: {
                        versionId: $stateParams.id,  //大版本号
                        appVersion: "", //小版本号
                        downloadURL: "", //包地址
                        description: "",
                        packetHashValue: "",
                        deploymentKey: $stateParams.platform +"_"+ $stateParams.version,
                        isAvailable: "",  // 状态
                        label: "",
                        createTime: dateFilter(new Date(), 'yyyy-MM-dd'),
                    }
                };
                $scope.init = function () {
                    getHashCode($scope);
                };
                //重置hash值
                $scope.resetHashCode = function () {
                    getHashCode($scope);
                };

                //上传文件
                $scope.uploadFiles = function (files, file) {
                    uploadFiles(file, $scope);
                };

                let dismissModal = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.ok = function () {
                    if ($scope.viewModel.postData.isAvailable === "1") {
                        $scope.viewModel.postData.isAvailable = true;
                    } else {
                        $scope.viewModel.postData.isAvailable = false;
                    }
                    $scope.viewModel.postData.downloadURL = $scope.viewModel.downloadUrlZip;

                    let postData = $scope.viewModel.postData;
                    if (postData && addFormCheck($scope)) {
                        hotUpdateService.addMinoVersion(postData).then(function (data) {
                            if (data.responseCode == "10000") {
                                getHotUpdateList(1, 10, true);
                                toastr.success("新增小版本信息成功！");
                                $uibModalInstance.dismiss('cancel');
                            } else {
                                toastr.error(data.responseMsg);
                            }
                        });
                    }
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


    //上传文件
    let uploadFiles = function (file, scope) {
        if (file == null) {
            return;
        }
        else if(file.size>=50*1024*1024){
            toastr.warning("请上传小于50M的zip文件!","Warning")
        }
        else if(file.name&&angular.isFunction(file.name.endsWith)&&!file.name.endsWith(".zip")){
            toastr.warning("请选择zip文件","Warning")
        }
        else if (scope.viewModel.postData.downloadURL) {
            let postData = {
                "file": file,
                "uploadType": "packages"
            };

            scope.viewModel.uploading=true;
            UpLoadService.UpLoadFile(constant.UPLOAD_IMAGE, postData).then(function (data) {
                scope.viewModel.uploading=false;
                if (data.responseStatus == true) {
                    scope.viewModel.downloadUrlZip = angular.copy(data.body.fullPath);
                } else {
                    toastr.warning("上传失败!", "Warning");
                }
            },function(error){
                toastr.warning("上传失败!", "Warning");
            },function(pro){
                //console.log(pro+"%");
                scope.viewModel.uploadingProgress = pro+"%"
            });
        }
        else{
            toastr.warning("未知错误，请重新选择","Warning");
        }


    };

    let addFormCheck = function (scope) {
        if (scope.viewModel.postData.appVersion === undefined || scope.viewModel.postData.appVersion.trim() === "") {
            toastr.error("请输入版本号！");
            return false;
        }
        if (scope.viewModel.downloadUrlZip === undefined || scope.viewModel.downloadUrlZip.trim() === "") {
            toastr.error("请输入包地址！");
            return false;
        }
        if(!scope.viewModel.downloadUrlZip.endsWith(".zip")){
            toastr.error("请选择zip文件！");
            return false;
        }
        if (scope.viewModel.postData.packetHashValue === undefined || scope.viewModel.postData.packetHashValue.trim() === "") {
            toastr.error("请输入包Hash值！");
            return false;
        }
        if (scope.viewModel.postData.deploymentKey === undefined || scope.viewModel.postData.deploymentKey.trim() === "") {
            toastr.error("请输入deploymentKey！");
            return false;
        }
        if (scope.viewModel.postData.isAvailable === undefined || scope.viewModel.postData.isAvailable === "") {
            toastr.error("请选择状态！");
            return false;
        }
        if (scope.viewModel.postData.label === undefined || scope.viewModel.postData.label.trim() === "") {
            toastr.error("请输入标签！");
            return false;
        }
        if (scope.viewModel.postData.description === undefined || scope.viewModel.postData.description.trim() === "") {
            toastr.error("该输入描述内容！");
            return false;
        }
        return true;
    };

    /**
     * 热更新-查看和编辑modal
     * */
    $scope.openHotUpdateModal = function (pageType, vData) {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: hotUpdate_view_edit,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.viewModel = {
                    pageTitle: "",
                    dropDown: {
                        channelTypeList: {}, // 渠道类型列表
                        channelStatusList: {} // 渠道状态列表
                    },
                    postData: {
                        id: "", // ID
                        deploymentKey: "",
                        downloadURL: "",
                        appVersion: "",
                        label: "",
                        createTime: "",
                        updateTime: "",
                        description: "",
                        downloadTimes: "",
                        isUpdate: "",
                        packetHashValue: "",
                        isAvailable: "",
                        versionId: "",
                    },
                    pageType: pageType,
                };

                if (pageType === "view" || pageType === "edit") {
                    $scope.viewModel.postData.id = vData.id;
                    $scope.viewModel.postData.deploymentKey = vData.deploymentKey;
                    $scope.viewModel.postData.downloadURL = vData.downloadURL;//下载地址
                    $scope.viewModel.postData.appVersion = vData.appVersion;
                    $scope.viewModel.postData.label = vData.label;
                    $scope.viewModel.postData.createTime = dateFilter(vData.createTime, 'yyyy-MM-dd HH:mm:ss');
                    $scope.viewModel.postData.updateTime = dateFilter(vData.updateTime, 'yyyy-MM-dd HH:mm:ss');
                    $scope.viewModel.postData.description = vData.description;
                    $scope.viewModel.postData.downloadTimes = vData.downloadTimes; //下载次数
                    $scope.viewModel.postData.isUpdate = vData.isUpdate;
                    $scope.viewModel.postData.packetHashValue = vData.packetHashValue;
                    $scope.viewModel.postData.isAvailable = (vData.isAvailable === true ? "启用" : "禁用");
                    $scope.viewModel.postData.versionId = vData.versionId;
                }

                if (pageType === "view") {
                    $scope.viewModel.pageTitle = "查看包";
                } else if (pageType === "edit") {
                    $scope.viewModel.pageTitle = "编辑包";
                    $scope.ok = function () {
                        upVersion($scope, dismissModal); // 更新包
                    };
                }

                let dismissModal = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.ok = function () {
                    if (pageType === "view") {
                        //viewModal($scope, dismissModal); // 查看版本
                    } else if (pageType === "edit") {
                        upVersion($scope, dismissModal); // 更新包
                    }
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

    //返回版本管理
    $scope.gobackPage = function (platform) {
        $state.go('main.versionMgr', {platform: $scope.platform});
    };

    //编辑
    let upVersion = function (scope, callback) {
        let formData = getValidatedFormData(scope);
        if (!formData) {
            return false;
        }
        //需传入QyjMinorVersionManage.id
        formData.id = scope.viewModel.postData.id;
        hotUpdateService.upMinoVersion(formData)
            .then(function (data) {
                if (data && (data.code == 200 || data.responseCode == "10000")) {
                    toastr.success("修改成功！", "Success");
                    callback();
                    getHotUpdateList(1, 10, scope.version_id);
                } else {
                    toastr.error(data.responseMsg);
                }
            })
            .catch(function (error) {
                toastr.error(error, "Error");
            });
    };
    /**
     * 返回验证通过数据，未验证通过返回 null
     * @param scope
     * @returns {*}
     */
    let getValidatedFormData = function (scope) {
        let formData = null;
        if (formDataValidate(scope)) {
            formData = {
                "label": scope.viewModel.postData.label.trim(),
                "downloadURL": scope.viewModel.postData.downloadURL.trim(),
                "description": scope.viewModel.postData.description.trim(),
            };
        }
        return formData;
    };
    let formDataValidate = function (scope) {
        if (scope.viewModel.postData.downloadURL === undefined || scope.viewModel.postData.downloadURL.trim() === "") {
            toastr.error("请输入下载地址！");
            return false;
        }

        if (scope.viewModel.postData.label === undefined || scope.viewModel.postData.label.trim() === "") {
            toastr.error("请输入标签！");
            return false;
        }

        if (scope.viewModel.postData.description === undefined || scope.viewModel.postData.description.trim() === "") {
            toastr.error("请输入描述！");
            return false;
        }
        return true;
    };

    //删除
    $scope.delete = function (id) {
        hotUpdateService.deleteData(id)
            .then(function (data){
                if(data.responseStatus==true){
                    getHotUpdateList(1, 10, $scope.version_id);
                    toastr.success("删除成功！", "Success");
                }
                else{
                    toastr.error(data.responseMsg);
                }
            });
    };

    //启用 禁用 disableMinoVersion/{id}/{isAvailable}
    $scope.setHotState = function (id, isAvailable) {
        hotUpdateService.setHotState(id, !isAvailable)
            .then(function (data){
                if(data.responseStatus==true){
                    toastr.success("操作成功！", "Success");
                    getHotUpdateList(1, 10, $scope.version_id);
                }else if(data.responseStatus==false){
                    toastr.warning(data.responseMsg, "warning");
                }
            });
    };
}
angular.module('controller').controller("hotUpdateController", hotUpdateController);
