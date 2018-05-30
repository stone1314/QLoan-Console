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
    //获取借款消息列表
    getLoadMsgList(data){
        return this.post("GET_LOAN_RESPONSE_MSG",data);
    }
    queryLoadMsgById (id){
        return this.get("QUERY_PUSH_MSG",id);
    }
}


//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("Dashboard数据读取出错,${error}")
@traits(autotipMixin, autoloadingMixin)
class LoanMsgService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super(UtilsService);
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getLoadMsgList(data){
        return this.api.getLoadMsgList(data);
    }
    queryLoadMsgById(id){
        return this.api.queryLoadMsgById(id);
    }

}


//【自动提示,自动Loading】 第二步   添加 toastr LoadingService 依赖注入
angular.module('biz-services').factory("LoanMsgService", ["UtilsService", "toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new LoanMsgService(UtilsService, toastr, LoadingService);
}]);
