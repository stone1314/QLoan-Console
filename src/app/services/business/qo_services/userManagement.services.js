/**
 * Created by MingyueZhang on 2017/7/25.
 */
import {BaseApiMethod, BaseService} from '../business.service';

class ApiMethod extends BaseApiMethod {

    /*获取用户列表*/
    getUserList(data){
        return this.post("",data);
    }
    /*修改用户信息*/
    updateUserInfo(data){
        return this.post("SAVE_USERINFO",data);
    }
    /*修改用户状态 启用、禁用*/
    updateUserStatus(data){
        return this.post("",data);
    }
    /*删除用户*/
    deleteUserInfo(data){
        return this.post("DELETE_USER",data);
    }
    /*关闭离职员工权限*/
    closeUserPermission(data){
        return this.post("CLOSEPERMISSION",data);
    }
    /*重置密码*/
    resetPassWord(data){
        return this.post("RESETPASSWORD",data);
    }

    getUserInfoById(data){
        return this.post("QUERYUSERINFOBYID",data);
    }
    getUrl(){
        return this.getIpName("GETUSERMANAGEMENTLIST");
    }
    clearBinding(telPhone){
        return this.get("CLEARBINDING","/" + telPhone);
    }
}

class UserManagementService{
    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);
    }

    getUserList(data){
        return this.api.getUserList(data);
    }
    updateUserInfo(data){
        return this.api.updateUserInfo(data);
    }
    updateUserStatus(data){
        return this.api.updateUserStatus(data);
    }
    deleteUserInfo(data){
        return this.api.deleteUserInfo(data);
    }
    closeUserPermission(data){
        return this.api.closeUserPermission(data);
    }
    resetPassWord(data){
        return this.api.resetPassWord(data);
    }
    getUserInfoById(data){
        return this.api.getUserInfoById(data);
    }
    getUrl(){
        return this.api.getUrl();
    }
    clearBinding(telPhone){
        return this.api.clearBinding(telPhone);
    }


}

angular.module('biz-services').factory("UserManagementService", ["UtilsService",function (UtilsService) {
    return new UserManagementService(UtilsService);
}]);
