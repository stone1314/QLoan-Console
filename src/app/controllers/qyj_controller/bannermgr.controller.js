/**
 * Created by LanYang on 2017/10/27.
 */
//import queryBannerModal from "../../templates/modal-bannerimage-query.html";


import bannerDetailModal from "../../templates/model-qyj-banner-detail.html";
import bannerEditModal from "../../templates/modal-bannerimage-edit.html";
import bannerAddModal from "../../templates/modal-bannerimage-add.html";
import * as constant from '../../constant';
BannerMgrController.$inject = ['$scope', 'BannerMgrService','$timeout','toastr','$rootScope','$uibModal','UpLoadService','UtilsService','$state','$filter'];

function BannerMgrController($scope, BannerMgrService, $timeout, toastr, $rootScope, $uibModal, UpLoadService,UtilsService,$state,$filter) {
    let dateFilter = $filter('date');
    //初始化数据
    $scope.Model = {
        tableData: {},
        dropDown: {
            bannerTypes: [{name: "文本", code: "text"}, {name: "图片", code: "image"}, {name: "链接", code: "link"}],
            imageStatus: [{name: "启用", code: 1}, {name: "禁用", code: 0}]
        },
        query: {
            advType: "",
            isActive: "",
            name: ""
        },
        fontCount: 0
    };
    //初始页面
    $scope.initPage = function(){

    };
    //列表及查询
    let getBannerPageList = function (no, size, reInit) {
        let formData = {
            "pageNo": no ? no : 1,
            "pageSize": size ? size : 10,
            "colName": $scope.Model.query.advType ? "link_type" : "",
            "colValue": $scope.Model.query.advType ? $scope.Model.query.advType : "",
            "colName2": $scope.Model.query.isActive ? "is_active" : "",
            "colValue2": $scope.Model.query.isActive ? $scope.Model.query.isActive : "",
            "name": $scope.Model.query.name ? $scope.Model.query.name : ""
        };

        BannerMgrService.getBannerPageList(formData).then(function (data) {
            if (data.responseCode == "10000" && data.responseStatus == true) {
                //绑定数据
                $scope.Model.tableData = data.body;
            } else {
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
    getBannerPageList(pageNo, pageSize, true);

    //加载分页数据
    $scope.$on("dr.bannerPagination", function (scope, no, size, state) {
        $scope.curPage = no;
        getBannerPageList(no, size, false);
    });
    //查询
    $scope.searchBanner = function () {
        getBannerPageList(null, null, true);
    };
    //详情
    $scope.queryDetail = function (id) {
        if (id){
            let modalInstance = $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: bannerDetailModal,
                controller: ['$scope', '$uibModalInstance', function($scope,$uibModalInstance){
                    BannerMgrService.getAdvertById(id).then(function(result){
                        if(result.responseStatus){
                            $scope.viewModel= angular.copy(result.body);
                            $scope.viewModel.createTime = dateFilter($scope.viewModel.createTime, 'yyyy-MM-dd HH:mm:ss');
                            $scope.viewModel.updateTime = dateFilter($scope.viewModel.updateTime, 'yyyy-MM-dd HH:mm:ss');
                        }else{
                            toastr.error("banner详情出错！" + result.responseMsg);
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
    //banner状态
    let getIsAtives = function (scope) {
        scope.isActives = [{name:"禁用",code:"false"},{name:"启用",code:"true"}];
    };
    //编辑
    $scope.editBanner = function (id) {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: bannerEditModal,
            controller: ['$scope', '$uibModalInstance','UpLoadService', function ($scope, $uibModalInstance) {
                $scope.init = function () {
                    $scope.formData = {
                        name: "",
                        description: "",
                        position: "",
                        isActive: ""
                    };
                    $scope.viewModel = {
                        fontCount:0,
                        smallImage:"",
                        bigImage:"",
                        smallFull:"",
                        bigFull:"",
                        bigImage1:"",
                        smallImage1:"",
                        selectItem:"false",
                    };
                };
                if (id) {
                    BannerMgrService.getAdvertById(id).then(function(data){
                        if(data.responseStatus==true && data.responseCode=="10000"){
                            //绑定数据
                            $scope.formData = angular.copy(data.body);
                            $scope.viewModel.smallImage1 = $scope.formData.linkUrl;
                            $scope.viewModel.bigImage1 = $scope.formData.linkContent;
                            $scope.viewModel.smallFull = $scope.formData.linkUrl;
                            $scope.viewModel.bigFull = $scope.formData.linkContent;
                            if($scope.formData.isActive==true){
                                $scope.viewModel.selectItem="true";
                            }else{
                                $scope.viewModel.selectItem="false";
                            }
                        }
                    });
                }

                getIsAtives($scope);
                //监听描述文字
                watchViewModel($scope);

                //上传图片
                $scope.uploadFiles = function(file,size){
                    uploadFiles(file,$scope,size);
                };

                $scope.ok = function () {
                     $scope.formData.linkUrl=$scope.viewModel.smallFull;
                     $scope.formData.linkContent=$scope.viewModel.bigFull;
                     $scope.formData.isActive=$scope.viewModel.selectItem;
                    if ($scope.formData && saveVerify($scope)) {
                        var data = angular.copy($scope.formData);
                        data.createTime = (new Date(data.createTime)).getTime();
                        data.updateTime = new Date().getTime();
                        BannerMgrService.editBanner(data).then(function (data) {
                            if(data.responseCode == "10000"){
                                getBannerPageList(1, 10, true);
                                toastr.success("保存成功！");
                                $uibModalInstance.dismiss('cancel');
                            }else{
                                toastr.error("编辑失败！" + data.responseMsg);
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
        let numberRegex = /\D/g;
        if (scope.formData.name == ""|| scope.formData.name==undefined){
            toastr.error("请填写标题");
            return false;
        }
        if (scope.formData.description == ""|| scope.formData.description==undefined) {
            toastr.error("请填写描述");
            return false;
        }
        if (scope.formData.position==""|| scope.formData.position==undefined) {
            toastr.error("请填写位置");
            return false;
        }
        if (numberRegex.test(scope.formData.position)&&scope.formData.position!="") {
            toastr.error("位置只能输入数字");
            return false;
        }
        if(scope.viewModel.selectItem == "" || scope.viewModel.selectItem==undefined){
            toastr.error("请选择图片状态");
            return false;
        }

        if (scope.viewModel.smallImage1 == ""||scope.viewModel.smallImage1==undefined) {
            toastr.warning("请上传缩略图，不能为空","Warning");
            return false;
        }
        if (scope.viewModel.bigImage1 == ""||scope.viewModel.bigImage1==undefined) {
            toastr.warning("请上传广告图，不能为空","Warning");
            return false;
        }
        return true;
    };
    //监听输入文字
    let watchViewModel = function($scope){
        let limit = 100;
        $scope.$watch('formData',function (newValue,oldValue){
            $scope.viewModel.fontCount = newValue.description.length;
            if(newValue.description.length > limit){
                $scope.formData.description = newValue.description.substr(0,limit);
                toastr.error("描述内容不能超过100个字符.");
            }
        },true);

    };
    //上传图片
    let uploadFiles = function (file,scope,size) {
        if(file == ""){
            toastr.warning("请先上传图片!","Warning");
            return false;
        }
        let postData = {
            "file": file,
            "uploadType": "image"
        };
        UpLoadService.UpLoadFile(constant.UPLOAD_IMAGE,postData) .then(function (data){
            if(data.responseStatus==true){
                if(size=="big"){
                   scope.viewModel.bigImage1 = angular.copy(data.body.relativePath);
                    scope.viewModel.bigFull = angular.copy(data.body.fullPath);
                }else if(size=="small"){
                    scope.viewModel.smallImage1= angular.copy(data.body.relativePath);
                    scope.viewModel.smallFull = angular.copy(data.body.fullPath);
                }
            }else{
                toastr.warning("上传失败!","Warning");
                return false;
            }
        });
    };
    //新建Banner图片类型
    $scope.addNewBanner = function (){
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: bannerAddModal,
            controller: ['$scope','$uibModalInstance','UpLoadService', function($scope, $uibModalInstance) {
                $scope.viewModel = {
                    fontCount:0,
                    smallImage1:"",
                    bigImage1:"",
                    smallFull:"",
                    bigFull:"",
                    selectItem:"",
                };
                $scope.formData = {
                    name: "",
                    linkUrl: "",
                    linkContent: "",
                    position: "",
                    description: "",
                    isActive: true,
                    createTime: dateFilter(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    linkType: "image"
                };
                getIsAtives($scope);
                //监听描述文字
                watchViewModel($scope);
                //上传图片
                $scope.uploadFiles = function(file,size){
                    uploadFiles(file,$scope,size);
                };
                //保存
                $scope.ok = function () {
                    let postData = {
                        "name": $scope.formData.name,
                        "linkUrl": $scope.viewModel.smallFull,
                        "linkContent": $scope.viewModel.bigFull,
                        "position": parseInt($scope.formData.position),
                        "description": $scope.formData.description,
                        "isActive": $scope.viewModel.selectItem,
                        "createUser": null,
                        "createTime": new Date().getTime(),
                        "updateTime": null,
                        "updateUser": null,
                        "linkType": "image"
                    };
                    console.log(postData);
                    if ($scope.formData && saveVerify($scope)) {
                        BannerMgrService.addNewBanner(postData).then(function (data) {
                            if(data.responseCode == "10000"){
                                getBannerPageList(1, 10, true);
                                toastr.success("保存成功！");
                                $uibModalInstance.dismiss('cancel');
                            }else{
                                toastr.error("新增banner失败！" + result.responseMsg);
                            }
                        });
                    }
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
    };

    //删除Banner信息
    $scope.delete = function (id) {
        BannerMgrService.deleteBanner(id)
             .then(function (data){
                 if(data.responseCode == "10000"){
                     getBannerPageList(1, 10, true);
                     toastr.success("删除成功！", "Success");
                 }
         });
     };

    //切换广告类型，备用的
    let getlinkTypes = function ($scope){
        $scope.linkTypes = [{name:"文本",code:"text"},{name:"图片",code:"image"},{name:"链接",code:"link"}];
    };





}
angular.module('controller').controller("BannerMgrController", BannerMgrController);