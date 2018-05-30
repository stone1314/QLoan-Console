/**
 * Created by V-XiongXiang on 2017/7/26.
 */

import  md_link from '../../templates/qo_modal/modal-linkDetail.html';

CommonLinksController.$inject = ['$scope', '$timeout', '$uibModal', 'CommonLinkService', 'toastr', '$filter','encryptionServer']
function CommonLinksController($scope, $timeout, $uibModal, CommonLinkService, toastr, $filter,encryptionServer) {
    $scope.Model = {
        Name: "",
        Type: ""
    };
    var datatables;
    let currentuser = encryptionServer.getCurrentUserInfo("currentuser_obj");
    //重置按钮
    $scope.reset = function () {
        $scope.Model = {
            Name: ""
        };
    }
    //查询按钮
    $scope.query = function () {
        datatables.fnUpdate();
    }

    //添加按钮
    $scope.add = function () {
        modifyFrom("add");
    }
    //修改按钮
    $scope.update = function () {
        //var row = $("#ngCommonLinks tr td  :checked")[0];
        let rows = datatables.api().row('.selected').data();
        if (rows) {
            var id = rows.id;
            console.log(id);
            modifyFrom("update", id);
        } else {
            toastr.info("请选择要修改的记录！");
        }
    }
    //删除按钮
    $scope.remove = function () {
        //var row = $("#ngCommonLinks tr td  :checked")[0];
        let rows = datatables.api().row('.selected').data();
        if (rows) {
            var id = rows.id;
            deleteLink(id);
        } else {
            toastr.info("请选择要删除的记录！");
        }
    }

    //保存排序
    $scope.saveSort = function () {
        datatables = $("#ngCommonLinks").dataTable();
        var models = datatables.fnGetData();
        console.log(models);

        var idx = $("table[angular-table=CommonLinks] tr");

        var arr = [];
        $.each(idx, function (index, value) {
            if (index != 0) {
                var id = $(value).find("td :checkbox")[0].value;
                for (var k = 0; k < models.length; k++) {
                    if (models[k].id == id) {
                        var obj = {};
                        obj.id = id;
                        obj.sort = index;
                        arr.push(obj);
                        //models[k].sort = index;
                        break;
                    }
                }
            }
        });
        console.log(JSON.stringify(arr));
         CommonLinkService.updateLinkSort(arr).then(function (result) {
            console.log(result);
            if (result.responseStatus) {
                toastr.success("保存排序成功！");
                datatables.fnUpdate();
            } else {
                toastr.error("保存排序失败！" + result.responseMsg);
            }
        });
    }

    let deleteLink = function (id) {
        CommonLinkService.deleteLink(id).then(function (result) {
            if (result.responseStatus) {
                toastr.success("删除成功！");
                datatables.fnUpdate();
            } else {
                toastr.error("删除发送错误！" + result.responseMsg);
            }
        });
    }

    let modifyFrom = function (state, id) {
        let modalInstance = $uibModal.open({
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: md_link,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.model = {
                    ID: "",
                    NAME: "",
                    LINK: ""
                };

                $scope.init = function () {
                    if (state == "update") {
                        getData($scope, id);
                    }
                }

                $scope.save = function () {
                    var isVerify = verify($scope);//验证控制是否为空
                    if (!isVerify)
                        return false;
                    var data = {
                        "id": $scope.model.ID,
                        "name": $scope.model.NAME,
                        "link": $scope.model.LINK,
                        "sort": 0
                    }
                    console.log(data);
                    console.log(JSON.stringify(data));
                    if (state == "add")//添加广告
                    {
                        CommonLinkService.addLink(data).then(function (result) {
                            console.log(result);
                            if (result.responseStatus) {
                                toastr.success("添加网址地址成功！");
                                  $uibModalInstance.dismiss('cancel');
                                datatables.fnUpdate();
                            } else {
                                toastr.error("添加网址地址失败！" + result.responseMsg);
                            }
                        });
                    } else if (state == "update")//修改广告
                    {
                        CommonLinkService.updateLink(data).then(function (result) {
                            console.log(result);
                            if (result.responseStatus) {
                                toastr.success("修改广告成功！");
                                $uibModalInstance.dismiss('cancel');
                                datatables.fnUpdate();
                            } else {
                                toastr.error("修改网址地址失败！" + result.responseMsg);
                            }
                        });
                    }
                }

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
    }

    let verify = function (scope) {
        if (!scope.model.NAME) {
            toastr.error("网址名称不能为空！");
            return false;
        }
        if (!scope.model.LINK) {
            toastr.error("网站地址不能为空！");
            return false;
        }
        return true;
    }

    let getData = function (scope, id) {
        CommonLinkService.getLink(id).then(function (result) {
            console.log(result);
            if (result.responseStatus) {
                var data = result.body;
                scope.model.ID = data.id;
                scope.model.NAME = data.name;
                scope.model.LINK = data.link;

            }
        });
    }

    // Init Datatable
    $scope.setTableOptions = {
        "sName": "ads",
        ajax: function (data, callback, settings) {
            var param = JSON.stringify({
                name: $scope.Model.Name,
                pageNo: (data.start / data.length) + 1,
                pageSize: "10"
            });
            console.log(param);
            $.ajax({
                type: "POST",
                url: CommonLinkService.getUrl(),
                cache: false,
                data: param,
                contentType: "application/json;",
                success: function (result) {
                    console.log(result);
                    var returnData = {};
                    //  returnData.draw = 2;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.body.rows;//返回数据全部记录
                    returnData.recordsFiltered = result.body.rows;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.body.result;//返回的数据列表
                    //console.log(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    if (returnData.data!=undefined) {
                        callback(returnData);
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
            {data: 'id'},
            {data: 'id'},
            {data: 'name'},
            {data: 'link'},
            {data: 'sort'},
            {data: 'createdTime'},
            {data: 'id'}
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
                //"mRender": function (data, type, row, meta) {
                //    return "<input   type='checkbox'   value='" + data + "' />";
                //},
                "className": 'select-checkbox',
                "mRender": function () {
                    return null;
                },
            },
            {
                "title": "名称",
                targets: 2,
            },
            {
                "title": "地址",
                targets: 3,
            },
            {
                "title": "排序",
                targets: 4,
                "mRender": function (data) {
                    return data  ;
                }
            },
            {
                "title": "创建时间",
                targets: 5,
                "mRender": function (data) {
                    var result = $filter("date")(data, "yyyy-MM-dd");
                    return result;
                }
            },
            {
                "title": "排序",
                targets: 6,
                render: function (data, type, row, meta) {
                    return '<i class="fa fa-bars drag"></i>';
                },
            }
        ],
        /*   sScrollY: "300px",
         sScrollX: "100%",
         sScrollXInner: "150%",*/
        bScrollCollapse: true,//保持必要的宽度
        bPaginate: true,//是否有分页
        /* column: {rightColumns: 1}, //固定的列数*/
        //  data: result,
        "fnInitComplete": function () {
            $("#ngCommonLinks tbody").sortable();
            $("#ngCommonLinks tbody").disableSelection();
            datatables = $("#ngCommonLinks").dataTable();

        }
    };
}
angular.module("controller").controller("CommonLinksController", CommonLinksController)
