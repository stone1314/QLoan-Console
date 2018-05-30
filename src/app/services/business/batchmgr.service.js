/**
 * Created by Medooo on 17/6/16
 * batchmgr sevice
 */

import {BaseApiMethod, BaseService} from './business.service';
//【自动提示,自动Loading】 第一步   添加 mixin和decorator 引入
import autoTipMixin from '../mixin/autotip.mixin';
import autotip from '../decorator/autotip.decorator';
import autotipClass from '../decorator/autotipClass.decorator'
import autoloadingMixin from '../mixin/autoloading.mixin';
import autoloading from '../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

// 批量关联的 APP ID 数据
let _appIdList = [
    {
        dataCode: "1",
        dataName: "应用1"
    }
    ,
    {
        dataCode: "2",
        dataName: "应用2"
    }
    ,
    {
        dataCode: "3",
        dataName: "应用3"
    }
];

//批量状态数据
let _jobStatusList = [
    {
        dataCode: "1",
        dataName: "启用"
    },
    {
        dataCode: "2",
        dataName: "禁用"
    }
];

//批量列表数据
let _jobList = [
    {
        id: 1,
        jobName: "批量1",
        appId: "1",
        jobSchedule: { // 批量执行计划
            type: "1",
            startDateTime: 1499152225028,
        },
        lastExecuteTime: 1499151225028, // 上次执行时间
        lastExecuteResult: "1", // 上次执行结果
        jobStatus: "1"
    },
    {
        id: 2,
        jobName: "批量2",
        appId: "2",
        jobSchedule: { // 批量执行计划
            type: "2",
            startDateTime: 1499152225028,
            repeatInterval: "1",
        },
        lastExecuteTime: 1499151225028, // 上次执行时间
        lastExecuteResult: "2", // 上次执行结果
        jobStatus: "1"
    },
    {
        id: 3,
        jobName: "批量3",
        appId: "1",
        jobSchedule: { // 批量执行计划
            type: "3",
            startDateTime: 1499152225028,
            repeatInterval: "1",
            week: ["0"],
        },
        lastExecuteTime: 1499151225028, // 上次执行时间
        lastExecuteResult: "0", // 上次执行结果
        jobStatus: "2"
    },
    {
        id: 4,
        jobName: "批量4",
        appId: "1",
        jobSchedule: { // 批量执行计划
            "type": "4",
            "startDateTime": 1499152225028,
            "repeatInterval": "1",
            "month": ["1", "2"],
            "dayOfMonth": ["5", "6", "7"],
        },
        lastExecuteTime: "", // 上次执行时间
        lastExecuteResult: "", // 上次执行结果
        jobStatus: "1"
    },
];

// 批量的执行计划类型
let _jobScheduleTypeList = [
    {
        dataCode: "1",
        dataName: "一次"
    },
    {
        dataCode: "2",
        dataName: "每天"
    },
    {
        dataCode: "3",
        dataName: "每周"
    },
    {
        dataCode: "4",
        dataName: "每月"
    },
];

// 上次执行结果的状态列表
let _lastExecuteResultList = [
    {
        dataCode: "0",
        dataName: "正在运行"
    },
    {
        dataCode: "1",
        dataName: "执行成功"
    },
    {
        dataCode: "2",
        dataName: "执行失败"
    }
];

// 查找：根据 id 查找 Job
function findJobById(id) {
    return _jobList.find((obj) => obj.id === id);
}
// 查找：根据 id 查找批量索引
function getJobIndexById(id) {
    return _jobList.findIndex((obj) => obj.id === id);
}

// 添加：添加批量
function addJob(data) {
    _jobList.push({
        id: _jobList.length + 1,
        jobName: data.jobName,
        appId: data.appId,
        jobSchedule: data.jobSchedule, // 批量执行计划
        jobStatus: data.jobStatus
    });

    return 200;
}

// 更新：修改指定 id 的批量
function updateJob(job) {
    let obj = findJobById(job.id);
    if (obj) {
        obj.jobName = job.jobName;
        obj.appId = job.appId;
        obj.jobSchedule = job.jobSchedule; // 批量执行计划
        obj.jobStatus = job.jobStatus;
        return 200;
    }
    return 404;
}

// 删除：删除指定 id 的批量
function deleteJobById(id) {
    let index = getJobIndexById(id);
    if (index !== -1) {
        _jobList.splice(index, 1);
        return 200;
    }
    return 404;
}


// 获取批量关联的 APP ID Response 内容
let _testGetAppIdListResponse = {
    code: 200,
    result: _appIdList
};

// 获取批量状态列表 Response 内容
let _testGetJobStatusListResponse = {
    code: 200,
    result: _jobStatusList
};

// 获取批量列表 Response 内容
let _testGetJobListResponse = {
    code: 200,
    result: {
        result: _jobList
    }
};

// 获取批量的执行计划类型内容
let _testGetJobScheduleTypeListResponse = {
    code: 200,
    result: _jobScheduleTypeList
};

// 获取上次执行结果的状态列表内容
let _testGetLastExecuteResultListResponse = {
    code: 200,
    result: _lastExecuteResultList
};

class ApiMethod extends BaseApiMethod {

    /*批量类型*/
    getAppIdList() {
        // return this.get("GET_JOB_TYPE");

        return Promise.resolve(_testGetAppIdListResponse);
    }

    /*批量状态列表*/
    getJobStatus() {
        // return this.get("GET_JOB_STATUS");

        return Promise.resolve(_testGetJobStatusListResponse);
    }

    /*批量的执行计划类型列表*/
    getJobScheduleTypeList() {
        return Promise.resolve(_testGetJobScheduleTypeListResponse);
    }

    /*上次执行结果的状态列表*/
    getLastExecuteResultList() {
        return Promise.resolve(_testGetLastExecuteResultListResponse);
    }

    /*获取批量列表*/
    getJobList(data) {
        // return this.post("GET_JOB_LIST", data);

        // console.log('------------------------------');
        // console.log("appId: ", data.appId);
        // console.log("jobName: ", data.jobName);
        // console.log("jobStatus: ", data.jobStatus);

        let newObjList = [];
        for (let v of _jobList) {
            if (data.appId && v.appId !== data.appId) {
                // 筛选批量关联的 APP ID
                continue;
            }
            if (data.jobName && !v.jobName.includes(data.jobName)) {
                // 筛选批量名称
                continue;
            }
            if (data.lastExecuteResult && v.lastExecuteResult !== data.lastExecuteResult) {
                // 筛选上次执行结果
                continue;
            }
            if (data.jobStatus && v.jobStatus !== data.jobStatus) {
                // 筛选批量状态
                continue;
            }
            newObjList.push(v);
        }
        _testGetJobListResponse.result.result = newObjList;

        let itemCount = _testGetJobListResponse.result.result.length;
        let pageSize = parseInt(data.pageSize);
        if (itemCount) {
            _testGetJobListResponse.result.pageTotal = itemCount <= pageSize ? 1 : parseInt(itemCount / pageSize) + 1;
        } else {
            _testGetJobListResponse.result.pageTotal = 0;
        }

        return Promise.resolve(_testGetJobListResponse);
    }

    /*根据ID获取批量信息*/
    getJobById(id) {
        // return this.get("VIEW_JOB_BY_ID", "/" + id)

        let response = {
            code: 200,
            result: findJobById(id)
        };

        return Promise.resolve(response);
    }

    /*添加批量*/
    addJob(data) {
        // return this.post("ADD_JOB", data);

        let response = {
            code: addJob(data),
        };

        return Promise.resolve(response);
    }

    /*更新批量*/
    updateJob(data) {
        // return this.post("UPDATE_JOB", data);

        let response = {
            code: updateJob(data),
        };

        return Promise.resolve(response);
    }

    /*运行批量*/
    runJob(id) {
        // return this.get("JOB_RUN_BY_ID", "/" + id);

        let response = {
            code: 200
        };

        return Promise.resolve(response);
    }

    /*删除批量*/
    deleteJob(id) {
        // return this.get("JOB_DELETE_BY_ID", "/" + id);

        let response = {
            code: deleteJobById(id)
        };

        return Promise.resolve(response);
    }
}

//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class BatchMgrService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getAppIdList() {
        return this.api.getAppIdList();
    }

    getJobStatus() {
        return this.api.getJobStatus();
    }

    getJobScheduleTypeList() {
        return this.api.getJobScheduleTypeList();
    }

    getLastExecuteResultList() {
        return this.api.getLastExecuteResultList();
    }

    getJobList(data) {
        return this.api.getJobList(data);
    }

    @autoloading
    getJobById(id) {
        return this.api.getJobById(id)
    }

    @autoloading
    addJob(data) {
        return this.api.addJob(data);
    }

    @autoloading
    updateJob(data) {
        return this.api.updateJob(data);
    }

    @autoloading
    runJob(id) {
        return this.api.runJob(id);
    }

    @autoloading
    deleteJob(id) {
        return this.api.deleteJob(id);
    }
}

angular.module('biz-services').factory("BatchMgrService", ["UtilsService", "toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new BatchMgrService(UtilsService, toastr, LoadingService);
}]);
