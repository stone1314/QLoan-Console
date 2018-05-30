/**
 * Created by LanYang on 2017/12/14.
 * versionmgr sevice
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

    /*版本管理列表*/
    getVersionManageList(data) {
        return this.post("GET_VERSION_MANAGE_LIST", data);
    }
    /*版本管理单条数据*/
    getVersionById(id) {
        return this.get("GET_VERSION_BY_ID", "/" + id);
    }
    /*版本管理更新*/
    upVersion(data) {
        return this.post("UP_VERSION", data);
    }
    /*版本管理新增*/
    addVersion(data) {
        return this.post("ADD_VERSION", data);
    }
    /*版本管理删除*/
    deleteVersion(id) {
        return this.get("DELETE_VERSION", "/" + id);
    }
    /*启用和禁用操作*/
    disableVersion(id,state){
        return this.get("DISABLE_VERSION", "/" + id + "/" + state);
    }
    /*设置是否更新*/
    setIsUpdate(data){
        return this.post("UP_VERSION", data);
    }
}

//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class VersionMgrService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getVersionManageList(data) {
        return this.api.getVersionManageList(data);
    }
    getVersionById(data) {
        return this.api.getVersionById(data);
    }
    upVersion(data) {
        return this.api.upVersion(data);
    }
    addVersion(data) {
        return this.api.addVersion(data);
    }
    deleteVersion(data) {
        return this.api.deleteVersion(data);
    }
    disableVersion(id, state){
        return this.api.disableVersion(id, state);
    }
    setIsUpdate(data){
        return this.api.setIsUpdate(data);
    }
}

angular.module('biz-services').factory("VersionMgrService", ["UtilsService", "toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new VersionMgrService(UtilsService, toastr, LoadingService);
}]);
