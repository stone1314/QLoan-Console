/**
 * Created by shawn on 2017/6/19.
 */
import bannerImageModal from "../../templates/modal-bannerimage-add.html";
import queryBannerModal from "../../templates/modal-bannerimage-query.html";
import toolTipModal from "../../templates/tooltip-template.html";
import * as constant from '../../constant';
BannerImageController.$inject = ['$scope', '$uibModal', 'toastr','BannerImageService','$state','UpLoadService','$timeout','$rootScope','UtilsService'];

function BannerImageController($scope, $uibModal, toastr,BannerImageService,$state,UpLoadService,$timeout,$rootScope,UtilsService)
{
    // 初始化页面信息
    $scope.viewModel = {
        fontCount:0,
        tableData:{},
        templateUrl:toolTipModal,
        dropDown:{
            bannerTypes:[{name:"文本",code:"text"},{name:"图片",code:"image"},{name:"链接",code:"link"}],
            imageStatus:[{name:"启用",code:1},{name:"禁用",code:0}]
        },
        toolTips:"",
        query:{
            name:"",
            isActive:"",
            linkType:""
        }
    };

    $scope.init = function () {
        let formData = {
            "name":$scope.viewModel.query.name,
            "colName":"",
            "colValue":$scope.viewModel.query.isActive,
            "colName2":"",
            "colValue2":$scope.viewModel.query.linkType,
            "pageNo":"1",
            "pageSize":"10"
        };
        getBannerList(formData);
    }

    /**
     * 获取Banner列表
     * */
    $scope.queryBanner = function (){
        let formData = {
            "pageNo":"1",
            "pageSize":"10"
        };
        if($scope.viewModel.query.name!="")
        {
            formData.name = $scope.viewModel.query.name;
        }
        if($scope.viewModel.query.isActive!=""){
            formData.colName = "is_active";
            formData.colValue =$scope.viewModel.query.isActive;
        }
        if($scope.viewModel.query.linkType!=""){
            formData.colName2 = "link_type";
            formData.colValue2=$scope.viewModel.query.linkType;
        }
        getBannerList(formData);
    }

    let getBannerList = function (formData) {
        // 初始化列表
        BannerImageService.getBannerList(formData)
            .then(function(data){
                if(data.body!=null&&data.responseCode=="10000"){
                    $scope.tableData = data.body;
                }else{
                    toastr.warning(data.msg);
                }
            });
    }

    let getBannerImageList = function (no,size,reInit){
        let formData = {
            "pageNo":no,
            "pageSize":size
        };
        if($scope.viewModel.query.name!="")
        {
            formData.name = $scope.viewModel.query.name;
        }
        if($scope.viewModel.query.isActive!=""){
            formData.colName = "is_active";
            formData.colValue =$scope.viewModel.query.isActive;
        }
        if($scope.viewModel.query.linkType!=""){
            formData.colName2 = "link_type";
            formData.colValue2=$scope.viewModel.query.linkType;
        }

        BannerImageService.getBannerList(formData)
            .then(function(data){
                if(data.body!=null&&data.responseCode=="10000"){
                    $scope.tableData = data.body;
                    if (reInit) {
                        $timeout(function () {
                            $rootScope.$broadcast('modelInitialized', this);
                        }, 500);
                    }
                }
            });
    }

    let pageSize = 10,pageNo =1;

    getBannerImageList(pageNo,pageSize,true);

    $scope.$on("dr.reloadPagination",function (scope,no,size){
        getBannerImageList(no,size);
    });

    // 新建 Banner 图片类型.
    $scope.openBannerImageType = function (size){
        $uibModal.open({
            animation: true,
            template: bannerImageModal,
            size: size,
            controller: ['$scope', '$uibModalInstance','UpLoadService', function ($scope, $uibModalInstance,UpLoadService) {
                $scope.viewModel = {
                    fontCount:0,
                    selectFile:"",
                    imgSrc:"",
                    bannerLinkText:true,
                    labelText:"链接URL",
                    bannerLinkImage:false,
                    pageTitle: "新增Banner图片",
                    dropDown:{
                        linkTypes:[],
                        isActives:[]
                    },
                    postData:{
                        id: "1",
                        name: "",
                        description: "",
                        position:"",
                        isActive: "",
                        linkType: "",
                        linkUrl: "",
                        linkContent: "",
                    }
                };

                $scope.uploadFiles = function (file){
                    uploadFiles(file,$scope);
                };

                watchViewModel($scope);

                $scope.init = function(){
                    getlinkTypes($scope);
                    getIsAtives($scope);
                }
                $scope.ok = function (file) {
                    saveBannerImageType('add',$scope,file,function(){
                        $uibModalInstance.close();
                    });
                };
                $scope.settleModeChange = function () {
                    settleModeChange($scope);
                }
                $scope.cancel = function () {
                    $uibModalInstance.close();
                };
            }]
        });
    };

    /**
     *  初始化Banner 信息
     * */
    let settleModeChange = function ($scope) {
        if($scope.viewModel.postData.linkType=="image"){
            $scope.viewModel.bannerLinkImage = true;
            $scope.viewModel.bannerLinkText = false;
            $scope.viewModel.bannerLinkContent = false;
        }
        else if($scope.viewModel.postData.linkType=="text"){
            $scope.viewModel.bannerLinkContent = true;
            $scope.viewModel.bannerLinkText = false;
            $scope.viewModel.bannerLinkImage = false;
        }else if($scope.viewModel.postData.linkType=="link"){
            $scope.viewModel.bannerLinkText = false;
            $scope.viewModel.bannerLinkContent = true;
            $scope.viewModel.bannerLinkImage = true;
        }
    }

    let getlinkTypes = function ($scope){
        $scope.viewModel.dropDown.linkTypes = [{name:"文本",code:"text"},{name:"图片",code:"image"},{name:"链接",code:"link"}];
    }

    let getIsAtives = function ($scope) {
        $scope.viewModel.dropDown.isActives = [{name:"启用",code:"start"},{name:"禁用",code:"enable"}];
    }

    /*
    *  监控ViewModel
    * */
    let watchViewModel = function ($scope) {
        let limit = 100;
        $scope.$watch('viewModel',function (newValue,oldValue){
            $scope.viewModel.fontCount = newValue.postData.linkContent.length;
            if(newValue.postData.linkContent.length >= limit){
                $scope.viewModel.postData.linkContent = newValue.postData.linkContent.substr(0,limit);
                toastr.error("输入字数超过系统限制.");
            }
        },true);
    }

    /**
     *  上传文件
     * **/
    let uploadFiles = function (file,$scope) {
        if(file == ""){
            toastr.warning("请先上传图片!","Warning");
            return false;
        }
        let postData = {file:file};
        UpLoadService.UpLoadFile(constant.BANNER_UPLOAD_IMG,postData)
            .then(function (data){
                if(data.length>0){
                    $scope.viewModel.selectFile= UtilsService.getFileServerIp() + data[0];
                    $scope.viewModel.imgSrc = UtilsService.getFileServerIp() + data[0];
                }else{
                    toastr.warning("上传失败!","Warning");
                    return false;
                }
            });
    }






    
    /**
     * 根据id 获取Banner信息.
     * */
    let getBannerImageById = function (id,$scope) {
        let data = {
            colName:"id",
            colValue:id,
            pageNo:"1",
            pageSize:"10"
        };
        BannerImageService.getBannerList(data)
            .then(function(data){
                if(data.body.result.length==0||data.responseCode!="10000"){
                    toastr.warning(data.msg,"Warning");
                    return;
                }
                let result = data.body.result[0];
                $scope.viewModel.postData.name = result.name;
                $scope.viewModel.postData.description = result.description;
                $scope.viewModel.postData.position = result.position;
                $scope.viewModel.postData.isActive = result.isActive==true?"start":"enable";
                $scope.viewModel.postData.linkType = result.linkType;
                $scope.viewModel.postData.linkUrl = result.linkUrl;
                $scope.viewModel.postData.linkContent = result.linkContent;
                $scope.viewModel.imgSrc = result.linkContent;

                switch($scope.viewModel.postData.linkType){
                    case "text":
                        $scope.viewModel.bannerLinkContent = true;
                        $scope.viewModel.bannerLinkText = false;
                        $scope.viewModel.bannerLinkImage = false;
                        break;
                    case "image":
                        $scope.viewModel.bannerLinkImage = true;
                        $scope.viewModel.bannerLinkText = false;
                        $scope.viewModel.bannerLinkContent = false;
                        $scope.viewModel.selectFile = result.linkContent;
                        break;
                    case "link":
                        $scope.viewModel.bannerLinkText = false;
                        $scope.viewModel.bannerLinkContent = true;
                        $scope.viewModel.bannerLinkImage = true;
                        $scope.viewModel.selectFile = result.linkUrl;
                        break;
                }
            });
    }

    /**
     *  查看Banner 详情
     * **/
    $scope.query = function(id){
        $uibModal.open({
            animation: true,
            template: queryBannerModal,
            size: 'ml',
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.viewModel = {
                    imgSrc:"",
                    labelText:"链接URL",
                    pageTitle: "查看广告",
                    dropDown:{
                        linkTypes:[],
                        isActives:[]
                    },
                    postData:{
                        id: "",
                        name: "",
                        description: "",
                        position:"",
                        isActive: "",
                        linkType: "",
                        linkUrl: "",
                        linkContent: ""
                    }
                };

                getBannerImageById(id,$scope);

                $scope.init = function () {
                    getlinkTypes($scope);
                    getIsAtives($scope);
                }
                $scope.settleModeChange = function () {
                    settleModeChange($scope);
                }
                $scope.cancel = function () {
                    $uibModalInstance.close();
                };
            }]
        });
    };

    /**
     *  编辑广告信息
     * */
    $scope.edit = function (id) {
        $uibModal.open({
            fontCount:0,
            animation: true,
            template: bannerImageModal,
            size: 'ml',
            controller: ['$scope', '$uibModalInstance','UpLoadService', function ($scope, $uibModalInstance,UpLoadService) {
                $scope.viewModel = {
                    fontCount:0,
                    selectFile:"",
                    imgSrc:"",
                    labelText:"链接URL",
                    pageTitle: "编辑广告",
                    dropDown:{
                        linkTypes:[],
                        isActives:[]
                    },
                    postData:{
                        id: id,
                        name: "",
                        description: "",
                        position:"",
                        isActive: "",
                        linkType: "",
                        linkUrl: "",
                        linkContent: ""
                    }
                };
                $scope.init = function () {
                    getlinkTypes($scope);
                    getIsAtives($scope);
                }

                getBannerImageById(id,$scope);

                $scope.uploadFiles = function (file){
                    uploadFiles(file,$scope);
                };

                watchViewModel($scope);

                $scope.ok = function (file) {
                    saveBannerImageType('edit',$scope,file,function(){
                        $uibModalInstance.close();
                    });
                };

                $scope.settleModeChange = function () {
                    settleModeChange($scope);
                }
                $scope.cancel = function () {
                    $uibModalInstance.close();
                };
            }]
        });
    }

    
    
    



    /**
     * 保存Banner 信息
     * */
    let saveBannerImageType = function (pageType,scope,file,callback) {
        let numberRegex = /\D/g;
        if (scope.viewModel.postData.name == ""|| scope.viewModel.postData.name==undefined){
            toastr.error("请填写标题");
            return false;
        }
        if (scope.viewModel.postData.description == ""|| scope.viewModel.postData.description==undefined) {
            toastr.error("请填写描述");
            return false;
        }
        if (scope.viewModel.postData.position==""|| scope.viewModel.postData.position==undefined) {
            toastr.error("请填写位置");
            return false;
        }
        if (numberRegex.test(scope.viewModel.postData.position)&&scope.viewModel.postData.position!="") {
            toastr.error("位置只能输入数字");
            return false;
        }
        if(scope.viewModel.postData.isActive == "" || scope.viewModel.postData.isActive==undefined){
            toastr.error("请选图片状态");
            return false;
        }
        if (scope.viewModel.postData.linkType == ""|| scope.viewModel.postData.linkType==undefined) {
            toastr.error("请选择链接类型");
            return false;
        }
        if(scope.viewModel.postData.linkType=="text"){
            if (scope.viewModel.postData.linkContent == ""||scope.viewModel.postData.linkContent==undefined) {
                toastr.error("请填写内容");
                return false;
            }
        }else if(scope.viewModel.postData.linkType=="link"){
            // if (scope.viewModel.postData.linkUrl == ""||scope.viewModel.postData.linkUrl==undefined) {
            //     toastr.error("请填写链接地址");
            //     return false;
            // }
            if (scope.viewModel.postData.linkContent == ""||scope.viewModel.postData.linkContent==undefined) {
                toastr.error("请填写内容");
                return false;
            }
        }

        let formData = {
            "name": scope.viewModel.postData.name,
            "description": scope.viewModel.postData.description,
            "position":parseInt(scope.viewModel.postData.position),
            "linkType": scope.viewModel.postData.linkType,
            // "linkUrl": scope.viewModel.postData.linkUrl,
            "createUser":""  // 取登录用户.
        };

        formData.isActive = scope.viewModel.postData.isActive == "start"? 1:0;
        formData.linkUrl = scope.viewModel.postData.linkType == "link" ? scope.viewModel.selectFile:scope.viewModel.postData.linkUrl;
        formData.linkContent = scope.viewModel.postData.linkType == "image" ? scope.viewModel.selectFile:scope.viewModel.postData.linkContent;

        // if(scope.viewModel.postData.linkType=="image"){
        //     formData.linkContent = scope.viewModel.selectFile;
        // }else{
        //     formData.linkContent = scope.viewModel.postData.linkContent;
        // }

        if(pageType=="add"){
            BannerImageService.createBanner(formData,callback)
                .then(function (data){
                    if(data.responseStatus==true&&data.responseCode=="10000"){
                        toastr.success("保存成功!","Success");
                        callback();
                        /* 刷新列表页面*/
                        $scope.queryBanner();
                    }
                });
        }else{
                formData.id =  scope.viewModel.postData.id;
                BannerImageService.updateBanner(formData,callback)
                .then(function (data){
                    if(data.responseStatus==true&&data.responseCode=="10000"){
                        toastr.success("保存成功!","Success");
                        callback();
                        /* 刷新列表页面*/
                        $scope.queryBanner();
                    }
                });
        }
    }

    /*
    删除Banner信息
    * */
    $scope.delete = function (id) {
        BannerImageService.deleteBanner(id)
            .then(function (data){
                if(data.responseCode == "10000"){
                    toastr.success("删除成功！", "Success");
                    $scope.queryBanner();
                }
            });
    };
}

angular.module('controller').controller("BannerImageController", BannerImageController);
