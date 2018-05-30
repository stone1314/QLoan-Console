/**
 * Created by HaihuaHuang on 2017/8/18.
 */
import {BaseApiMethod, BaseService} from '../business.service';

class ApiMethod extends BaseApiMethod {

    getFeedback(id) {
        return this.post("GET_FEEDBACK", "", id);
    }

    getUrl(){
        return this.getIpName("GET_FEEDBACKLIST");
    }
}


class FeedBackService {
    constructor(UtilsService) {
        this.api = new ApiMethod(UtilsService);
    }

    getFeedback(id) {
        return this.api.getFeedback(id);
    }

    getUrl(){
        return this.api.getUrl();
    }


}
angular.module('biz-services').factory("FeedBackService", ["UtilsService", function (UtilsService) {
    return new FeedBackService(UtilsService);
}]);
