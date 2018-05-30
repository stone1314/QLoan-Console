/**
 * Created by MingyueZhang on 2017/7/25.
 */
import {BaseApiMethod, BaseService} from '../business.service';

class ApiMethod extends BaseApiMethod {

    /*��ȡ�û��б�*/
    getUserList(data){
        return this.post("",data);
    }
    /*�޸��û���Ϣ*/
    updateUserInfo(data){
        return this.post("SAVE_USERINFO",data);
    }
    /*�޸��û�״̬ ���á�����*/
    updateUserStatus(data){
        return this.post("",data);
    }
    /*ɾ���û�*/
    deleteUserInfo(data){
        return this.post("DELETE_USER",data);
    }
    /*�ر���ְԱ��Ȩ��*/
    closeUserPermission(data){
        return this.post("CLOSEPERMISSION",data);
    }
    /*��������*/
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
