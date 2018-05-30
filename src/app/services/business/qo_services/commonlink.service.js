/**
 * Created by HaihuaHuang on 2017/8/21.
 */

import {BaseApiMethod, BaseService} from '../business.service';

class ApiMethod extends BaseApiMethod {

    deleteLink(id) {
        return this.post("DELTET_LINK","", id);
    }

    addLink(data) {
        return this.post("ADD_LINK", data);
    }

    getLink(id) {
        return this.post("GET_LINK", "", id);
    }

    updateLink(data) {
        return this.post("UPDATE_LINK", data);
    }

    updateLinkSort(data) {
        return this.post("UPDATE_LINKSORT", data);
    }

    getUrl(){
        return this.getIpName("GET_LINLS");
    }

}


class CommonLinkService {
    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);
    }

    deleteLink(data) {
        return this.api.deleteLink(data);
    }

    addLink(data) {
        return this.api.addLink(data);
    }

    getLink(id) {
        return this.api.getLink(id);
    }

    updateLink(data) {
        return this.api.updateLink(data);
    }

    updateLinkSort(data) {
        return this.api.updateLinkSort(data);
    }

    getUrl(){
        return this.api.getUrl();
    }

}
angular.module('biz-services').factory("CommonLinkService", ["UtilsService", function (UtilsService) {
    return new CommonLinkService(UtilsService);
}]);
