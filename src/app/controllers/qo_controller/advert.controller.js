/**
 * Created by V-XiongXiang on 2017/7/24.
 */


import md_addetail from '../../templates/qo_modal/modal-adDetail.html';


AdvertController.$inject = ['$scope', 'toastr', '$filter', 'AdvertService', '$uibModal', 'Upload', '$timeout','encryptionServer']
function AdvertController($scope, toastr, $filter, AdvertService, $uibModal, Upload, $timeout,encryptionServer) {

    var datatables;
    let currentuser = encryptionServer.getCurrentUserInfo("currentuser_obj");
    $scope.viewModel = {Name: "", Type: ""};
    //新增记录
    $scope.modify = function () {
        modifyForm(0, "添加广告", null);
    }


    $scope.update = function () {
        var row = getRow();
        if (row) {
            modifyForm(1, "添加广告", row.id);
        } else {
            toastr.info("请选择要修改的记录！");
        }
    }

    let modifyForm = function (state, title, adId) {

        let modalInstance = $uibModal.open({
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: md_addetail,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.model = {
                    TITLE: title,
                    NAME: "",
                    AD_TYPE: "",
                    PICTURE_PATH: "",
                    DEFAULT_STATE: "1",
                    LINK_TYPE: "1",
                    LINK_URL: "",
                    IS_ACTIVED: "",
                    DESCRIPTION: "",
                    SELECTFILENAME: "",
                    BASE64FILE: {},
                    IMAGEID: ""
                };
                $scope.uploadFiles = function (file) {
                    $scope.model.SELECTFILENAME = file.name;
                    var r = new FileReader();  //本地预览
                    r.onload = function () {
                        $scope.model.BASE64FILE = r.result;
                    }
                    r.readAsDataURL(file);    //Base64
                };

                $scope.init = function () {
                    if (state == 1) {
                        getData($scope, adId);
                    }
                }

                $scope.save = function () {
                    console.log($scope.model.BASE64FILE);
                    verify($scope);//验证控制是否为空
                    var data = {
                        "id": $scope.model.ID,
                        "name": $scope.model.NAME,
                        "adType": $scope.model.AD_TYPE,
                        "defaultState": $scope.model.DEFAULT_STATE,
                        "linkUrl": $scope.model.DEFAULT_STATE,
                        "linkType": $scope.model.LINK_TYPE,
                        "sort": 0,
                        "isDeleted": 0,
                        "isActived": $scope.model.IS_ACTIVED == true ? 1 : 0,
                        "picturePath": $scope.model.PICTURE_PATH,
                        "description": $scope.model.DESCRIPTION,
                        'fileName': $scope.model.SELECTFILENAME,
                        'imageData': $scope.model.BASE64FILE == undefined ? null : $scope.model.BASE64FILE.split(',')[1],
                        'imageId': $scope.model.IMAGEID
                    }
                    //console.log(JSON.stringify(data));
                    //return false;
                    if (state == 0)//添加广告
                    {
                        AdvertService.addAdvert(data).then(function (result) {
                            console.log(result);
                            if (result.responseStatus) {
                                toastr.success("添加广告成功！");
                                $uibModalInstance.dismiss('cancel');
                                datatables.fnUpdate();
                            } else {
                                toastr.error("添加广告失败！" + result.responseMsg);
                            }
                        });
                    } else if (state == 1)//修改广告
                    {
                        AdvertService.updateAdvert(data).then(function (result) {
                            console.log(result);
                            if (result.responseStatus) {
                                toastr.success("修改广告成功！");
                                $uibModalInstance.dismiss('cancel');
                                datatables.fnUpdate();
                            } else {
                                toastr.error("修改广告失败！" + result.responseMsg);
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


    //验证界面控件
    let verify = function (scope) {
        var data = scope.model;
        if (!data.NAME) {
            toastr.error("请输入广告名称！");
            return;
        }
        if (!data.AD_TYPE) {
            toastr.error("请输入广告类型！");
            return;
        }
        if (!data.PICTURE_PATH) {
            toastr.error("请上传广告图片！");
            return;
        }
        if (!data.LINK_URL) {
            toastr.error("请输入链接地址！");
            return;
        }

    }
    //获取广告信息
    let getData = function (scope, id) {
        AdvertService.getAdvert(id).then(function (result) {
            if (result.responseStatus) {
                var data = result.body;
                console.log(data);
                scope.model = {
                    ID: id,
                    NAME: data.name,
                    AD_TYPE: data.adType,
                    PICTURE_PATH: data.picturePath,
                    DEFAULT_STATE: data.defaultState.toString(),
                    LINK_TYPE: data.linkType.toString(),
                    LINK_URL: data.linkUrl,
                    IS_ACTIVED: data.isActived == 1 ? true : false,
                    DESCRIPTION: data.description,
                    SELECTFILENAME: data.fileName,
                    BASE64FILE: data.imageData,
                    IMAGEID: data.imageId
                };
                console.log(scope.model);
            }
        });

    }

    $scope.active = function () {
        var rows = getRow();
        var isActived = 0;
        if (rows) {
            if (rows.isActived == 0) {
                isActived = 1;
            }
            var data = {id: rows.id, isActived: isActived.toString()};
            console.log(data);
            AdvertService.updateAdvert(data).then(function (result) {
                console.log(result);
                if (result.responseStatus) {
                    toastr.success("修改成功！");
                    datatables.fnUpdate();
                } else {
                    toastr.error("修改失败！" + result.responseMsg);
                }
            });
        } else {
            toastr.info("请选择要启用/禁用的记录！");
        }

    }

    //保存排序
    $scope.saveSort = function () {
        //datatables = $("#ngAdverts").dataTable();
        var models = datatables.fnGetData();

        var idx = $("table[angular-table=ads] tbody tr");
        console.log(idx);
        var arr = [];
        $.each(idx, function (index, value) {
            var html = $(value).find("td i")[0];
            var id = $(html).attr("value");
            for (var k = 0; k < models.length; k++) {
                if (models[k].id == id) {
                    var obj = {};
                    obj.id = id;
                    obj.sort = index ;//- 1;
                    arr.push(obj);
                    //models[k].sort = index;
                    break;
                }
            }
        });
        console.log(JSON.stringify(arr));
        AdvertService.updAdvertBatch(arr).then(function (result) {
            console.log(result);
            if (result.responseStatus) {
                toastr.success("保存排序成功！");
                datatables.fnUpdate();
            } else {
                toastr.error("保存排序失败！" + result.responseMsg);
            }
        });
    }

    //获取行信息
    function getRow() {
        var dts = $("#ngAdverts").DataTable();
        var rows = dts.rows('.selected').data()[0];
        console.log(rows);
        return rows;
    }

    //删除记录
    $scope.remove = function () {
        var rows = getRow();
        console.log(rows);
        if (rows) {
            var data = {"adId": rows.id, "changedUser": currentuser.userName,"imageId":rows.imageId};

            AdvertService.deleteAdvert(data).then(function (result) {
                console.log(result);
                if (result.responseStatus && result.responseCode == "10000") {
                    toastr.success("删除成功！");
                    datatables.fnUpdate();
                } else {
                    toastr.error("删除失败！" + result.responseMsg);
                }
            });
        } else {
            toastr.info("请选择要删除的记录！");
        }
    }

    //重置文本输入
    $scope.reset = function () {
        $scope.viewModel = {Name: "", Type: ""};
    }

    //根据条件查询
    $scope.query = function () {
        datatables.fnUpdate();

    };

    // Init Datatable
    $scope.setTableOptions = {
        "sName": "ads",
        ajax: function (data, callback, settings) {
            console.log(data);
            var param = JSON.stringify({
                adType: $scope.viewModel.Type,
                adName: $scope.viewModel.Name,
                pageNo: (data.start / data.length) + 1,
                pageSize: "10",
                column: data.columns[data.order[0].column].data,
                sort: data.order[0].dir
            });

            $.ajax({
                type: "POST",
                url: AdvertService.getUrl(),
                cache: false,
                data: param,
                contentType: "application/json;",
                success: function (result) {
                    var returnData = {};
                    if (result.body.rows && result.body) {
                        returnData.recordsTotal = result.body.rows;//返回数据全部记录
                        returnData.recordsFiltered = result.body.rows;//后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = result.body.result;//返回的数据列表
                        if (returnData.data != undefined) {
                            callback(returnData);
                        }
                    }
                },
                beforeSend: function (xhr) {
                    let token = currentuser.token;
                    xhr.setRequestHeader("authorization", token);
                }
            });
        }
        ,
        columns: [
            {data: 'id'},
            {data: 'id'},
            {data: 'name'},
            {data: 'adType'},
            {data: 'sort'},
            {data: 'defaultState'},
            {data: 'changedUser'},
            {data: 'isActived'},
            {data: 'changedTime'},
            {data: 'id'}
        ],
        columnDefs: [
            {
                "title": "id",
                targets: 0,
                "bSortable": false,
                "bVisible": false,
                "mRender": function (data) {
                    return data ;
                },
            },
            {
                "title": "选择",
                targets: 1,
                className: 'select-checkbox',
                "sWidth": "5%",
                "bAutoWidth": false,
                "mRender": function () {
                    return null;
                },
            },
            {
                "title": "名称",
                targets: 2,
                "sWidth": "10%"
            },
            {
                "title": "类型",
                targets: 3,
                "sWidth": "10%"
            },
            {
                "title": "排序",
                targets: 4,
                "sWidth": "10%",
                "mRender": function (data) {
                    //  return "<lable class='index' value='" + data + "'>" + (data + 1) + "</lable>";
                    return data ;
                }
            },
            {
                "title": "是否默认",
                targets: 5,
                "sWidth": "10%",
                "mRender": function (data) {
                    if (data == 2) {
                        return "非默认";
                    } else {
                        return "默认";
                    }
                }
            },
            {
                "title": "操作者",
                targets: 6,
                "sWidth": "10%"
            },
            {
                "title": "状态",
                targets: 7,
                "sWidth": "10%",
                "mRender": function (data) {
                    if (data == 0) {
                        return "<lable class='label label-danger'>已禁用</lable>";
                    } else {
                        return "<lable class='label label-success'>已启用</lable>";
                    }
                }
            },
            {
                "title": "创建时间",
                targets: 8,
                "sWidth": "10%",
                "mRender": function (data) {
                    var result = $filter("date")(data, "yyyy-MM-dd");
                    return result;
                }
            },
            {
                "title": "排序",
                targets: 9,
                render: function (data, type, row, meta) {
                    return '<i class="fa fa-bars drag" value="'+data+'"></i>';
                },
                "sWidth": "10%"
            }
        ],
        /*   sScrollY: "300px",
         sScrollX: "100%",
         sScrollXInner: "150%",*/
        bScrollCollapse: true,//保持必要的宽度
        bPaginate: true,//是否有分页
        rowReorder: true,
      /*  bLengthChange: true,
        aLengthMenu: [10,15,20],
        iDisplayLength: 10,*/

        /* column: {rightColumns: 1}, //固定的列数*/
        //  data: result,
        "fnInitComplete": function () {
            $("#ngAdverts tbody").sortable();
            $("#ngAdverts tbody").disableSelection();
            datatables = $("#ngAdverts").dataTable();
            console.log(datatables);
        },
        "order": [[ 4, "asc" ]]
    };

}
angular.module("controller").controller("AdvertController", AdvertController)
