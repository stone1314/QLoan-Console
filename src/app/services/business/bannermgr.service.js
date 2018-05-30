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

    // 列表
    getBannerPageList(data){
        return this.post("GET_BANNER_LIST",data);
    }
    //详情
    getAdvertById (id){
        return this.get("GET_ADVERT_BYID",id);
    }
    //编辑
    editBanner(data){
        return this.post("BANNER_UPDATE",data);
    }
    //删除
    deleteBanner(id){
        return this.get("EDLET_ADVERT",id);
    }
    //新建
    addNewBanner(data){
        return this.post("BANNER_CREATE",data);
    }

}


//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("Dashboard数据读取出错,${error}")
@traits(autotipMixin, autoloadingMixin)
class BannerMgrService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super(UtilsService);
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    //列表
    getBannerPageList(data){
        return this.api.getBannerPageList(data);
    }
    //详情
    getAdvertById(id){
        return this.api.getAdvertById(id);
    }
    //编辑
    editBanner(data){
        return this.api.editBanner(data);
    }
    //新增
    addNewBanner(data){
        return this.api.addNewBanner(data);
    }
    //删除
    deleteBanner(id){
        return this.api.deleteBanner(id);
    }


}


//【自动提示,自动Loading】 第二步   添加 toastr LoadingService 依赖注入
angular.module('biz-services').factory("BannerMgrService", ["UtilsService", "toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new BannerMgrService(UtilsService, toastr, LoadingService);
}]);
