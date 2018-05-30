/**
 * Created by HaihuaHuang on 2017/8/14.
 */



import {BaseApiMethod, BaseService} from '../business.service';

class ApiMethod extends BaseApiMethod {

    //获取统计信息
    getAppState(){
        return this.post("GET_APPSTATE", "", "");
    }

    getEcharts(){
        return this.post("GET_ECHARTS","","");
    }
}


class DashBoardService {
    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);
    }

    getAppState(){
        return this.api.getAppState();
    }

    getEcharts(){
        return this.api.getEcharts();
    }

}
angular.module('biz-services').factory("DashBoardService", ["UtilsService", function (UtilsService) {
    return new DashBoardService(UtilsService);
}]);