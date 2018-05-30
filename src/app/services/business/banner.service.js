import {BaseApiMethod,BaseService} from './business.service';

class ApiMethod extends BaseApiMethod{
    // 创建BANNER
    createBanner(data){
        return this.post("BANNER_CREATE",data);
    }
    // 更新BANNER
    updateBanner(data){
        return this.post("BANNER_UPDATE",data);
    }
    // 删除Banner 信息
    deleteBanner(id){
        return this.get("BANNER_DELETE_BY_ID","/"+id);
    }
    // 获取Banner列表
    getBannerList(data){
        return this.post("GET_BANNER_LIST",data);
    }
}

class BannerImageService extends BaseService{
    constructor(UtilsService){
        super();
        this.api = new ApiMethod(UtilsService);
    }
    createBanner(data){
        return this.api.createBanner(data);
    }
    updateBanner(data){
        return this.api.updateBanner(data);
    }
    deleteBanner(id){
        return this.api.deleteBanner(id);
    }
    getBannerList(data){
        return this.api.getBannerList(data);
    }
}

angular.module('biz-services').factory('BannerImageService',["UtilsService",
        function(UtilsService){
           return new BannerImageService(UtilsService);
}]);
