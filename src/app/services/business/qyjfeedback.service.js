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
    //城市
    getCityList(data) {
        return this.post("GET_CITYLIST", data);
    }
    //部门
    getDepment(data){
        return this.post("GET_DEPMENT",data);
    }

    //获取意见反馈列表
    getFeedbacksList(data){
        return this.post("GET_USER_ADVICE_LIST",data);
    }
    //意见反馈详情
    getFeedbackDetails(id) {
        return this.post("GET_USER_ADVICE",id);
    }


}


//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("Dashboard数据读取出错,${error}")
@traits(autotipMixin, autoloadingMixin)
class QyjFeedbackService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super(UtilsService);
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getCityList(data) {
        return this.api.getCityList(data);
    }
    getDepment(data){
        return this.api.getDepment(data);
    }
    getFeedbacksList(data){
        return this.api.getFeedbacksList(data);
    }
    getFeedbackDetails(id) {
        return this.api.getFeedbackDetails(id);
    }



}


//【自动提示,自动Loading】 第二步   添加 toastr LoadingService 依赖注入
angular.module('biz-services').factory("QyjFeedbackService", ["UtilsService", "toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new QyjFeedbackService(UtilsService, toastr, LoadingService);
}]);
