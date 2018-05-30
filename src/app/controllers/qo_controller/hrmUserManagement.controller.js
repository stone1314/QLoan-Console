/**
 * Created by MingyueZhang on 2017/7/24.
 */

import hrmUserDetailModal from '../../templates/qo_modal/modal-hrmUserManagementDetail.html';

hrmUserManagementController.$inject = ['$scope','toastr','$uibModal','$timeout','$rootScope','HrmUserManagementService','$filter','CommonService','encryptionServer'];
function hrmUserManagementController($scope, toastr,$uibModal,$timeout,$rootScope,HrmUserManagementService,$filter,CommonService,encryptionServer) {

    let  datatables;
    let currentuser = encryptionServer.getCurrentUserInfo("currentuser_obj");
   $scope.model = {
       isShowMore : false,
       departments:{},
   }
   $scope.domain ={
       NAME:null,
       EMAIL:null,
       ID_NO:null,
       JOIN_TIME:null,
       DEPARTMENT_CODE:null,
   }
    $scope.query = function(){
        datatables = $("#ngUser").dataTable();
        datatables.fnUpdate();
    }


    $scope.more = function () {
        if ($scope.viewModel.show) {
            $scope.viewModel.show = false;
        } else {
            $scope.viewModel.show = true;
        }
    };


    //初始化table
    $scope.setTableOptions = {
        ajax: function (data, callback, settings) {

            var arrayObj = new Array();
            let depCode = $scope.domain.DEPARTMENT_CODE;
            if(depCode != null){
                arrayObj. push(depCode);
                depCode = arrayObj;
            }
            var param = JSON.stringify({
                departmentCodes: depCode,
                joinTime:  $scope.domain.JOIN_TIME,
                email:$scope.domain.EMAIL,
                idNo:$scope.domain.ID_NO,
                name:$scope.domain.NAME,
                pageIndex: (data.start / data.length) + 1,
                pageSize: "10",
                column: data.columns[data.order[0].column].data,
                sort: data.order[0].dir,
            });
            console.log(param);
            $.ajax({
                type: "POST",
                url:HrmUserManagementService.getUrl(),
                cache: false,
                data: param,
                contentType: "application/json;",
                success: function (result) {
                    var resultData = {};
                    //console.log(result);
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
            {data: 'email'},
            {data: 'idNo'},
            {data: 'code'},
            {data: 'departmentName'},
            {data: 'departmentCode'},
            {data: 'joinTime'},
            {data: 'quitTime'},
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
                //    return "<input name='boxs' type='checkbox' id='square-checkbox-1' value='"+data+"'>";
                //},
                "sWidth": "70px",
                "bAutoWidth": false,
                className: 'select-checkbox',
                "mRender": function () {
                    return null;
                },
            },
            {
                "title": "姓名",
                targets: 2
            },
            {
                "title": "邮箱",
                targets: 3
            },
            {
                "title": "身份证号",
                targets: 4
            },
            {
                "title": "员工编号",
                targets: 5
            },
            {
                "title": "部门",
                targets: 6
            },
            {
                "title": "部门代码",
                targets: 7
            },
            {
                "title": "入职时间",
                targets: 8,
                "mRender": function (data) {
                    var result = $filter("date")(data, "yyyy-MM-dd");
                    return result;
                }
            },
            {
                "title": "离职时间",
                targets: 9,
                "mRender": function (data) {
                    var result = $filter("date")(data, "yyyy-MM-dd");
                    return result;
                }
            },
            {
                "title": "创建时间",
                targets: 10,
                "mRender": function (data) {
                    var result = $filter("date")(data, "yyyy-MM-dd");
                    return result;
                }
            },
        ],
        "bPaginate": true, //翻页功能
        //"bLengthChange": true, //改变每页显示数据数量
        //"bFilter": true, //过滤功能
        "bSort": true, //排序功能
        "fnInitComplete": function () {
            datatables = $("#ngUser").dataTable();
        }
        //"bInfo": true,//页脚信息
        //"bAutoWidth": true,//自动宽度
    };

   //重置
    $scope.reset = function(){
        $scope.domain={}
    }

    /*格式校验*/
    let formDataValidate = function (scope) {

        if (scope.model.NAME === undefined || scope.model.NAME.trim() === "") {
            toastr.error("姓名不能为空");
            return false;
        }

        if (scope.model.CODE === undefined || scope.model.CODE.trim() === "") {
            toastr.error("员工编号不能为空");
            return false;
        }

        if (scope.model.EMAIL === undefined || scope.model.EMAIL.trim() === "") {
            toastr.error("邮箱不能为空");
            return false;
        }

        if (scope.model.INJOINTIME === null) {
            toastr.error("入职时间不能为空");
            return false;
        }

        //if (scope.model.QUITTIME === null) {
        //    toastr.error("离职时间不能为空");
        //    return false;
        //}

        if ( scope.model.ID_NO === undefined||scope.model.ID_NO.trim() === "") {
            toastr.error("身份证号不能为空");
            return false;
        }
        if ( scope.model.DEPARTMENT_NAME === undefined||scope.model.DEPARTMENT_NAME.trim() === "") {
            toastr.error("部门名称不能为空");
            return false;
        }
        if ( scope.model.DEPARTMENT_CODE === undefined||scope.model.DEPARTMENT_CODE.trim() === "") {
            toastr.error("部门编号不能为空");
            return false;
        }

        return true;
    };
    //格式化参数
    let getValidatedFormData = function (scope) {
        let formData = null;

        if (formDataValidate(scope)) {
            formData = {
                "name":scope.model.NAME.trim(),
                "code": scope.model.CODE.trim(),
                "email": scope.model.EMAIL.trim(),
                "joinTime": scope.model.INJOINTIME,
                "quitTime": scope.model.QUITTIME,
                "idNo": scope.model.ID_NO.trim(),
                "departmentName": scope.model.DEPARTMENT_NAME.trim(),
                "departmentCode": scope.model.DEPARTMENT_CODE.trim(),
                "description":scope.model.DESCRIPTION.trim()
            };
        }
        return formData;
    };
    /**
     * 添加HRM用户
     * */
    let addHrmUser = function (scope, callback) {
        let formData = getValidatedFormData(scope);
        if (!formData) {
            return false;
        }

        HrmUserManagementService.addHrmUser(formData)
            .then(function (data) {
                if (data.responseCode == "10000") {
                    toastr.success("添加成功", "Success");
                    //$uibModalInstance.dismiss('cancel');
                    location.reload();

                } else {
                    toastr.error("添加失败", "Error");
                }
            })
            .catch(function (error) {
                toastr.error(error, "Error");
            });
    };

    //添加
    $scope.additional = function(){
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template:hrmUserDetailModal,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

                $scope.model = {
                    title:"新增",
                    NAME:"",
                    CODE:"",
                    EMAIL:"",
                    INJOINTIME:"",
                    QUITTIME:"",
                    ID_NO:"",
                    DEPARTMENT_NAME:"",
                    DEPARTMENT_CODE:"",
                    DESCRIPTION:""
                }


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

                let dismissModal = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.save = function(){
                    addHrmUser($scope,dismissModal);
                }
                $scope.close = function () {
                    $uibModalInstance.dismiss('cancel');
                };

            }]
        });


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
                template:hrmUserDetailModal,
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.init = function () {
                        let data = {
                            "id": userId,
                        };
                        //console.log(data);
                        HrmUserManagementService.getUserInfoById(data)
                            .then(function (result) {
                                console.log(result);
                                if (result.responseCode == "10000") {
                                    $scope.model = {
                                        NAME: result.body.name,
                                        CODE: result.body.code,
                                        DESCRIPTION: result.body.description,
                                        EMAIL: result.body.email,
                                        INJOINTIME: result.body.joinTime,
                                        QUITTIME: result.body.quitTime,
                                        ID_NO:result.body.idNo,
                                        DEPARTMENT_NAME:result.body.departmentName,
                                        DEPARTMENT_CODE:result.body.departmentCode,

                                    };
                                }
                            });
                    };

                    $scope.save = function(){

                        let data ={
                            "id":userId,
                            "name":$scope.model.NAME,
                            "code":$scope.model.CODE,
                            "idNo":$scope.model.ID_NO,
                            "email":$scope.model.EMAIL,
                            "joinTime":$scope.model.INJOINTIME,
                            "quitTime":$scope.model.QUITTIME,
                            "departmentName":$scope.model.DEPARTMENT_NAME,
                            "departmentCode":$scope.model.DEPARTMENT_CODE,
                            "description":$scope.model.DESCRIPTION,
                        }
                        //console.log(data);
                        HrmUserManagementService.updateHrmUser(data).
                            then(function(data){
                                //console.log(data);
                                if (data.responseStatus||data.responseCode == "10000") {
                                    $uibModalInstance.dismiss('cancel');
                                    location.reload();
                                }
                            });

                    }

                    $scope.close = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.title="修改";
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

                }]

            });
        }
        else
        {
            toastr.error("请选择一条数据！");
        }


    }
    /*删除*/
    $scope.remove = function(){
        let  userId = "";
        let rows = datatables.api().row('.selected').data();
        userId = rows.id;
        if (userId!="") {
            let data ={
                id:userId,
            }
            HrmUserManagementService.deleteHrmUser(data).
                then(function(data){
                    if(data.responseCode!="10000"){
                        toastr.warning(data.responseMsg, "Warning");
                        return;
                    }
                    toastr.success("删除成功！", "");
                    location.reload();
                   //datatables = $("#ngUser").dataTable();
                   //dt.fnUpdate();

                });

        } else {
            toastr.error("请选择一条数据！");
        }
    }
    $scope.popup = {
        opened: false
    };
    /*鏃堕棿鎺т�?*/
    $scope.open = function () {
        $scope.popup.opened = true;
    };

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
                    console.log(list);
                }
            });
    }

    //页面初始化加载
    $scope.initPage=function () {
        getDepment($scope);
    }


}
angular.module('controller').controller("hrmUserManagementController", hrmUserManagementController);