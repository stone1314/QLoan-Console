/**
 * Created by MingyueZhang on 2017/7/25.
 */
//����BaseService
import {BaseApiMethod, BaseService} from '../business.service';

//API
class ApiMethod extends BaseApiMethod {

    /*��ȡHRM�û��б�*/
    getHrmUserList(data){
        return this.post("",data);
    }

    /*������û�*/
    addHrmUser(data){
        return this.post("ADD_HRM_USERINFO",data);
    }

    /*�޸��û���Ϣ*/
    updateHrmUser(data){
        return this.post("UPDATEHRMUSERINFO",data);
    }

    /*ɾ���û�*/
    deleteHrmUser(data){
        return this.post("DELETE_HRM_USERINFO",data);
    }
    /*����id��ȡ�û���Ϣ*/
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
    /*����id��ȡ�û���Ϣ*/
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
