/**
 * Created by shawn on 2017/6/19.
 */
BannerController.$inject = ['$scope','$uibModal','bootstrap3ElementModifier','Page1Service','uibPaginationConfig'];

function BannerController($scope,$uibModal,bootstrap3ElementModifier,Page1Service,uibPaginationConfig){
    $scope.bigTotalItems = 50;
    $scope.bigCurrentPage = 1;
    uibPaginationConfig.firstText="首页";
    uibPaginationConfig.previousText="上一页";
    uibPaginationConfig.nextText="下一页";
    uibPaginationConfig.lastText="末页";

    $scope.setPage = function (pageNo){
        $scope.currentPage = pageNo;
    }

    // 下一页
    $scope.pageChanged = function () {
        //console.log($scope.currentPage);
    }

    // 编辑
    $scope.eidt = function () {
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'bannerdModal.html',
            size: 'ml',
            controller: function($scope,$uibModalInstance){
                $scope.modalTitle = "编辑Banner类型";
                $scope.isShowSave = false;
                // 保存 Banner 类型
                $scope.onSubmit = function () {
                    $uibModalInstance.close();
                };
                // 关闭
                $scope.cancel = function () {
                    $uibModalInstance.close();
                };
            }
        });
    }

    // 查看详情
    $scope.detail = function () {
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'bannerdModal.html',
            size: 'ml',
            controller: function($scope,$uibModalInstance){
                $scope.modalTitle = "查看Banner类型";
                $scope.isShowSave = true;
                // 保存 Banner 类型
                $scope.onSubmit = function () {
                    $uibModalInstance.close();
                };
                // 关闭
                $scope.cancel = function () {
                    $uibModalInstance.close();
                };
            }
        });
    }

   Page1Service.getBannerType().then(function (data) {
       if (data && data.code == '200') {
           $scope.bannerTypes = data.result;
       }
   });

   // 新建Banner 类型.
   $scope.modalDialog = function(){
     $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title-top',
          ariaDescribedBy: 'modal-body-top',
          templateUrl: 'bannerdModal.html',
          size: 'ml',
          controller: function($scope,$uibModalInstance,bootstrap3ElementModifier){
              $scope.modalTitle = "新增Banner类型";
              bootstrap3ElementModifier.enableValidationStateIcons(true);
              // 初始化渠道信息
              $scope.channels = [{name:'APP',code:'1'},{name:'微信',code:'2'},{name:'其他',code:'3'}];
              // 初始化是否有效
              $scope.effectives = [{name:'是',code:'1'},{name:'否',code:'2'}];
              // 保存 Banner 类型
              $scope.onSubmit = function () {
                  $uibModalInstance.close();
              };
              // 关闭
              $scope.cancel = function () {
                  $uibModalInstance.close();
              };
          }
      });
   };
}
angular.module('controller').controller("BannerController",BannerController);
