/**
 * Created by HaihuaHuang on 2017/8/15.
 */


import {BaseApiMethod, BaseService} from '../business.service';

class ApiMethod extends BaseApiMethod {

    //根据身份信息查询认证信息
    getCertifyById(data){
        return this.post("GET_CERTIFY", data, "");
    }

    getCustomer(data){
        return this.post("GET_CUSTOMERINFO",data);
    }

    getProductLogo(){
        return this.post("GET_PRODUCTLOGO");
    }

    getProductByLogo(data){
        return this.post("GET_PRODUCT",data);
    }

    getUrl(){
        return this.getIpName("GET_CUSTOMERLIST");
    }
}


class CustomerService {
    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);
    }

    getCertifyById(data){
        return this.api.getCertifyById(data);
    }

    getCustomer(data) {
        return this.api.getCustomer(data);
    }

    getProductLogo(){
        return this.api.getProductLogo();
    }

    getProductByLogo(data){
        return this.api.getProductByLogo(data);
    }
    getUrl(){
        return this.api.getUrl();
    }
}
angular.module('biz-services').factory("CustomerService", ["UtilsService", function (UtilsService) {
    return new CustomerService(UtilsService);
}]);