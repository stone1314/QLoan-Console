
import {BaseApiMethod, BaseService} from './business.service';
//【自动提示,自动Loading】 第一步   添加 mixin和decorator 引入
import autotipMixin from '../mixin/autotip.mixin';
import autotip from '../decorator/autotip.decorator';
import autotipClass from '../decorator/autotipClass.decorator'
import autoloadingMixin from '../mixin/autoloading.mixin';
import autoloading from '../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

class ApiMethod extends BaseApiMethod {
    //数据统计
    getStatisticData(data){
        return this.post("GET_STATISTICAL_INFO",data);
    }

    //关键数据实时指标
    getKeyData(data){
        return this.get("GET_KEY_DATA","/"+data+"?t="+new Date().getTime());
    }

    //渠道和应用市场对比
    getChannelAndmarketCompare(data){
        return this.post("CHANNEL_AND_MARKET_COMPARE",data);
    }
}


//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("Dashboard数据读取出错,${error}")
@traits(autotipMixin, autoloadingMixin)
class PortalService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super(UtilsService);
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }


    //【自动提示,自动Loading】 第五步  对需要的方法加入修饰器
    // @autoloading
    // @autotip("渠道对比数据数据读取失败,${error}")
    getStatisticData(data) {
        return this.api.getStatisticData(data).then((d)=> {
            return d;
        });
    }
    //【自动提示,自动Loading】 第五步  对需要的方法加入修饰器
    // @autoloading
    // @autotip("渠道对比数据数据读取失败,${error}")
    getKeyData(data) {
        return this.api.getKeyData(data).then((d)=> {
            return d;
        });
    }

    //渠道和应用市场对比
    getChannelAndmarketCompare(data) {
        return this.api.getChannelAndmarketCompare(data);
    }

}


//【自动提示,自动Loading】 第二步   添加 toastr LoadingService 依赖注入
angular.module('biz-services').factory("PortalService", ["UtilsService", "toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new PortalService(UtilsService, toastr, LoadingService);
}]);
