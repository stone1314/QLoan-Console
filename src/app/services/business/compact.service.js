/**
 * Created by HaihuaHuang on 2017/6/27.
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
    //列表
    getOrderList(data) {
        return this.post("GET_ORDERLIST", data);
    }

    getOrderById(data) {
        return this.post("GET_ORDERBYID","", data);
    }

    getContractList(data) {
        return this.post("GET_CONTRACTLIST", data);
    }

    getRepaymentPlan(data){
        return this.post("GET_REPAYPLANS",data);
    }
    /*获取分单方式下拉框*/
    getSeparateMode(data){
        return this.post("GET_SEPARATE_MODE",data);
    }
}

//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("数据读取出错,${error}")
@traits(autotipMixin, autoloadingMixin)
class CompactService extends BaseService{
    constructor(UtilsService, toastr, LoadingService) {
        super(UtilsService);
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    //列表
    getOrderList(data) {
        return this.api.getOrderList(data);
    }


    //根据id查进件信息
    getOrderById(data) {
        return this.api.getOrderById(data);
    }

    //查询合同信息
    getContractList(data) {
        return this.api.getContractList(data);
    }

    //查询合同还款计划
    getRepaymentPlan(data){
        return this.api.getRepaymentPlan(data);
    }

    //获取分单方式下拉框
    getSeparateMode(data){
        return this.api.getSeparateMode(data);
    }
}
//【自动提示,自动Loading】 第二步   添加 toastr LoadingService 依赖注入
angular.module('biz-services').factory("CompactService", ["UtilsService", "toastr", "LoadingService",function (UtilsService, toastr, LoadingService) {
    return new CompactService(UtilsService, toastr, LoadingService);
}]);
