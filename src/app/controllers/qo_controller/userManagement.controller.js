/**
 * Created by MingyueZhang on 2017/7/24.
 */

import userDetailModal from '../../templates/qo_modal/modal-userManagementDetail.html';

userManagementController.$inject = ['$scope','toastr','$uibModal','$timeout','$rootScope','UserManagementService','$filter','CommonService','PromanageService','encryptionServer'];
function userManagementController($scope, toastr,$uibModal,$timeout,$rootScope,UserManagementService,$filter,CommonService,PromanageService,encryptionServer) {

    var datatables;
    let currentuser = encryptionServer.getCurrentUserInfo("currentuser_obj");
    $scope.domain={
        NAME:null,
        TELPHONE:null,
        DepartmentId:null,
        UserCompanyId:null
    }
    $scope.model={
        isShowMore:"",
        userInfoList:{},
        departments:{},
        citylist:{}
    }
    /*查询*/
    $scope.query = function(){
        datatables = $("#ngAdverts").dataTable();
        datatables.fnUpdate();
    }
    //初始化table
    $scope.setTableOptions = {
        ajax: function (data, callback, settings) {
            var param = JSON.stringify({
                name:$scope.domain.NAME,
                telphone:$scope.domain.TELPHONE,
                userAccountDepartmentId:$scope.domain.DepartmentId,
                userCompanyId:$scope.domain.UserCompanyId,
                pageIndex: (data.start / data.length) + 1,
                pageSize: 10,
                column: data.columns[data.order[0].column].data,
                sort: data.order[0].dir,
            });
           // console.log(param);
            $.ajax({
                type: "POST",
                url: UserManagementService.getUrl(),
                cache: false,
                data: param,
                contentType: "application/json;",
                success: function (result) {
                    var resultData = {};
                    resultData.recordsTotal = result.body.rows;//返回数据全部记录
                    resultData.recordsFiltered = result.body.rows;//后台不实现过滤功能，每次查询均视作全部结果
                    resultData.data = result.body.result;
                    if (resultData.data!=undefined) {
                        callback(resultData);
                    }
                },
                beforeSend: function(xhr) {
                let token =currentuser.token;
                xhr.setRequestHeader("authorization", token);
            }
        });
        }
        ,
        columns: [
            {data: "id"},
            {data: "id"},
            {data: 'name'},
            {data: 'telphone'},
            {data: 'city'},
            {data: 'departmentName'},
            {data: 'isActived'},
            {data: 'createdTime'}
        ],
        columnDefs: [
            {
                "title": "id",
                targets: 0,
                "bSortable": false,
                "bVisible": false
            },
            {
                "title": "选择",
                targets: 1,
                "bSortable": false,
                //render: function (data, type, row, meta) {
                //    return "<input name='boxs' type='checkbox' id='square-checkbox-1' value="+data+">";
                //},
                "sWidth": "70px",
                "bAutoWidth": false,
                className: 'select-checkbox',
                "mRender": function () {
                    return null;
                },
            },
            {
                "title": "真实姓名",
                targets: 2
            },
            {
                "title": "手机号",
                targets: 3
            },
            {
                "title": "城市",
                targets: 4
            },
            {
                "title": "部门",
                targets: 5
            },
            {
                "title": "状态",
                targets: 6,
                "mRender": function (data) {
                    if (data == 0) {
                        return "<lable class='label label-danger' value='" + data + "'>已禁用</lable>";
                    } else {
                        return "<lable class='label label-success' value='" + data + "'>已启用</lable>";
                    }
                }
            },
            {
                "title": "创建时间",
                targets: 7,
                "mRender": function (data) {
                    var result = $filter("date")(data, "yyyy-MM-dd");
                    return result;
                }
            },
        ],
        bScrollCollapse: true,
        bPaginate: true,
        "bSort": true, //排序功能
        "fnInitComplete": function () {
            datatables = $("#ngAdverts").dataTable();
        }
        // column: {rightColumns: 1},
         //data: result
    };
    //重置
    $scope.reset =function(){
        $scope.domain={}
    }
    //修改
    $scope.modify = function(){
        let  userId = "";
        let rows = datatables.api().row('.selected').data();
        userId = rows.id;
        if(userId!=""){
            let modalInstance = $uibModal.open({
                size: 'ml',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template:userDetailModal,
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.close = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.init = function(){
                        let data = {
                            "id":userId
                        }
                        UserManagementService.getUserInfoById(data).
                            then(function(result){
                                if (result.responseCode == "10000") {
                                    //初始化城市 部门
                                    getDepment($scope);
                                    getCity($scope);
                                    $scope.model = {
                                        NAME: result.body.name,
                                        TELPHONE: result.body.telphone,
                                        USER_ACCOUNT: result.body.userAccount,
                                        IS_ACTIVED: result.body.isActived,
                                        ID_NO:result.body.idNo,
                                        USER_ACCOUNT_DEPARTMENT_ID:result.body.userAccountDepartmentId,
                                        USER_COMPANY_ID:result.body.userCompanyId,
                                        DESCRIPTION: result.body.description,
                                        SALT:result.body.salt,
                                    };
                                }

                            });
                    }
                    $scope.save = function(){
                        let data ={
                            "id":userId,
                            "description":$scope.model.DESCRIPTION,

                        }
                        UserManagementService.updateUserInfo(data).
                            then(function(data){
                                if (data.responseStatus||data.responseCode == "10000") {
                                    $uibModalInstance.dismiss('cancel');
                                    location.reload();
                                }
                            });
                    }
                    $scope.resetPassword =function(){
                        let data ={
                            "id":userId,
                            "changedUser":currentuser.userName,
                            "salt": $scope.model.SALT,
                        }
                        console.log(data);
                        UserManagementService.resetPassWord(data).
                            then(function(data){
                                if(data.responseCode!="10000"){
                                    toastr.warning(data.responseMsg, "Warning");
                                    return;
                                }
                                toastr.success("修改成功！", "");
                                //location.reload();
                            });
                    }
                    $scope.title="修改";
                }]

            });
        }
        else{
            toastr.error("请选择一条数据！");
        }

    }
    //启用
    $scope.active = function(){
        let rows = datatables.api().row('.selected').data();
        let account = "admin";
        if (rows) {
            let id = rows.id;
            let state =rows.isActived;
            if (state == 0)
                state = 1;
            else
                state = 0;
            let data = {
                id: id,
                isActived: state,
                changedUser:account
            };
            //console.log(data);
            UserManagementService.updateUserInfo(data).
                then(function(data){
                    if(data.responseCode!="10000"){
                        toastr.warning(data.responseMsg, "Warning");
                        return;
                    }
                   // location.reload();
                    toastr.success("操作成功！", "");
                });

        } else {
            toastr.error("请选择一条数据！");
        }
    }

    //删除
    $scope.remove = function(){
        let rows = datatables.api().row('.selected').data();
        var account = "admin";
        if (rows) {
            let data ={
                id:rows.id,
                changedUser:account
            }
            UserManagementService.deleteUserInfo(data).
                then(function(data){
                    if(data.responseCode!="10000"){
                        toastr.warning(data.responseMsg, "Warning");
                        return;
                    }
                    toastr.success("删除成功！", "");
                    location.reload();
                });

        } else {
            toastr.error("请选择一条数据！");
        }
    }
    //关闭离职权限
    $scope.closePermission = function(id){
        let  userId = "";
        let rows = datatables.api().row('.selected').data();
        userId = rows.id;
        if(userId!=""){
            let data ={
                "userId":userId
            }
            UserManagementService.closeUserPermission(data).
                then(function(data){
                    console.log(data);
                    if(data.responseCode!="10000"){
                        toastr.warning(data.responseMsg, "Warning");
                        return;
                    }
                    //toastr.success("关闭成功！", "");
                    //location.reload();
                });
        }
        else{
            toastr.error("请选择一条数据！");
        }

    }
    //是否加载更多筛选条件
    $scope.more = function () {
        if ($scope.viewModel.show) {
            $scope.viewModel.show = false;
        } else {
            $scope.viewModel.show = true;
        }
    };
    $scope.initPage=function(){
        getDepment($scope);
        getCity($scope);
    }

    let getDepment=function (scope) {
        var data = {pageIndex: "1", pageSize: "100"};
        CommonService.getDepment(data)
            .then(function (result) {
                if (result.responseCode == "10000") {
                    var list = [];
                    $.each(result.body.result, function (index, value) {
                        if (value.isDeleted == "0" && value.isActived == "0") {
                            list.push(value);
                        }
                    })
                    scope.model.departments = list;
                }
            });
    }
    //获取城市信息
    let getCity=function (scope) {
        var data={prefix:"Qone",dataVersion:"2"};
        CommonService.getCityList(data).then(function (result) {
            console.log(result);
            if(result.responseStatus) {
                scope.model.citylist = result.body;
            }
        });
    }


    //清空绑定手机号
    $scope.clearBinding = function(){
        let  userId = "";
        let rows = datatables.api().row('.selected').data();
        userId = rows.id;
        if(userId!=""){
            let data = {
                "id":userId
            }
            UserManagementService.getUserInfoById(data).then(function(result){
                    if (result.responseCode == "10000") {
                        let telPhone = result.body.telphone;
                        if(telPhone!=""){
                            UserManagementService.clearBinding(telPhone).then(function(data){
                                console.log(data);
                                if(data.responseCode!="10000"){
                                    toastr.warning(data.responseMsg, "Warning");
                                    return;
                                }
                                else
                                {
                                    toastr.success("清空绑定成功！", "");
                                }
                            });
                        }
                        else {
                            toastr.error("手机号不能为空！");
                        }

                    }
                else{
                        toastr.warning(result.responseMsg, "Warning");
                }
            });
        }
        else{
            toastr.error("请选择一条数据！");
        }
    }





}
angular.module('controller').controller("userManagementController", userManagementController);