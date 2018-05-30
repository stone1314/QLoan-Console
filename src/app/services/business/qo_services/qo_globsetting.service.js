/**
 * Created by HaihuaHuang on 2017/8/21.
 */


import {BaseApiMethod, BaseService} from '../business.service';

class ApiMethod extends BaseApiMethod {

    addUpdateSetting(data) {
        return this.post("UPDATE_GLOBALSETTINF", data);
    }

    getSetting(id) {
        return this.post("GET_SETTINGBYID", "", id);
    }

    removeCache(){
        return this.post("CLEAR_CACHE","");
    }

    getUrl(){
        return this.getIpName("GLOBAL_SETTINGLIST");
    }
}


class Qo_GlobSettingService {
    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);
    }

    addUpdateSetting(data) {
        return this.api.addUpdateSetting(data);
    }

    getSetting(id) {
        return this.api.getSetting(id);
    }

    removeCache(){
        return this.api.removeCache();
    }

    getUrl(){
        return this.api.getUrl();
    }

}
angular.module('biz-services').factory("Qo_GlobSettingService", ["UtilsService", function (UtilsService) {
    return new Qo_GlobSettingService(UtilsService);
}]);
