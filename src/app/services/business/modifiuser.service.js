/**
 * Created by HaihuaHuang on 2017/6/27.
 */

import {BaseApiMethod, BaseService} from './business.service';

class ApiMethod extends BaseApiMethod {

    /*获取用户信息列表*/
    getUserInfoList(data) {
        return this.post("GET_USERINFOLIST", data);
    }

    unlockAccount(userId) {
        return this.get("GET_UNLOCKACCOUNT", userId);
    }

    /*获取用户登录日志*/
    getUserLoginLog(data) {
        return this.post("GET_LOGINLOG", data);
    }
}


class ModifiUserService {
    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);
    }

    getUserInfoList(data) {
        return this.api.getUserInfoList(data);
    }

    unlockAccount(userId) {
        return this.api.unlockAccount(userId);
    }

    getUserLoginLog(data) {
        return this.api.getUserLoginLog(data);
    }

}
angular.module('biz-services').factory("ModifiUserService", ["UtilsService", function (UtilsService) {
    return new ModifiUserService(UtilsService);
}]);
