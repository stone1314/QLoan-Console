/**
 * Created by HaihuaHuang on 2017/8/16.
 */


import {BaseApiMethod, BaseService} from '../business.service';

class ApiMethod extends BaseApiMethod {

    //根据身份信息查询认证信息
    getRelationShip(data) {
        return this.post("REDIOS_API", data);
    }

    getCityList(data) {
        return this.post("GET_CITYLIST", data);
    }

    getDepment(data){
        return this.post("GET_DEPMENT",data);
    }

}


class CommonService {
    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);
    }

    //获取关系对应值
    getRelationShip() {
        var data = {"prefix": "Qone", "code": "STAFF_RELATIONSHIP", "dataVersion": "2"};
        return this.api.getRelationShip(data);
    }

    //认证结果对应关系值
    getCertifyStateMap(){
        var data={"prefix": "Qone", "code": "CERTIFY_STATUS", "dataVersion": "2"};
        return this.api.getRelationShip(data);
    }

    getCityList(data) {
        return this.api.getCityList(data);
    }

    getDepment(data){
        return this.api.getDepment(data);
    }
}
angular.module('biz-services').factory("CommonService", ["UtilsService", function (UtilsService) {
    return new CommonService(UtilsService);
}]);