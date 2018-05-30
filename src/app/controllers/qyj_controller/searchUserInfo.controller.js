/**
 * Created by MingyueZhang on 2017/6/15.
 */
import identityModal from '../../templates/modal-IdentityInfo.html';
import basicsModal from '../../templates/modal-BasicsInfo.html';
import contactsModal from '../../templates/modal-ContactsInfo.html';

SearchUserInfoController.$inject = ['$scope','toastr','UserInfoService','$uibModal','$timeout','$rootScope','$filter','$q'];
const startday = new Date().setDate(new Date().getDate() - 30);
const yesterday = new Date().setDate(new Date().getDate() - 1);
const today = new Date().setDate(new Date().getDate());

function SearchUserInfoController($scope, toastr,UserInfoService,$uibModal,$timeout,$rootScope,$filter,$q) {
    let dateFilter = $filter('date');
   $scope.Model= {
       userInfoList:{},
       searchKeywords:"",
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
           salesArea: [],
           salesCity: [],
           salesCityAll: [],
       },
       query: {
           channel: "",
           appMarket: "",
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

    /*页面初始化 */
    $scope.initPage = function () {
        getChannelSelect("0");
        getChannelSelect("1");
        getQloanOrganiza();
        getUserInfoList(1, 10, true);
    };

   /*获取用户信息列表*/
   let getUserInfoList = function(no, size, reInit, column, sort){
      let data = {
          "pageNo": no ? no : 1,
          "pageSize": size ? size : 10,
          "channel": $scope.Model.query.channel ? $scope.Model.query.channel : "",
          "appMarket": $scope.Model.query.appMarket ? $scope.Model.query.appMarket : "",
          "applyAreaCode": $scope.Model.query.salesArea ? $scope.Model.query.salesArea : "",
          "departmentCode": $scope.Model.query.departmentCode ? $scope.Model.query.departmentCode :"",
          "registerStartDate": $scope.Model.startDate ? dateFilter($scope.Model.startDate, 'yyyy-MM-dd') : "",
          "registerEndDate": $scope.Model.endDate ? dateFilter($scope.Model.endDate, 'yyyy-MM-dd') : "",
          "name": $scope.Model.searchKeywords ? $scope.Model.searchKeywords : ""
      };
      UserInfoService.getUserInfoList(data)
          .then(function(data){
              if(data.responseCode!="10000"){
                  toastr.warning(data.responseMsg, "Warning");
                  return;
              }
              //绑定数据
              $scope.Model.userInfoList = angular.copy(data.body);
              if (reInit) {
                  $timeout(function () {
                      $rootScope.$broadcast('modelInitialized', this);
                  }, 500);
              }
      });
  };
    let pageNo = 1, pageSize = 10;
    /*加载分页数据*/
    $scope.$on("dr.userPagination", function (scope, no, size, state){
        $scope.curPage = no;
        getUserInfoList(no, size, false, null, null);
    });
    /*查询数据*/
    $scope.query = function(){
        if(!$scope.Model.regTimeChange()){
            toastr.warning("暂无数据！", "warning");
        }
        getUserInfoList(null, null, true);
    };

  /*查看身份信息*/
  $scope.OpenIdentityInfo = function(id){
      let data = {
          userId:id
      };
     //获取身份信息
      let modalInstance = $uibModal.open({

          size: 'ml',
          backdrop: 'static',
          keyboard: false,
          animation: true,
          template:identityModal,
          controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
              UserInfoService.getIdentityInfoById(data)
                  .then(function(data){
                      //console.log(data);
                      if(data.responseCode=="10000"){
                          $scope.resultData = data.body;
                      }
              });
              $scope.cancel = function () {
                  $uibModalInstance.dismiss('cancel');
              };

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
    /*查看基础信息*/
    $scope.OpenBasicsInfo = function(id){
        let data = {
            userId:id
        };
        //获取用户基本信息
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template:basicsModal,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                UserInfoService.getBasicsInfoById(data)
                    .then(function(data){
                        //console.log(data);
                        if(data.responseCode=="10000"){
                            //绑定数据
                            $scope.resultData = data.body;
                        }
                    });
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
        modalInstance.opened.then(function () {
         //   console.log('modal is opened');
        });
        modalInstance.result.then(function (result) {
          //  console.log(result);
        }, function (reason) {
          //  console.log(reason);
        });

   }
    /*查看联系人信息*/
    $scope.OpenContactsInfo = function(id){
        let data = {
            userId:id
        };
        //获取联系人信息
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template:contactsModal,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

                UserInfoService.getContastsInfoById(data)
                    .then(function(data){
                        //console.log(data);
                        if(data.responseCode=="10000")
                        {
                            $scope.resultData = data.body;
                        }
                    });
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
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


}

angular.module('controller').controller("SearchUserInfoController", SearchUserInfoController);
