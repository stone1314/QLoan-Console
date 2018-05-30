/**
 * Created by HaihuaHuang on 2017/8/22.
 */



import {BaseApiMethod, BaseService} from '../business.service';

class ApiMethod extends BaseApiMethod {

    setCalendar(year){
        return this.post("SET_CALENDAR","",year);
    }

    setIsWork(data){
        return this.post("SET_ISWORK",data);
    }

    getMonth(data){
        return this.post("GET_MONTH",data);
    }


}


class CalendarService {
    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);
    }

    setCalendar(year){
        return this.api.setCalendar(year);
    }

    setIsWork(data){
        return this.api.setIsWork(data);
    }

    getMonth(data){
        return this.api.getMonth(data);
    }
}
angular.module('biz-services').factory("CalendarService", ["UtilsService", function (UtilsService) {
    return new CalendarService(UtilsService);
}]);
