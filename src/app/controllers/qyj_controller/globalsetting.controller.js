/**
 * Created by V-XiongXiang on 2017/6/30.
 */
//import globalSettingPage from '../../templates/modal_globalsetting_detail.html';
import md_global_detail from '../../templates/modal_global_detail.html';
import md_global_edit from '../../templates/modal_global_edit.html';
import md_global_add from '../../templates/modal_global_add.html';

GlobalSettingController.$inject = ['$scope','GlobalSettingService','$timeout','toastr','$rootScope','$uibModal','$filter','$q'];

function GlobalSettingController($scope,GlobalSettingService,$timeout,toastr,$rootScope,$uibModal,$filter,$q) {
    let dateFilter = $filter('date');
    $scope.Model= {
        tableData:{},
        description: ""
    };

    //初始化
    $scope.initPage = function () {

    };

    //获取列表
    let getGlobalList = function (no, size, reInit, column, sort){
        let postData = {
            "pageNo": no ? no : 1,
            "pageSize": size ? size : 10,
            "description": $scope.Model.description ? $scope.Model.description : null
        };
        if (column && sort) {
            postData.column = column;
            postData.sort = sort;
        }else{
            postData.column = null;
            postData.sort = null;
        }
        GlobalSettingService.getGlobalList(postData).then(function(data){
            if(data.responseCode == "10000" && data.responseStatus == true){
                //绑定数据
                $scope.Model.tableData = data.body;
            }else{
                toastr.warning(data.responseMsg, "Warning");
                return;
            }
            if (reInit) {
                $timeout(function () {
                    $rootScope.$broadcast('modelInitialized', this);
                }, 500);
            }
        });
    };
    //首次加载列表
    let pageNo = 1, pageSize = 10;
    getGlobalList(pageNo, pageSize, true);
    //查询数据
    $scope.queryGlobal = function(){
        getGlobalList(pageNo, pageSize, true);
    };


    //排序
    $scope.$on('sortEvent', function (scope, column, sort) {
        let pageNo = 1,pageSize = 10;
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            getGlobalList(pageNo, pageSize, true, column, sort);
        } else {
            $scope.column = null;
            $scope.sort = null;
            getGlobalList(pageNo, pageSize, true);
        }
    });
    //加载分页数据
    $scope.$on("dr.globalPagination", function (scope, no, size){
        if ($scope.column && $scope.sort) {
            getGlobalList(no, size, false, $scope.column, $scope.sort);
        } else {
            getGlobalList(no, size);
        }
    });

    //查看详情
    $scope.skipGlobal = function (id) {
        if(id!=undefined||id!=null){
            let modalInstance = $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: md_global_detail,
                controller: ['$scope', '$uibModalInstance', function($scope,$uibModalInstance){
                    let getGlobalDetailData = function(){
                        return GlobalSettingService.queryGlobalDetailById(id).then(function(data){
                            if(data.responseStatus==true && data.responseCode=="10000"){
                                $scope.viewModel = data.body;
                            }else{
                                toastr.warning("获取数据异常!");
                            }
                        });
                    };
                    let isShow = function(objLen){
                        if(objLen!=undefined||objLen!=null){
                            if(objLen.length>70){
                                $scope.showFlag = true;
                            }else{
                                $scope.showFlag = false;
                            }
                        }else{
                            $scope.showFlag = false;
                        }

                    };
                    $scope.initPage = function(){
                        $scope.showFlag = false;
                        $q.all([
                            getGlobalDetailData()
                        ]).then(function () {
                            isShow($scope.viewModel.name);
                            isShow($scope.viewModel.value);
                            isShow($scope.viewModel.valueExt);
                            isShow($scope.viewModel.description);
                        });
                    };
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
       }else{
            toastr.warning("获取信息异常!");
            return;
        }
    };


    //字典类型
    let getDictionaryTypes = function (scope) {
        scope.dicTypes = [{name:"url",code:"url"},{name:"system",code:"system"},{name:"all",code:"all"}];
    };

    //编辑
    $scope.editGlobal = function (id) {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: md_global_edit,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                getDictionaryTypes($scope);
                if(id!=undefined||id!=null){
                    GlobalSettingService.queryGlobalDetailById(id).then(function(data){
                        if(data.responseStatus==true && data.responseCode=="10000"){
                            $scope.formData = angular.copy(data.body);
                            //格式化时间
                            if (data.body && data.body.createTime) {
                                $scope.formData.createTime = dateFilter(new Date(data.body.createTime),'yyyy-MM-dd HH:mm:ss');
                            }
                            if (data.body && data.body.updateTime) {
                                $scope.formData.updateTime = dateFilter(new Date(data.body.updateTime),'yyyy-MM-dd HH:mm:ss');
                            }
                        }
                    });
                }else{
                    toastr.warning("获取信息异常!");
                    return;
                }
                $scope.ok = function () {
                    if ($scope.formData && saveVerify($scope)) {
                        var data = angular.copy($scope.formData);
                        data.createTime = (new Date(data.createTime)).getTime();
                        data.updateTime = new Date().getTime();
                        GlobalSettingService.updateGlobal(data).then(function (data) {
                            if(data.responseCode == "10000"){
                                getGlobalList(1, 10, true);
                                toastr.success("保存成功！");
                                $uibModalInstance.dismiss('cancel');
                            }else{
                                toastr.error("字典管理编辑出错！" + result.responseMsg);
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
        if (scope.formData.name == "" || scope.formData.name == undefined) {
            toastr.warning("请输入名称");
            return false;
        }
        if (scope.formData.value == "" || scope.formData.value == undefined) {
            toastr.warning("请输入键值");
            return false;
        }
        if (scope.formData.type == "" || scope.formData.type == undefined) {
            toastr.warning("请选择字典类型");
            return false;
        }
        if (scope.formData.description == "" || scope.formData.description == undefined) {
            toastr.warning("请输入字典描述");
            return false;
        }
        return true;
    };

    //删除
    $scope.delete = function (id) {
        GlobalSettingService.deleteGlobal(id)
            .then(function (data){
                if(data.responseCode == "10000"){
                    getGlobalList(1, 10, true);
                    toastr.success("删除成功！", "Success");
                }
            });
    };

    //新增
    $scope.addGlobal = function () {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: md_global_add,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                getDictionaryTypes($scope);
                $scope.formData = {
                    name: "",
                    value: "",
                    valueExt: "",
                    type: "",
                    description: "",
                    createUser:"",
                    createTime: dateFilter(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    updateUser:""
                };
                //新增
                $scope.ok = function () {
                    let postData={
                        "name": $scope.formData.name,
                        "value": $scope.formData.value,
                        "valueExt": $scope.formData.valueExt,
                        "type": $scope.formData.type,
                        "description": $scope.formData.description,
                        "createUser": $scope.formData.createUser,
                        "createTime": new Date().getTime(),
                        "updateUser": $scope.formData.updateUser,
                        "updateTime": null,
                    };
                    if(saveVerify($scope)){
                        GlobalSettingService.addNewGlobal(postData).then(function (data) {
                            if(data.responseCode == "10000"){
                                $uibModalInstance.dismiss('cancel');
                                getGlobalList(1, 10, true);
                                toastr.success("保存成功！");
                            }else{
                                toastr.error("字典管理新增出错！" + data.responseMsg);
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


    // 更新 GlobalSettingMapping Data
    /*let modifyGlobalSettingMappingByGlobalId = function ($scope,callback){
        if($scope.viewModel.globalSetting.id =="" || $scope.viewModel.globalSetting.id == undefined){
            toastr.error("主键不能为空");
            return;
        }
        if($scope.viewModel.globalSetting.name == "" || $scope.viewModel.globalSetting.name == undefined){
            toastr.error("请输入名称");
            return;
        }
        if($scope.viewModel.globalSetting.value == "" || $scope.viewModel.globalSetting.value == undefined){
            toastr.error("请输入键值");
            return;
        }
        if($scope.viewModel.globalSetting.valueExt == "" ||$scope.viewModel.globalSetting.valueExt == undefined){
            toastr.error("请输入扩展文本");
            return;
        }
        if($scope.viewModel.globalSetting.type == ""|| $scope.viewModel.globalSetting.type == undefined){
            toastr.error("请选择类型");
            return;
        }
        if($scope.viewModel.globalSetting.description == "" || $scope.viewModel.globalSetting.description == undefined){
            toastr.error("请输入描述");
            return;
        }
        GlobalSettingService.modifyGlobalSetting($scope.viewModel.globalSetting)
            .then(function (data){
                if(data.responseCode == "10000" && data.responseStatus == true){
                    toastr.success("更新成功","Success");
                    callback();
                }else{
                    toastr.warning("更新失败!");
                    callback();
                }
            });
    };*/



}

angular.module('controller').controller("GlobalSettingController",GlobalSettingController);
