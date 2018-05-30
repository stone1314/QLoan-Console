/**
 * Created by MingyueZhang on 2017/6/20.
 */
import {BaseApiMethod, BaseService} from './business.service';


//【自动提示,自动Loading】 第一步   添加 mixin和decorator 引入
import autotipMixin from '../mixin/autotip.mixin';
import autotip from '../decorator/autotip.decorator';
import autotipClass from '../decorator/autotipClass.decorator';
import autoloadingMixin from '../mixin/autoloading.mixin';
import autoloading from '../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';
class ApiMethod extends BaseApiMethod {

    /*登录用户信息*/
    loginUser(data) {
        return this.post("LOGIN_USER", data);
    }
    /*退出登录清除后台数据*/
    LogoutClearData(){
        return this.get("LOGIN_OUT_CLEAR");
    }

    /*获取用户信息列表*/
    getUserInfoList(data) {
        return this.post("GET_USERINFOLIST", data);
    }

    /*获取用户身份信息*/
    getIdentityInfoById(data) {
        return this.post("GET_USER", data);
    }

    /*获取用户基本信息*/
    getBasicsInfoById(data) {
        return this.post("GET_BASICSINFO", data);
    }

    /*获取用户联系人*/
    getContastsInfoById(data) {
        return this.post("GET_CONTACTSINFO", data);
    }
    /*渠道和应用市场下拉框*/
    getChannelSelect(channelType){
        return this.get("GET_CHANNEL_SELECT","/" + channelType);
    }
    /*营业部区域和门店数据获取*/
    getQloanOrganiza(data){
        return this.post("GET_QLOAN_ORGANIZA",data);
    }
}

//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("数据读取出错,${error}")
@traits(autotipMixin, autoloadingMixin)
class UserInfoService extends BaseService{
    constructor(UtilsService, toastr, LoadingService) {
        super(UtilsService);
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    loginUser(data) {
        return this.api.loginUser(data);
    }

    LogoutClearData(){
        return this.api.LogoutClearData();
    }

    getUserInfoList(data) {
        return this.api.getUserInfoList(data);
    }

    getIdentityInfoById(data) {
        return this.api.getIdentityInfoById(data);
    }

    getBasicsInfoById(data) {
        return this.api.getBasicsInfoById(data);
    }

    getContastsInfoById(data) {
        return this.api.getContastsInfoById(data);
    }

    getChannelSelect(data){
        return this.api.getChannelSelect(data);
    }

    getQloanOrganiza(data){
        return this.api.getQloanOrganiza(data);
    }
}
//【自动提示,自动Loading】 第二步   添加 toastr LoadingService 依赖注入
angular.module('biz-services').factory("UserInfoService", ["UtilsService", "toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new UserInfoService(UtilsService, toastr, LoadingService);
}]);
