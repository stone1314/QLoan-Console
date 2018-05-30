/**
 * Created by LanYang on 2017/12/13.
 */
import channelTpl from "../../templates/modal-channel-add.html";
import channelDetailModal from "../../templates/modal-channel-detail.html";

ChannelMgrController.$inject = ['$scope', 'toastr', '$filter', '$timeout', '$rootScope', '$uibModal', '$state', 'ChannelMgrService','$q'];
function ChannelMgrController($scope, toastr, $filter, $timeout, $rootScope, $uibModal, $state, ChannelMgrService,$q) {
    let dateFilter = $filter('date');
    $scope.Model= {
        tableData:{},
        dropDown: {
            channelTypeList: [{name: "应用市场", code: "1"}, {name: "渠道", code: "0"}],
            channelStatusList: [{name:"有效",code:"1"}, {name:"无效",code:"0"}]
        },
        query: {
            channelType: "",
            isActive: "",
            channelName: ""
        },
    };


    /*页面初始化 */
    $scope.initPage = function () {
        getChannelList(1, 10, true);
    };
    let pageNo = 1, pageSize = 10;
    /*渠道管理列表*/
    let getChannelList = function(no, size, reInit, column, sort){
        let postData = {
            "pageNo": no ? no : 1,
            "pageSize": size ? size : 10,
            "colName": $scope.Model.query.channelType ? "channel_type" : "",
            "colValue": $scope.Model.query.channelType ? $scope.Model.query.channelType : "",
            "colName2": $scope.Model.query.isActive ? "is_active" : "",
            "colValue2": $scope.Model.query.isActive ? $scope.Model.query.isActive : "",
            "name": $scope.Model.query.channelName ? $scope.Model.query.channelName : ""
        };
        ChannelMgrService.getChannelList(postData)
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

    /*加载分页数据*/
    $scope.$on("dr.reloadPagination", function (scope, no, size, state){
        $scope.curPage = no;
        getChannelList(no, size, false, null, null);
    });
    /*查询数据*/
    $scope.channelQuery = function(){
        getChannelList(null, null, true);
    };

    //查看详情
    $scope.openChannelDetail = function (data) {
        if (data){
            let modalInstance = $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: channelDetailModal,
                controller: ['$scope', '$uibModalInstance', function($scope,$uibModalInstance){
                    $scope.viewModel =angular.copy(data);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        }
    };


    /**
     * 新增/编辑渠道-modal
     * */
    $scope.openChannelModal = function (pageType, id) {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: channelTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.viewModel = {
                    pageTitle: "",
                    dropDown: {
                        channelTypeList: {}, // 渠道类型列表
                        channelStatusList: {} // 渠道状态列表
                    },
                    postData: {
                        id: "", // ID
                        channelId: "", // 渠道ID
                        channelName: "", // 渠道名称
                        channelType: "", // 渠道类型
                        startTime: "", // 起始时间
                        endTime: "", // 结束时间
                        isActive: "" // 渠道状态
                    },
                    pageType: pageType,
                };

                $scope.popup = {
                    opened: false
                };
                $scope.open = function () {
                    $scope.popup.opened = true;
                };
                $scope.popup2 = {
                    opened: false
                };
                $scope.open2 = function () {
                    $scope.popup2.opened = true;
                };

                getChannelTypeList($scope, pageType);
                getChannelStatusList($scope, pageType);

                /*if (pageType !== "add") {
                    getChannelInfo($scope, pageType, id);
                }*/
                if (pageType === "edit") {
                    getChannelInfo($scope, pageType, id);
                }

                let dismissModal = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.ok = function () {
                    if (pageType === "add") {
                        addChannel($scope, dismissModal); // 添加渠道
                    } else if (pageType === "edit") {
                        updateChannel($scope, dismissModal); // 编辑渠道
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

    /**
     * 添加渠道
     * */
    let addChannel = function (scope, callback) {
        let formData = getValidatedFormData(scope);
        if (!formData) {
            return false;
        }

        ChannelMgrService.addChannel(formData)
            .then(function (data) {
                if (data && (data.code == 200 || data.responseCode == "10000")) {
                    toastr.success("添加成功！", "Success");
                    callback();
                    getChannelList(1, 10, true);
                } else {
                    toastr.error("添加失败！到服务器的请求异常，请稍后再试！", "Error");
                }
            })
            .catch(function (error) {
                // console.log('[ERROR] ', error);
                toastr.error(error, "Error");
            });
    };


    /**
     * 修改指定 ID 的渠道
     * @param scope
     * @param callback
     * @returns {boolean}
     */
    let updateChannel = function (scope, callback) {
        let formData = getValidatedFormData(scope);
        if (!formData) {
            return false;
        }

        ChannelMgrService.updateChannel(formData)
            .then(function (data) {
                if (data && (data.code == 200 || data.responseCode == "10000")) {
                    toastr.success("修改成功！", "Success");
                    callback();
                    getChannelList(1, 10, true);
                } else {
                    toastr.error("修改失败！到服务器的请求异常，请稍后再试！", "Error");
                }
            })
            .catch(function (error) {
                // console.log('[ERROR] ', error);
                toastr.error(error, "Error");
            });
    };


    /**
     * 获取渠道类型列表
     * @param scope
     * @param pageType
     */
    let getChannelTypeList = function (scope, pageType) {
        ChannelMgrService.getChannelType()
            .then(function (data) {
                if (data && data.code == 200) {
                    if (pageType == "add") {
                        scope.viewModel.postData.channelType = data.result[0].dataCode;  //默认选中第一个
                    }
                }
                scope.viewModel.dropDown.channelTypeList = data.result;
            });
    };

    /**
     * 获取渠道状态列表
     * @param scope
     * @param pageType
     */
    let getChannelStatusList = function (scope, pageType) {
        ChannelMgrService.getChannelStatus()
            .then(function (data) {
                if (data && data.code == 200) {
                    if (pageType == "add") {
                        scope.viewModel.postData.isActive = data.result[0].dataCode;  // 默认选中第一个
                    }
                    scope.viewModel.dropDown.channelStatusList = data.result;
                }
            });
    };

    /**
     * 根据 ID 获取渠道详情
     * @param scope
     * @param pageType
     * @param id
     */
    let getChannelInfo = function (scope, pageType, id) {
        ChannelMgrService.getChannelById(id)
            .then(function (data) {
                if (data.responseCode != 200 && data.responseCode != "10000") {
                    toastr.warning(data.msg, "Warning");
                    return;
                }
                //赋值操作
                let result = angular.copy(data.body);
                scope.viewModel.postData.id = result.id;
                scope.viewModel.postData.channelId = result.channelId;
                scope.viewModel.postData.channelName = result.channelName;
                scope.viewModel.postData.channelType = result.channelType;
                if (result.startTime) {
                    scope.viewModel.postData.startTime = new Date(result.startTime)
                }
                if (result.endTime) {
                    scope.viewModel.postData.endTime = new Date(result.endTime)
                }
                //scope.viewModel.postData.isActive = result.isActive;
                if(result.isActive===true){
                    scope.viewModel.postData.isActive ="1"
                }else{
                    scope.viewModel.postData.isActive ="0"
                }

            });
    };

    /**
     * 对要提交的渠道数据进行验证
     * @param scope
     * @returns {boolean}
     */
    let formDataValidate = function (scope) {
        // let numberRegex = /^\d+$/;
        // if (!numberRegex.test(scope.viewModel.postData.channelId)) {
        //     toastr.error("请输入正确的渠道ID（只能输入数字）！");
        //     return false;
        // }

        if (scope.viewModel.postData.channelId === undefined || scope.viewModel.postData.channelId.trim() === "") {
            toastr.error("请输入渠道ID！");
            return false;
        }

        if (scope.viewModel.postData.channelName === undefined || scope.viewModel.postData.channelName.trim() === "") {
            toastr.error("请输入渠道名称！");
            return false;
        }

        if (scope.viewModel.postData.channelType === undefined) {
            toastr.error("请选择渠道类型！");
            return false;
        }

        if (!scope.viewModel.postData.startTime) {
            toastr.error("请选择渠道起始时间！");
            return false;
        }

        if (!scope.viewModel.postData.endTime) {
            toastr.error("请选择渠道结束时间！");
            return false;
        }

        /*有效周期验证*/
        let currentDate = (new Date()).setHours(0, 0, 0, 0); //当前时间
        let startTime = new Date(scope.viewModel.postData.startTime).setHours(23, 59, 59, 0);
        let endTime = new Date(scope.viewModel.postData.endTime).setHours(23, 59, 59, 0);
        if (endTime < currentDate) {
            toastr.error("结束时间不能早于当前时间！");
            return false;
        }
        if (endTime < startTime || endTime == startTime) {
            toastr.error("开始时间必须小于结束时间！");
            return false;
        }

        if (scope.viewModel.postData.isActive === null || scope.viewModel.postData.isActive === undefined) {
            toastr.error("请选择渠道状态！");
            return false;
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
        if (formDataValidate(scope)) {
            formData = {
                "id": scope.viewModel.postData.id, // ID
                "channelId": scope.viewModel.postData.channelId.trim(), // 渠道ID
                "channelName": scope.viewModel.postData.channelName.trim(), // 渠道名称
                "channelType": scope.viewModel.postData.channelType, // 渠道类型
                "startTime": new Date(scope.viewModel.postData.startTime).getTime(), // 起始时间
                "endTime": new Date(scope.viewModel.postData.endTime).getTime(), // 结束时间
                "isActive": scope.viewModel.postData.isActive==="1" ? "true": "false", // 渠道状态
            };
        }
        return formData;
    };


    /**
     * 删除指定 ID 的渠道
     * @param id
     */
    $scope.deleteChannel = function (id) {
        ChannelMgrService.deleteChannel(id)
            .then(function (data) {
                if (data && (data.code == 200 || data.responseCode == "10000")) {
                    toastr.success("渠道删除成功！", "Success");
                    getChannelList(1, 10, true);
                } else {
                    toastr.error("删除失败！到服务器的请求异常，请稍后再试！", "Error");
                }
            })
            .catch(function (error) {
                toastr.error(error, "Error");
            });
    };

}
angular.module('controller').controller("ChannelMgrController", ChannelMgrController);
