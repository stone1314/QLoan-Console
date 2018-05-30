/**
 * Created by HaihuaHuang on 2017/8/9.
 */


import {BaseApiMethod, BaseService} from '../business.service';

class ApiMethod extends BaseApiMethod {

    deleteDepment(data) {
        return this.post("DEL_DEPMENT", data);
    }

    addDepment(data) {
        return this.post("ADD_DEPMENT", data);
    }

    updateDepment(data) {
        return this.post("UPDATE_DEPMENT", data);
    }

     updateDepmentState(data){
         return this.post("UPDATE_DEPSTATE",data);
     }

    getUrl(){
        return this.getIpName("GET_DEPMENTLIST");
    }

    getDepment(data){
        return this.post("GET_DEPMENT", data);
    }
}


class DepmentService {
    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);
    }

    deleteDepment(id) {
        return this.api.deleteDepment(id);
    }

    addDepment(data) {
        return this.api.addDepment(data);
    }

    updateDepment(data) {
        return this.api.updateDepment(data);
    }

    updateDepmentState(data){
        return this.api.updateDepmentState(data);
    }

    getUrl(){
        return this.api.getUrl();
    }

    getDepment(data){
        return this.api.getDepment(data);
    }
}
angular.module('biz-services').factory("DepmentService", ["UtilsService", function (UtilsService) {
    return new DepmentService(UtilsService);
}]);
