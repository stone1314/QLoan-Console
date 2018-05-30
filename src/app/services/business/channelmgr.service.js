/**
 * Created by Medooo on 17/6/16
 * channelmgr sevice
 */

import {BaseApiMethod, BaseService} from './business.service';
//【自动提示,自动Loading】 第一步   添加 mixin和decorator 引入
import autoTipMixin from '../mixin/autotip.mixin';
import autotip from '../decorator/autotip.decorator';
import autotipClass from '../decorator/autotipClass.decorator'
import autoloadingMixin from '../mixin/autoloading.mixin';
import autoloading from '../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

// 渠道类型数据
let _channelTypeList = [
    {
        dataCode: "1",
        dataName: "应用市场"
    },
    {
        dataCode: "0",
        dataName: "渠道"
    },
];

// 渠道状态数据
let _channelStatusList = [
    {
        dataCode: "1",
        dataName: "有效"
    },
    {
        dataCode: "0",
        dataName: "无效"
    }
];


// 获取渠道类型 Response 内容
let _testGetChannelTypeResponse = {
    code: 200,
    result: _channelTypeList
};

// 获取渠道状态列表 Response 内容
let _testGetChannelStatusListResponse = {
    code: 200,
    result: _channelStatusList
};


class ApiMethod extends BaseApiMethod {

    /*渠道类型*/
    getChannelType() {
        // return this.get("GET_CHANNEL_TYPE");
        return Promise.resolve(_testGetChannelTypeResponse);
    }

    /*渠道状态列表*/
    getChannelStatus() {
        // return this.get("GET_CHANNEL_STATUS");
        return Promise.resolve(_testGetChannelStatusListResponse);
    }

    /*渠道管理列表*/
    getChannelList(data) {
        return this.post("GET_CHANNEL_LIST", data);
    }

    /*根据ID获取渠道信息*/
    getChannelById(id) {
        return this.get("GET_CHANNEL_BY_ID", "/" + id);
    }

    /*添加渠道*/
    addChannel(data) {
        return this.post("ADD_CHANNEL", data);
    }

    /*更新渠道*/
    updateChannel(data) {
        return this.post("UPDATE_CHANNEL", data);
    }

    /*删除渠道*/
    deleteChannel(id) {
        return this.get("DEL_CHANNEL_BY_ID", "/" + id);
    }
}

//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class ChannelMgrService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getChannelType() {
        return this.api.getChannelType();
    }

    getChannelStatus() {
        return this.api.getChannelStatus();
    }

    getChannelList(data) {
        return this.api.getChannelList(data);
    }

    @autoloading
    getChannelById(id) {
        return this.api.getChannelById(id)
    }

    @autoloading
    addChannel(data) {
        return this.api.addChannel(data);
    }

    @autoloading
    updateChannel(data) {
        return this.api.updateChannel(data);
    }

    @autoloading
    deleteChannel(id) {
        return this.api.deleteChannel(id);
    }
}

angular.module('biz-services').factory("ChannelMgrService", ["UtilsService", "toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new ChannelMgrService(UtilsService, toastr, LoadingService);
}]);
