/**
 * Created by MingyueZhang on 2017/8/17.
 */
import {BaseApiMethod, BaseService} from '../business.service';

class ApiMethod extends BaseApiMethod {

    getCacheForPidKey(data){
        return this.post("GETCACHEFORPIDKEY",data);
    }
    getCacheForKey(data){
        return this.post("GETCACHEFORKEY",data);
    }
    addOrUpdateAppStatusMapping(data){
        return this.post("ADDORUPDATEAPPSTATUSMAP",data);
    }
    clearAppStatusCache(data){
        return this.post("CLEARAPPSTATUSCACHE",data);
    }
    getUrl(){
        return this.getIpName("GETSTATUSMAPPINGLIST");
    }
    deleteAppStatusMapping(){
        return this.getIpName("DELETE_APP_STATUSMAPPING");
    }
    getAppStatusMappingById(){
        return this.getIpName("GETAPPSTATUSMAPPINGBYID");
    }


}
class CobraStatusMapService{
    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);
    }
    getCacheForPidKey(data){
        return this.api.getCacheForPidKey(data);
    }
    getCacheForKey(data){
        return this.api.getCacheForKey(data);
    }
    addOrUpdateAppStatusMapping(data){
        return this.api.addOrUpdateAppStatusMapping(data);
    }
    clearAppStatusCache(data){
        return this.api.clearAppStatusCache(data);
    }
    getUrl(){
        return this.api.getUrl();
    }
    deleteAppStatusMapping(){
        return this.api.deleteAppStatusMapping();
    }
    getAppStatusMappingById(){
        return this.api.getAppStatusMappingById();
    }

}
angular.module('biz-services').factory("CobraStatusMapService", ["UtilsService",function (UtilsService) {
    return new CobraStatusMapService(UtilsService);
}]);
