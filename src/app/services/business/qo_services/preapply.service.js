/**
 * Created by MingyueZhang on 2017/8/15.
 */
import {BaseApiMethod, BaseService} from '../business.service';

class ApiMethod extends BaseApiMethod {

    getAllProduct(data){
        return this.post("GETALLPRODUCT",data);
    }
    getProductByLogo(data){
        return this.post("GETPRODUCTBYLOGO",data);
    }
    getAllPreStatus(data){
        return this.post("GETPRESTATUS",data);
    }
    skipCertify(data){
        return this.post("SKIPCERTIFY",data);
    }
    getAppInfoByPreApplyCode(data){
        return this.post("GETAPPINFOBYPREALLCODE",data);
    }
    getCertifyWithPreAppCode(data){
        return this.post("GETCERTIFYSTATUSBYPREAPPCODE",data);
    }
    getUrl(){
        return this.getIpName("GETPREAPPLIST");
    }

    getProductChangeHistory(data){
        return this.post("GETPRODUCTCHANGEHISTORY",data);
    }

}
class PreApplyService{
    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);
    }
    getAllProduct(data){
        return this.api.getAllProduct(data);
    }

    getProductByLogo(data){
        return this.api.getProductByLogo(data);
    }

    getAllPreStatus(data){
        return this.api.getAllPreStatus(data);
    }
    skipCertify(data){
        return this.api.skipCertify(data);
    }
    getAppInfoByPreApplyCode(data){
        return this.api.getAppInfoByPreApplyCode(data);
    }
    getCertifyWithPreAppCode(data){
        return  this.api.getCertifyWithPreAppCode(data);
    }
    getUrl(){
        return this.api.getUrl();
    }

    getProductChangeHistory(data){
        return this.api.getProductChangeHistory(data);
    }

}
angular.module('biz-services').factory("PreApplyService", ["UtilsService",function (UtilsService) {
    return new PreApplyService(UtilsService);
}]);
