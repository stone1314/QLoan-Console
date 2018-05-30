/**
 * Created by LanYang on 2017/10/27.
 */
import {BaseApiMethod, BaseService} from './business.service';
//【自动提示,自动Loading】 第一步   添加 mixin和decorator 引入
import autotipMixin from '../mixin/autotip.mixin';
import autotip from '../decorator/autotip.decorator';
import autotipClass from '../decorator/autotipClass.decorator'
import autoloadingMixin from '../mixin/autoloading.mixin';
import autoloading from '../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

class ApiMethod extends BaseApiMethod {
    //列表
    getSysMsgList(data){
        return this.post("GET_SYS_RESPONSE_MSG",data);
    }

    //详细
    querySysMsgById (id){
        return this.get("QUERY_PUSH_MSG",id);
    }

    //新增
    addPushMsg(data){
        return this.post("ADD_PUSH_MSG",data);
    }

    //编辑
    editPushMsg(data){
        return this.post("EDIT_PUSH_MSG",data);
    }

    // 删除
    deleteMsg(id){
        return this.get("DEL_PUSH_MSG",id);
    }

}


//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("Dashboard数据读取出错,${error}")
@traits(autotipMixin, autoloadingMixin)
class SystemMsgService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super(UtilsService);
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    //列表
    getSysMsgList(data){
        return this.api.getSysMsgList(data);
    }

    //详细
    querySysMsgById(id){
        return this.api.querySysMsgById(id);
    }

    //新增
    addPushMsg(data){
        return this.api.addPushMsg(data);
    }

    //编辑
    editPushMsg(data){
        return this.api.editPushMsg(data);
    }

    //删除
    deleteMsg(id){
        return this.api.deleteMsg(id);
    }

}


//【自动提示,自动Loading】 第二步   添加 toastr LoadingService 依赖注入
angular.module('biz-services').factory("SystemMsgService", ["UtilsService", "toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new SystemMsgService(UtilsService, toastr, LoadingService);
}]);
