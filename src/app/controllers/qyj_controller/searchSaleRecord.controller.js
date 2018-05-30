/**
 * Created by LanYang on 2017/10/27.
 */
import md_searchSaleRecord_detail from '../../templates/modal_searchSaleRecord_detail.html';

SearchSaleRecordController.$inject = ['$scope', 'CompactService','$timeout','toastr','$rootScope','$uibModal','$filter','UserInfoService','$q'];
const startday = new Date().setDate(new Date().getDate() - 30);
const yesterday = new Date().setDate(new Date().getDate() - 1);
const today = new Date().setDate(new Date().getDate());

function SearchSaleRecordController($scope,CompactService,$timeout,toastr,$rootScope,$uibModal,$filter,UserInfoService,$q) {
    let dateFilter = $filter('date');
    $scope.Model= {
        tableList:{},
        searchKeywords: "",
        startDate: startday,
        endDate: today,
        regTimeChange: ()=>{
            let startTime = new Date($scope.Model.startDate).setHours(23, 59, 59, 0);
            let endTime = new Date($scope.Model.endDate).setHours(23, 59, 59, 0);
            if(startTime > endTime){
                toastr.error("开始时间必须小于或等于结束时间！");
                return false;
            }else{
                return true;
            }
        },
        dropDown: {
            channel: [],
            appMarket: [],
            separateModeArr: [],
            salesArea: [],
            salesCity: [],
            salesCityAll: [],
        },
        query: {
            channel: "",
            appMarket: "",
            separateMode: "",
            salesArea:"",
            departmentCode:""
        },
    };

    /*渠道和应用市场下拉框*/
    let getChannelSelect = function(channelType){
        UserInfoService.getChannelSelect(channelType).then(function (data) {
            if(data.responseCode == "10000"){
                if(channelType == "0"){
                    $scope.Model.dropDown.channel = angular.copy(data.body);
                }else if(channelType == "1"){
                    $scope.Model.dropDown.appMarket = angular.copy(data.body);
                }
            }else{
                toastr.error(data.responseMsg, "error");
            }
        });
    };

    /*分单方式下拉框*/
    let getSeparateModeSelect = function(){
        let postData = {
            "code":"SEPARATE_MODE",
            "dataVersion":"0"
        };
        CompactService.getSeparateMode(postData).then(function(data){
            if(data.responseCode == "10000"){
                $scope.Model.dropDown.separateModeArr = angular.copy(data.body.nextList);
            }else{
                toastr.error(data.responseMsg, "error");
            }
        })
    };

    /*营业部区域和门店数据获取*/
    let getQloanOrganiza = function(){
        let postData = {"dataVersion":"0"};
        UserInfoService.getQloanOrganiza(postData).then(function(data){
            if(data.responseCode == "10000"){
                //营业部区域数据
                $scope.Model.dropDown.salesArea = angular.copy(data.body);
                //所有门店数据
                let resultArr = getPropList($scope.Model.dropDown.salesArea, "nextList");
                angular.forEach(resultArr, (item) => {
                    angular.forEach(item, (item2) => {
                        $scope.Model.dropDown.salesCity.push(item2);
                        $scope.Model.dropDown.salesCityAll.push(item2);
                    });
                });
            }else{
                toastr.error(data.responseMsg, "error");
            }
        });
    };

    //私有方法
    let getPropList = function (arr, prop) {
        let result = [];
        angular.forEach(arr, (item) => {
            result.push(item[prop]);
        });
        return result;
    };

    /*当营业部区域下拉框改变时*/
    $scope.changeSalesArea = function(_data){
        $scope.departmentData = getTargetData($scope.Model.dropDown.salesArea, _data);
        //获取门店数据
        let resultArr = getPropList($scope.departmentData, "nextList");
        if($scope.Model.query.salesArea){
            $scope.Model.dropDown.salesCity = [];
        }else{
            $scope.Model.dropDown.salesCity = $scope.Model.dropDown.salesCityAll;
        }
        angular.forEach(resultArr, (item) => {
            angular.forEach(item, (item2) => {
                $scope.Model.dropDown.salesCity.push(item2);
            });
        });
    };
    /*获取指定属性code的数据*/
    let getTargetData = function (inputArr, data_type) {
        var result = [];
        angular.forEach(inputArr, (item)=> {
            if (item.code == data_type) {
                result.push(item);
            }
        });
        return result;
    };

    $scope.initPage = function(){
        getChannelSelect("0");
        getChannelSelect("1");
        getSeparateModeSelect();
        getQloanOrganiza();
    };

    //获取表格列表
    let getTableList = function (no, size, reInit, column, sort){
        let postData = {
            "pageNo": no ? no : 1,
            "pageSize": size ? size : 10,
            "channel": $scope.Model.query.channel ? $scope.Model.query.channel : "",
            "appMarket": $scope.Model.query.appMarket ? $scope.Model.query.appMarket : "",
            "separateMode": $scope.Model.query.separateMode ? $scope.Model.query.separateMode : "",
            "applyAreaCode": $scope.Model.query.salesArea ? $scope.Model.query.salesArea : "",
            "departmentCode": $scope.Model.query.departmentCode ? $scope.Model.query.departmentCode :"",
            "createStartDate": $scope.Model.startDate ? dateFilter($scope.Model.startDate, 'yyyy-MM-dd') : "",
            "createEndDate": $scope.Model.endDate ? dateFilter($scope.Model.endDate, 'yyyy-MM-dd') : "",
            "name": $scope.Model.searchKeywords ? $scope.Model.searchKeywords : ""
        };
        if (column && sort) {
            postData.column = column;
            postData.sort = sort;
        }
        CompactService.getOrderList(postData).then(function(data){
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
    let pageSize = 10, pageNo = 1;
    getTableList(pageNo, pageSize, true);

    //加载分页数据
    $scope.$on("dr.reloadPagination", function (scope, no, size, state){
        $scope.curPage = no;
        //getTableList(no, size, null);
        getTableList(no, size, false, null, null);
    });

    //查询
    $scope.query = function(){
        if(!$scope.Model.regTimeChange()){
            toastr.warning("暂无数据！", "warning");
        }
        getTableList(null, null, true);
    };
    //查看详情
    $scope.openDetail = function (data) {
        if (data){
            let modalInstance = $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: md_searchSaleRecord_detail,
                controller: ['$scope', '$uibModalInstance', function($scope,$uibModalInstance){
                    $scope.viewModel =angular.copy(data);
                    $scope.cancel = function () {
                        $uibModalInstance.close();
                    };
                }]
            });
        }
    };




}
angular.module("controller").controller("SearchSaleRecordController", SearchSaleRecordController);