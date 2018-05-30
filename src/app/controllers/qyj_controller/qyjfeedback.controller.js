/**
 * Created by LanYang on 2017/10/27.
 */
import md_feedback from '../../templates/model-qyj-feedBackDetail.html';

QyjFeedbackController.$inject = ['$scope', 'QyjFeedbackService','$timeout','toastr','$rootScope','$uibModal'];

function QyjFeedbackController($scope,QyjFeedbackService,$timeout,toastr,$rootScope,$uibModal) {
    $scope.Model= {
        name: "",
        city: "",
        Cities: [],
        department: "",
        departmentes: [],
        content: "",
        mobile: "",
        feedbacksList:{}
    };
    //重置
    $scope.reset = function () {
        $scope.Model = {
            name: "",
            city: "",
            Cities: '',
            department: "",
            departmentes: "",
            content: ""
        };
    };
    $scope.initPage = function(){
        getCity();
        getDepment();
        //getFeedbacksList(null, null, true);
    };

    //获取城市信息
    let getCity = function () {
        var data = {prefix: "Qone", dataVersion: "2"};
        QyjFeedbackService.getCityList(data).then(function (result) {
            if (result.responseStatus) {
                $scope.Model.Cities = result.body;
            }
        });
    };
    //获取部门信息
    let getDepment = function () {
        var data = {pageIndex: "1", pageSize: "100"};
        QyjFeedbackService.getDepment(data).then(function (result) {
            console.log(result);
            if (result.responseCode == "10000") {
                $scope.Model.departmentes = result.body.result;
            }
        });
    };


    //获取表格列表
    let getFeedbacksList = function (no, size, reInit, column, sort){
        /*let postData = {
            "pageNo": no ? no : 1,
            "pageSize": size ? size : 10,
            "city": $scope.Model.city ? $scope.Model.city : "",
            "depart": $scope.Model.department ? $scope.Model.department : "",
            "content": $scope.Model.content ? $scope.Model.content : "",
            "name": $scope.Model.mobile ? $scope.Model.mobile : ""
        };*/
        let postData = {
            "pageNo": no ? no : 1,
            "pageSize": size ? size : 10,
            "name": $scope.Model.mobile ? $scope.Model.mobile : ""
        };
        if (column && sort) {
            postData.column = column;
            postData.sort = sort;
        }
        QyjFeedbackService.getFeedbacksList(postData).then(function(data){
            if(data.responseCode!="10000"){
                toastr.warning(data.responseMsg, "Warning");
                return;
            }
            //绑定数据
            $scope.Model.feedbacksList=data.body;
            if (reInit) {
                $timeout(function () {
                    $rootScope.$broadcast('modelInitialized', this);
                }, 500);
            }
        });
    };

    //进入页面首次加载列表
    let pageSize = 10, pageNo = 1;
    getFeedbacksList(pageNo, pageSize, true);

    //加载分页数据
    $scope.$on("dr.feedbacksPagination", function (scope, no, size, state){
        $scope.curPage = no;
        if ($scope.column && $scope.sort) {
            getFeedbacksList(no, size, false, $scope.column, $scope.sort);
        } else {
            getFeedbacksList(no, size, false, null, null);
        }
    });
    //排序
    $scope.$on('sortEvent', function (scope, column, sort) {
        let pageNo = 1,pageSize = 10;
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            getFeedbacksList(pageNo, pageSize, true, column, sort);
        } else {
            $scope.column = null;
            $scope.sort = null;
            getFeedbacksList(pageNo, pageSize, true);
        }
    });

    //查询
    $scope.query = function(){
        getFeedbacksList(null, null, true);
    };
    //意见反馈详情
    $scope.skip = function (id) {
        if (id){
            let postData = {"id": id};
            let modalInstance = $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: md_feedback,
                controller: ['$scope', '$uibModalInstance', function($scope,$uibModalInstance){
                    QyjFeedbackService.getFeedbackDetails(postData).then(function(result){
                        if(result.responseStatus){
                            var data = result.body;
                            $scope.Model = {
                                "id": data.id,
                                "name": data.name,
                                "mobile": data.mobile,
                                "content": data.adviceContent,
                                "createTime": data.createTime
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
        }

    };
}

angular.module('controller').controller("QyjFeedbackController", QyjFeedbackController);
