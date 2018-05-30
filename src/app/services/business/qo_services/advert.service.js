/**
 * Created by HaihuaHuang on 2017/8/8.
 */


import {BaseApiMethod, BaseService} from '../business.service';

class ApiMethod extends BaseApiMethod {

    deleteAdvert(data) {
        return this.post("DEl_ADVERT", data);
    }

    addAdvert(data){
        return this.post("ADD_ADVERT",data);
    }

    getAdvert(id){
        return this.post("GET_ADVERT","",id);
    }

    updateAdvert(data){
        return this.post("UPDATE_ADVERT",data);
    }

    updAdvertBatch(data){
        return this.post("UPDATE_ADVERTBATCH",data);
    }

    getUrl(){
        return this.getIpName("GET_ADVERTLIST");
    }


}


class AdvertService  {
    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);

    }

    deleteAdvert(data){
        return this.api.deleteAdvert(data);
    }

    addAdvert(data) {
        return this.api.addAdvert(data);
    }

    getAdvert(id){
        return this.api.getAdvert(id);
    }

    updateAdvert(data){
        return this.api.updateAdvert(data);
    }

    updAdvertBatch(data){
        return this.api.updAdvertBatch(data);
    }

    getUrl(){
        return this.api.getUrl();
    }

}
angular.module('biz-services').factory("AdvertService", ["UtilsService", function (UtilsService) {
    return new AdvertService(UtilsService);
}]);
