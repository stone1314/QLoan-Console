/**
 * Created by kaiz on 2017/12/20
 * hotupdate.sevice
 */

import {BaseApiMethod, BaseService} from './business.service';
//【自动提示,自动Loading】 第一步   添加 mixin和decorator 引入
import autoTipMixin from '../mixin/autotip.mixin';
import autotip from '../decorator/autotip.decorator';
import autotipClass from '../decorator/autotipClass.decorator'
import autoloadingMixin from '../mixin/autoloading.mixin';
import autoloading from '../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

class ApiMethod extends BaseApiMethod {

    /*删除数据*/
    deleteData(id) {
        return this.get("DEL_HOT_UPDATE_DATA_BY_ID", "/" + id);
    }
    /*启用 禁用disableMinoVersion/{id}/{state}*/
    setHotState(id,state) {
        return this.get("SETHOTSTATE","/" + id + "/" + state);
    }

    /*获取列表*/
    getHotUpdateList(data) {
        return this.post("GET_HOT_UPDATE_LIST", data);
    };
    /*编辑*/
    upMinoVersion(data) {
        return this.post("UPMINOVERSION", data);
    };
    /*新增*/
    addMinoVersion(data) {
        return this.post("ADD_MINO_VERSION", data);
    }
}

//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class hotUpdateService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }
    /*获取列表*/
    getHotUpdateList(data) {
        return this.api.getHotUpdateList(data);
    }
    /*删除*/
    addMinoVersion(data){
        return this.api.addMinoVersion(data);
    }
    /*编辑*/
    upMinoVersion(data) {
        return this.api.upMinoVersion(data);
    }
    /*删除*/
    deleteData(id) {
        return this.api.deleteData(id);
    }
  /*启用*/
    setHotState(id,state) {
        return this.api.setHotState(id, state);
    }

    /*  startUsing(id) {
        return this.api.startUsing(id);
    }
    /!*禁用*!/
    startUsing(id) {
        return this.api.stopUsing(id);
    }*/
}

angular.module('biz-services').factory("hotUpdateService", ["UtilsService", "toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new hotUpdateService(UtilsService, toastr, LoadingService);
}])

