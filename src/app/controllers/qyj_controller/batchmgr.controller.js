/**
 * Created by Medooo Tang on 17/6/16
 * batchmgr controller
 */
import * as constant from '../../constant';
import batchMgrTpl from "../../templates/modal-batchmgr-add.html";
BatchMgrController.$inject = ['$scope', 'toastr', '$filter', '$timeout', '$rootScope', '$uibModal', '$state', 'BatchMgrService'];

function BatchMgrController($scope, toastr, $filter, $timeout, $rootScope, $uibModal, $state, BatchMgrService) {

    let dateFilter = $filter('date');
    $scope.viewModel = {
        jobList: {}, // 批量列表
        // 下拉列表数据
        dropDown: {
            appIdList: [], // APP ID 列表
            jobStatusList: [], //批量状态列表
            jobScheduleTypeList: [], // 批量的执行计划类型列表
            lastExecuteResultList: [], // 上次执行结果的状态列表
        },
        // 查询条件
        query: {
            appId: "",
            jobName: "",
            lastExecuteResult: "",
            jobStatus: "",
        },
    };


    /**
     * 页面初始化
     */
    $scope.init = function () {
        getAppIdList($scope, null); // 获取 APP ID 列表
        getJobStatusList($scope, null); // 获取批量的状态类型
        getLastExecuteResultList($scope, null); // 获取上次执行结果的类型

        // 请求首页数据
        getJobList();
    };


    /**
     * 加载分页数据
     */
    $scope.$on("dr.reloadPagination", function (scope, pageNo, pageSize) {
        getJobList(pageNo, pageSize);
    });


    /**
     * 获取查询条件
     * @param pageNo
     * @param pageSize
     */
    let getQueryData = function (pageNo = 1, pageSize = 10) {
        let formData = {
            "pageSize": pageSize,
            "pageNo": pageNo,
        };

        if ($scope.viewModel.query.appId !== undefined) {
            formData["appId"] = $scope.viewModel.query.appId;
        }
        if ($scope.viewModel.query.jobName !== undefined && $scope.viewModel.query.jobName.trim() !== "") {
            formData["jobName"] = $scope.viewModel.query.jobName.trim();
        }
        if ($scope.viewModel.query.lastExecuteResult !== undefined) {
            formData["lastExecuteResult"] = $scope.viewModel.query.lastExecuteResult;
        }
        if ($scope.viewModel.query.jobStatus !== undefined) {
            formData["jobStatus"] = $scope.viewModel.query.jobStatus;
        }

        return formData;
    };


    /**
     * 获取批量列表
     * @param pageNo
     * @param pageSize
     * @param reInit
     */
    let getJobList = function (pageNo = 1, pageSize = 10, reInit = true) {
        let formData = getQueryData(pageNo, pageSize);

        BatchMgrService.getJobList(formData)
            .then(function (data) {
                if (data && data.code == 200) {
                    //绑定数据
                    $scope.tableData = data.result;
                    if (reInit) {
                        $timeout(function () {
                            $rootScope.$broadcast('modelInitialized', this);
                        }, 500);
                    }
                }
            })
    };
    $scope.getJobList = getJobList;


    /**
     * 获取执行计划的类型
     * @param scope
     * @param pageType
     */
    let getJobScheduleTypeList = function (scope, pageType) {
        BatchMgrService.getJobScheduleTypeList()
            .then(function (data) {
                if (data && data.code == 200) {
                    if (pageType == "add") {
                        scope.viewModel.postData.jobSchedule.type = data.result[0].dataCode;  // 默认选中第一个
                    }
                    scope.viewModel.dropDown.jobScheduleTypeList = data.result;
                }
            });
    };


    /**
     * 获取上次执行结果的类型
     * @param scope
     * @param pageType
     */
    let getLastExecuteResultList = function (scope, pageType) {
        BatchMgrService.getLastExecuteResultList()
            .then(function (data) {
                if (data && data.code == 200) {
                    if (pageType == "add") {
                        scope.viewModel.postData.jobSchedule.lastExecuteResult = data.result[0].dataCode;  // 默认选中第一个
                    }
                    scope.viewModel.dropDown.lastExecuteResultList = data.result;
                }
            });
    };


    /**
     * 获取批量的状态类型
     * @param scope
     * @param pageType
     */
    let getJobStatusList = function (scope, pageType) {
        BatchMgrService.getJobStatus()
            .then(function (data) {
                if (data && data.code == 200) {
                    if (pageType == "add") {
                        scope.viewModel.postData.jobStatus = data.result[0].dataCode;  // 默认选中第一个
                    }
                    scope.viewModel.dropDown.jobStatusList = data.result;
                }
            });
    };


    /**
     * 获取支持的 APP ID 列表
     * @param scope
     * @param pageType
     */
    let getAppIdList = function (scope, pageType) {
        BatchMgrService.getAppIdList()
            .then(function (data) {
                if (data && data.code == 200) {
                    if (pageType == "add") {
                        scope.viewModel.postData.appId = data.result[0].dataCode;  //默认选中第一个
                    }
                }
                scope.viewModel.dropDown.appIdList = data.result;
            });
    };


    /**
     * 根据 ID 获取批量详情
     * @param scope
     * @param pageType
     * @param id
     */
    let getJobInfo = function (scope, pageType, id) {
        BatchMgrService.getJobById(id)
            .then(function (data) {
                if (data.code != 200) {
                    toastr.warning(data.msg, "Warning");
                    return;
                }

                //赋值操作
                let result = data.result;
                scope.viewModel.postData.id = result.id;
                scope.viewModel.postData.jobName = result.jobName;
                scope.viewModel.postData.appId = result.appId;
                scope.viewModel.postData.jobSchedule = angular.copy(result.jobSchedule);

                $scope.weekListDynamic = angular.copy($scope.weekList);
                $scope.monthListDynamic = angular.copy($scope.monthList);
                $scope.dayOfMonthListDynamic = angular.copy($scope.dayOfMonthList);

                if (scope.viewModel.postData.jobSchedule.week) {
                    for (let v of scope.viewModel.postData.jobSchedule.week) {
                        let index = scope.weekListDynamic.findIndex((obj) => obj.value == v);
                        if (index !== -1) {
                            scope.weekListDynamic[index].selected = true;
                        }
                      //  console.log("周：", index, v);
                    }
                }
                if (scope.viewModel.postData.jobSchedule.month) {
                    for (let v of scope.viewModel.postData.jobSchedule.month) {
                        let index = scope.monthListDynamic.findIndex((obj) => obj.value == v);
                        if (index !== -1) {
                            scope.monthListDynamic[index].selected = true;
                        }
                       // console.log("月：", index, v);
                    }
                }
                if (scope.viewModel.postData.jobSchedule.dayOfMonth) {
                    for (let v of scope.viewModel.postData.jobSchedule.dayOfMonth) {
                        let index = scope.dayOfMonthListDynamic.findIndex((obj) => obj.value == v);
                        if (index !== -1) {
                            scope.dayOfMonthListDynamic[index].selected = true;
                        }
                      //  console.log("第几天：", index, v);
                    }
                }
                scope.viewModel.postData.jobStatus = result.jobStatus;

                // console.log("选择的周：", scope.weekListSelected);
                // console.log("选择的月：", scope.monthListSelected);
                // console.log("选择的天", scope.dayOfMonthListSelected);
                // console.log("---------------------");
                // console.log("星期数据：", scope.weekListDynamic);
                // console.log("月份数据:", scope.monthListDynamic);
                // console.log("天数据：", scope.dayOfMonthListDynamic);
                // console.log("scope.viewModel.postData --- ", scope.viewModel.postData);
                // console.log("jobSchedule --- ", scope.viewModel.postData.jobSchedule);
            });
    };


    /**
     * 对要提交的数据进行验证
     * @param scope
     * @returns {boolean}
     */
    let formDataValidate = function (scope) {
      //  console.log("数据验证：", scope.viewModel.postData);
        let numberRegex = /^\d+$/;
        if (scope.viewModel.postData.jobName === undefined || scope.viewModel.postData.jobName.trim() === "") {
            toastr.error("请输入批量名称！");
            return false;
        }
        if (scope.viewModel.postData.appId === undefined) {
            toastr.error("请选择关联的 APP ID！");
            return false;
        }
        if (scope.viewModel.postData.jobSchedule === undefined
            || scope.viewModel.postData.jobSchedule.type === undefined
            || scope.viewModel.postData.jobSchedule.startDateTime === null) {
            toastr.error("请选择执行计划！");
            return false;
        }
        // 重复执行间隔（按天、按周）
        if (["2", "3"].includes(scope.viewModel.postData.jobSchedule.type)
            && !numberRegex.test(scope.viewModel.postData.jobSchedule.repeatInterval)) {
            toastr.error("请输入重复执行间隔！");
            return false;
        }
        // 按周
        if (scope.viewModel.postData.jobSchedule.type === "3" && scope.weekListSelected.length === 0) {
            toastr.error("请选择执行星期！");
            return false;
        }
        // 按月
        if (scope.viewModel.postData.jobSchedule.type === "4" && scope.monthListSelected.length === 0) {
            toastr.error("请选择执行月份！");
            return false;
        }
        if (scope.viewModel.postData.jobSchedule.type === "4" && scope.dayOfMonthListSelected.length === 0) {
            toastr.error("请选择在月份中的第几天执行！");
            return false;
        }
        if (scope.viewModel.postData.jobStatus === undefined) {
            toastr.error("请选择批量状态！");
            return false;
        }

        return true;
    };


    /**
     * 返回验证通过数据，未验证通过返回 null
     * @param scope
     * @returns {*}
     */
    let getValidatedFormData = function (scope) {
        let formData = null;

        if (formDataValidate(scope)) {
            scope.viewModel.postData.jobSchedule.week = [];
            for (let v of scope.weekListSelected) {
                scope.viewModel.postData.jobSchedule.week.push(v.value);
            }

            scope.viewModel.postData.jobSchedule.month = [];
            for (let v of scope.monthListSelected) {
                scope.viewModel.postData.jobSchedule.month.push(v.value);
            }

            scope.viewModel.postData.jobSchedule.dayOfMonth = [];
            for (let v of scope.dayOfMonthListSelected) {
                scope.viewModel.postData.jobSchedule.dayOfMonth.push(v.value);
            }

            formData = {
                "id": scope.viewModel.postData.id, // ID
                "jobName": scope.viewModel.postData.jobName.trim(), // 批量名称
                "appId": scope.viewModel.postData.appId, // 批量关联的APPID
                "jobSchedule": { // 执行计划
                    type: scope.viewModel.postData.jobSchedule.type,
                    startDateTime: scope.viewModel.postData.jobSchedule.startDateTime,
                    repeatInterval: scope.viewModel.postData.jobSchedule.repeatInterval,
                    week: scope.viewModel.postData.jobSchedule.week,
                    month: scope.viewModel.postData.jobSchedule.month,
                    dayOfMonth: scope.viewModel.postData.jobSchedule.dayOfMonth,
                },
                "jobStatus": scope.viewModel.postData.jobStatus, // 批量状态
            };
        }

      //  console.log("FormData: ", formData);

        return formData;
    };


    /**
     * 新增/编辑 Job-modal
     * */
    $scope.openJobModal = function (pageType, id) {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: batchMgrTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.viewModel = {
                    pageTitle: "",
                    dropDown: {
                        appIdList: [], // APP ID 列表
                        jobStatusList: [], //批量状态列表
                        jobScheduleTypeList: [], // 批量的执行计划类型列表
                        lastExecuteResultList: []
                    },
                    postData: {
                        jobName: "", //批量名称
                        appId: "", // APP ID
                        jobSchedule: {
                            type: "",
                            startDateTime: (new Date()).setMinutes(0),
                            repeatInterval: "",
                            week: [],
                            month: [],
                            dayOfMonth: [],
                        }, // 执行计划
                        jobStatus: "" //批量状态
                    },
                    pageType: pageType,
                };

                if (pageType === "add") {
                    $scope.viewModel.postData.jobSchedule.repeatInterval = 1;
                }

                // 本地化多选下拉框
                $scope.localLang = {
                    selectAll: "全选",
                    selectNone: "全不选",
                    reset: "重置",
                    search: "搜索...",
                    nothingSelected: "请选择",
                };
                // 星期静态数据
                $scope.weekList = [
                    {value: "0", name: "周日",},
                    {value: "1", name: "周一",},
                    {value: "2", name: "周二",},
                    {value: "3", name: "周三",},
                    {value: "4", name: "周四",},
                    {value: "5", name: "周五",},
                    {value: "6", name: "周六",},
                ];
                $scope.weekListDynamic = angular.copy($scope.weekList);
                // 月份静态数据
                $scope.monthList = [];
                for (let i = 1; i <= 12; i++) {
                    $scope.monthList.push({value: i.toString(), name: i + "月",});
                }
                $scope.monthListDynamic = angular.copy($scope.monthList);
                // 月份中的天数
                $scope.dayOfMonthList = [];
                for (let i = 1; i <= 31; i++) {
                    $scope.dayOfMonthList.push({value: i.toString(), name: i.toString(),});
                }
                $scope.dayOfMonthList.push({value: -1, name: "最后一天",});
                $scope.dayOfMonthListDynamic = angular.copy($scope.dayOfMonthList);

                // 选中的星期数据
                $scope.weekListSelected = [];
                // 选中的月份数据
                $scope.monthListSelected = [];
                // 按月时，每月的第几天
                $scope.dayOfMonthListSelected = [];

                $scope.onIstevenClose = function () {
                    // console.log($scope);
                    // console.log("Week: ", $scope.weekListSelected);
                    // console.log("Month: ", $scope.monthListSelected);
                    // console.log("DayOfMonth: ", $scope.dayOfMonthListSelected);
                };

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

                getAppIdList($scope, pageType);
                getJobStatusList($scope, pageType);
                getJobScheduleTypeList($scope, pageType);

                if (pageType !== "add") {
                    getJobInfo($scope, pageType, id);
                }

                let dismissModal = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.ok = function () {
                    if (pageType === "add") {
                        addJob($scope, dismissModal); // 添加渠道
                    } else if (pageType === "edit") {
                        updateJob($scope, dismissModal); // 编辑渠道
                    }
                };

                $scope.cancel = dismissModal;
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


    /**
     * 添加批量
     * @param scope
     * @param callback
     * @returns {boolean}
     */
    let addJob = function (scope, callback) {
        let formData = getValidatedFormData(scope);
        if (!formData) {
            return false;
        }

        BatchMgrService.addJob(formData)
            .then(function (data) {
                if (data && data.code == 200) {
                    toastr.success("添加成功！", "Success");
                    callback();
                    getJobList();
                } else {
                    toastr.error("添加失败！到服务器的请求异常，请稍后再试！", "Error");
                }
            })
            .catch(function (error) {
                toastr.error(error, "Error");
            });
    };


    /**
     * 修改制定 ID 的批量
     * @param scope
     * @param callback
     * @returns {boolean}
     */
    let updateJob = function (scope, callback) {
        let formData = getValidatedFormData(scope);
        if (!formData) {
            return false;
        }

        BatchMgrService.updateJob(formData)
            .then(function (data) {
                if (data && data.code == 200) {
                    toastr.success("修改成功！", "Success");
                    callback();
                    getJobList();
                } else {
                    toastr.error("修改失败！到服务器的请求异常，请稍后再试！", "Error");
                }
            })
            .catch(function (error) {
                toastr.error(error, "Error");
            });
    };


    /**
     * 删除指定 ID 的批量
     * */
    $scope.deleteJob = function (id) {
        BatchMgrService.deleteJob(id)
            .then(function (data) {
                if (data && data.code == 200) {
                    toastr.success("批量删除成功！", "Success");
                    getJobList();
                } else {
                    toastr.error("删除失败！到服务器的请求异常，请稍后再试！", "Error");
                }
            })
            .catch(function (error) {
             //   console.log('[ERROR] ', error);
                toastr.error(error, "Error");
            });
    };


    /**
     * 运行指定 ID 的批量
     * */
    $scope.runJob = function (id) {
        BatchMgrService.runJob(id)
            .then(function (data) {
                if (data && data.code == 200) {
                    toastr.success("批量执行请求已发送！", "Success");
                    getJobList();
                } else {
                    toastr.error("执行失败！到服务器的请求异常，请稍后再试！", "Error");
                }
            })
            .catch(function (error) {
              //  console.log('[ERROR] ', error);
                toastr.error(error, "Error");
            });
    };
}


function filterAppIdMapping() {
    let ret = function (obj) {
        let newObj = "";

        if (obj === "1") {
            newObj = '应用1';
        } else if (obj === "2") {
            newObj = "应用2";
        } else if (obj === "3") {
            newObj = "应用3";
        } else {
            newObj = '未知类型';
        }

        return newObj;
    };

    return ret;
}
function filterJobStatusMapping() {
    let ret = function (obj) {
        let newObj = "";

        if (obj === "1") {
            newObj = '启用';
        } else if (obj === "2") {
            newObj = '禁用';
        } else {
            newObj = "未知状态";
        }

        return newObj;
    };

    return ret;
}
function filterLastExecuteResultMapping() {
    let ret = function (obj) {
        let newObj = "";

        if (obj === "0") {
            newObj = '正在运行';
        } else if (obj === "1") {
            newObj = '执行成功';
        } else if (obj === "2") {
            newObj = '执行失败';
        } else {
            newObj = "未知状态";
        }

        return newObj;
    };

    return ret;
}
function filterJobScheduleMapping($filter) {
    let dateFilter = $filter('date');

    let ret = function (obj) {
        let newObj = "";

        if (obj.type === "1") {
            newObj = '一次，';
        } else if (obj.type === "2") {
            newObj = '每 ' + obj.repeatInterval + ' 天的 ';
        } else if (obj.type === "3") {
            newObj = '每周 ';
            for (let v of obj.week) {
                newObj = newObj + v + ",";
            }
            newObj = newObj.replace(/,$/, '');
            newObj += " 的 ";
        } else if (obj.type === "4") {
            newObj = '每 ';
            for (let v of obj.month) {
                newObj = newObj + v + ",";
            }
            newObj = newObj.replace(/,$/, '');
            newObj += " 月的第 ";
            for (let v of obj.dayOfMonth) {
                newObj = newObj + v + ",";
            }
            newObj = newObj.replace(/,$/, '');
            newObj += " 天的 ";
        } else {
            newObj = "";
        }

        if (newObj !== "") {
            newObj = newObj + dateFilter(obj.startDateTime, "yyyy-MM-dd HH:mm");
        }

        return newObj;
    };

    return ret;
}

angular.module('controller').controller("BatchMgrController", BatchMgrController)
    .filter('filterAppIdMapping', filterAppIdMapping)
    .filter('filterJobStatusMapping', filterJobStatusMapping)
    .filter('filterLastExecuteResultMapping', filterLastExecuteResultMapping)
    .filter('filterJobScheduleMapping', filterJobScheduleMapping);
