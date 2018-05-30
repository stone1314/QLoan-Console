/**
 * Created by V-XiongXiang on 2017/6/30.
 */
import {BaseApiMethod,BaseService} from './business.service';

class ApiMethod extends BaseApiMethod{

    //列表
    getGlobalList(data){
        return this.post("GET_GLOBAL_LIST",data);
    }
    //详细
    queryGlobalDetailById (id){
        return this.get("QUERY_GLOBAL_SETTING",id);
    }

    //新增
    addNewGlobal(data){
        return this.post("ADD_GLOBAL_SETTING",data);
    }
    //编辑
    updateGlobal(data){
        return this.post("UPD_QYJ_COBRA_MAPPING",data);
    }
    // 删除
    deleteGlobal(id){
        return this.get("DEL_GLOBAL_SETTING",id);
    }

}

class GlobalSettingService extends BaseService{
    constructor(UtilService){
        super();
        this.api = new ApiMethod(UtilService);
    }

    //列表
    getGlobalList(data){
        return this.api.getGlobalList(data);
    }
    //详细
    queryGlobalDetailById(id){
        return this.api.queryGlobalDetailById(id);
    }
    //编辑
    addNewGlobal(data){
        return this.api.addNewGlobal(data);
    }
    //编辑
    updateGlobal(data){
        return this.api.updateGlobal(data);
    }
    //删除
    deleteGlobal(id){
        return this.api.deleteGlobal(id);
    }

}

angular.module("biz-services").factory('GlobalSettingService',['UtilsService',function(UtilsService){
    return new GlobalSettingService(UtilsService);
}])
