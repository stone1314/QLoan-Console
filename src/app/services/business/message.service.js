/**
 * Created by HaihuaHuang on 2017/7/1.
 */


import {BaseApiMethod, BaseService} from './business.service';

class ApiMethod extends BaseApiMethod {

    /*获取用户信息列表*/
    sendMessage(data) {
        return this.post("SEND_MESSAGE", data);
    }
}

class MessageService {
    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);
    }

    sendMessage(data) {
        return this.api.sendMessage(data);
    }
}
angular.module('biz-services').factory("MessageService", ["UtilsService", function (UtilsService) {
    return new MessageService(UtilsService);
}]);
