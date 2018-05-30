/**
 * Created by MingyueZhang on 2017/7/25.
 */
//引入BaseService
import {BaseApiMethod, BaseService} from '../business.service';

//API
class ApiMethod extends BaseApiMethod {

    /*获取HRM用户列表*/
    getHrmUserList(data){
        return this.post("",data);
    }

    /*添加新用户*/
    addHrmUser(data){
        return this.post("ADD_HRM_USERINFO",data);
    }

    /*修改用户信息*/
    updateHrmUser(data){
        return this.post("UPDATEHRMUSERINFO",data);
    }

    /*删除用户*/
    deleteHrmUser(data){
        return this.post("DELETE_HRM_USERINFO",data);
    }
    /*根据id获取用户信息*/
    getUserInfoById(data){
        return this.post("QUERYHRMUSERINFOBYID",data);
    }
    getUrl(){
        return this.getIpName("GETHRMUSERMANAGEMENTLIST");
    }



}
//Service
class  HrmUserManagementService{

    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);
    }
    getHrmUserList(data){
        return this.api.getHrmUserList(data);
    }

    addHrmUser(data){
        return this.api.addHrmUser(data);
    }
    updateHrmUser(data){
        return this.api.updateHrmUser(data);
    }
    deleteHrmUser(data){
        return this.api.deleteHrmUser(data);
    }
    /*根据id获取用户信息*/
    getUserInfoById(data){
        return this.api.getUserInfoById(data);
    }
    getUrl(){
        return this.api.getUrl();
    }

}
angular.module('biz-services').factory("HrmUserManagementService", ["UtilsService",function (UtilsService) {
    return new HrmUserManagementService(UtilsService);
}]);
