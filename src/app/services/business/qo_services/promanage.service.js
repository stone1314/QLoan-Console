/**
 * Created by HaihuaHuang on 2017/8/11.
 */

import {BaseApiMethod, BaseService} from '../business.service';

class ApiMethod extends BaseApiMethod {
    getPromanage(data) {
        return this.post("GET_PRO", data);
    }

    updatePromanageState(data) {
        return this.post("UPDATE_PROSTATE", data);
    }

    synPro(data) {
        return this.get("SYN_PRODUCT");
    }

    /* getCityList(data) {
     return this.post("GET_CITYLIST", data);
     }*/

    updateProDepMap(data) {
        return this.post("UPDATE_PRODEPMAP", data);
    }

    getUrl() {
        return this.getIpName("GET_PRODUCTLIST");
    }

}


class PromanageService {
    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);
    }

    getPromanage(data) {
        return this.api.getPromanage(data);
    }

    updatePromanageState(data) {
        return this.api.updatePromanageState(data);
    }

    synPro(data) {
        return this.api.synPro(data);
    }

    /*  getCityList(data) {
     return this.api.getCityList(data);
     }*/

    updateProDepMap(data) {
        return this.api.updateProDepMap(data);
    }

    getUrl(){
        return this.api.getUrl();
    }

}
angular.module('biz-services').factory("PromanageService", ["UtilsService", function (UtilsService) {
    return new PromanageService(UtilsService);
}]);