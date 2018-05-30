export default function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, tooltipsConfProvider) {
    tooltipsConfProvider.configure({
        'smart': true,
        'size': 'large',
        'speed': 'fast',
        'tooltipTemplateUrlCache': true
    });
    $locationProvider.html5Mode(false).hashPrefix('');
    /**注册拦截*/
    $httpProvider.interceptors.push('HttpInterceptor');
    /*登录*/
    let loginState = {
        name: 'login',
        url: '/login',
        template: require("../login.html"),
        controller: 'LoginController',

    };
    /*主模板*/
    let maintate = {
        name: 'main',
        url: '/main',
        template: require("../main.html")
    };
    /*无权限*/
    let unauthorizedState = {
        name: 'unauthorized',
        url: '/unauthorized',
        template: require("./views/qyj_views/unauthorized.html")
    };
    /*Q易借控制台*/
    let homePageState = {
        name: 'portal',
        url: "/portal",
        template: require('./views/qyj_views/portal.html'),
        controller: 'PortalController',
        permission: 'qyj_portal_page'
    };
    /*用户信息*/
    let searchUserInfoState = {
        name: 'searchUserInfo',
        url: '/searchUserInfo',
        cache: false,
        template: require('./views/qyj_views/searchUserInfo.html'),
        controller: 'SearchUserInfoController',
        permission: 'qyj_search_userinfo_page'
    };
    /*用户解锁*/
    let modifiUserState = {
        name: "modifiUser",
        url: "/modifiUser",
        cache: false,
        template: require('./views/qyj_views/modifiUser.html'),
        controller: 'ModifiUserController',
        permission: 'qyj_modifiuser_page'
    };
    /*登录日志*/
    let searchLogState = {
        name: "searchLog",
        url: "/searchLog",
        cache: false,
        template: require('./views/qyj_views/searchLog.html'),
        controller: 'SearchLogController',
        permission: 'qyj_searchlog_page'
    };
    /*进件查询*/
    let searchSaleRecordState = {
        name: 'searchSaleRecord',
        url: '/searchSaleRecord',
        cache: false,
        template: require("./views/qyj_views/searchSaleRecord.html"),
        controller: 'SearchSaleRecordController',
        permission: 'qyj_searchsale_page'
    };
    /*合同查询*/
    let searchCompactState = {
        name: "searchCompact",
        url: '/searchCompact',
        cache: false,
        template: require("./views/qyj_views/searchCompact.html"),
        controller: 'SearchCompactController',
        permission: 'qyj_searchcompact_page'
    };
    /*banner管理*/
    let bannerMgrState = {
        name: "bannerMgr",
        url: '/bannerMgr',
        cache: false,
        template: require("./views/qyj_views/bannerMgr.html"),
        controller: 'BannerMgrController',
        permission: 'qyj_bannermgr_page'
    };
    /*协议管理*/
    let protocolMgrState = {
        name: "protocolMgr",
        url: '/protocolMgr',
        cache: false,
        template: require("./views/qyj_views/protocolMgr.html"),
        controller: 'ProtocolMgrController',
        permission: 'qyj_protocolmgr_page'
    };
    /*系统消息*/
    let systemMessageState = {
        name: "systemMessage",
        url: '/systemMessage',
        cache: false,
        template: require("./views/qyj_views/systemMessage.html"),
        controller: 'SystemMessageController',
        permission: 'qyj_systemmessage_page'
    };
    /*借款消息*/
    let loanMessageState = {
        name: "loanMessage",
        url: '/loanMessage',
        cache: false,
        template: require("./views/qyj_views/loanMessage.html"),
        controller: 'LoanMsgController',
        permission: 'qyj_loanmessage_page'
    };
    /*渠道管理*/
    let channelMgrState = {
        name: 'channelmgr',
        url: '/channelmgr',
        cache: false,
        template: require('./views/qyj_views/channelmgr.html'),
        controller: 'ChannelMgrController',
        permission: 'qyj_channelmgr_page'
    };
    /*字典管理*/
    let globalSettingState = {
        name: 'globalSetting',
        url: '/globalSetting',
        cache: false,
        template: require('./views/qyj_views/globalSetting.html'),
        controller: 'GlobalSettingController',
        permission: 'qyj_globalsetting_page'
    };
    /*版本管理*/
    let versionMgrState = {
        name: 'versionMgr',
        url: '/versionMgr/:platform',
        cache: false,
        template: require('./views/qyj_views/versionMgr.html'),
        controller: 'VersionMgrController',
        permission: 'qyj_versionmgr_page'
    };
    /*热更新包管理*/
    let hotUpdateState = {
        name: 'hotUpdate',
        url: '/hotUpdate/:id/:version/:platform',
        cache: false,
        template: require('./views/qyj_views/hotUpdate.html'),
        controller: 'hotUpdateController'
    };


    /*意见反馈*/
    let qyjFeedbackState = {
        name: 'qyjFeedback',
        url: '/qyjFeedback',
        cache: false,
        template: require('./views/qyj_views/qyjFeedback.html'),
        controller: 'QyjFeedbackController',
        permission: 'qyj_feedback_page'
    };

    //Q易借控台--配置
    //登录
    $stateProvider.state("login", loginState);
    //主模板
    $stateProvider.state("main", maintate);
    //无权限
    $stateProvider.state("main.unauthorized", unauthorizedState);
    //Q易借控制台
    $stateProvider.state('main.portal', homePageState);
    //用户信息
    $stateProvider.state('main.searchUserInfo', searchUserInfoState);
    //用户解锁
    $stateProvider.state('main.modifiUser', modifiUserState);
    //登录日志
    $stateProvider.state('main.searchLog', searchLogState);
    //进件查询
    $stateProvider.state('main.searchSaleRecord', searchSaleRecordState);
    //合同查询
    $stateProvider.state('main.searchCompact', searchCompactState);
    //banner管理
    $stateProvider.state('main.bannerMgr', bannerMgrState);
    //协议管理
    $stateProvider.state('main.protocolMgr', protocolMgrState);
    //系统消息
    $stateProvider.state('main.systemMessage', systemMessageState);
    //借款消息
    $stateProvider.state('main.loanMessage', loanMessageState);
    //渠道管理
    $stateProvider.state('main.channelmgr', channelMgrState);
    // 字典管理
    $stateProvider.state("main.globalSetting", globalSettingState);
    // 版本管理
    $stateProvider.state("main.versionMgr", versionMgrState);
    //热更新包管理
    $stateProvider.state("main.hotUpdate", hotUpdateState);
    //意见反馈
    $stateProvider.state("main.qyjFeedback", qyjFeedbackState);


    /*
     //试算产品
     let trialProductState = {
     name: "trialProduct",
     url: "/trialProduct",
     cache: false,
     template: require('./views/qyj_views/trialProduct.html'),
     controller: "TrialProductController"
     }
     //消息中心
     let messageCenterState = {
     name: "messageCenter",
     url: "/messageCenter",
     template: require('./views/qyj_views/messageCenter.html'),
     controller: "MessageCenterController",
     permission: 'qyj_message_page'
     }
     //批量管理
     let batchMgrState = {
     name: 'batchmgr',
     url: '/batchmgr',
     cache: false,
     template: require("./views/qyj_views/batchmgr.html"),
     controller: "BatchMgrController",
     permission: "qyj_batchmgr_page"
     }
     let bannerImageState = {
     name: 'bannerImage',
     url: '/bannerImage',
     cache: false,
     controllerAs: 'vm',
     template: require('./views/qyj_views/bannerImage.html'),
     controller: 'BannerImageController'
     };
     //试算产品
     $stateProvider.state('main.trialProduct', trialProductState);
     //消息中心
     $stateProvider.state('main.messageCenter', messageCenterState);
     //批量处理
     $stateProvider.state("main.batchmgr", batchMgrState);
     //Banner图片管理
     $stateProvider.state('main.bannerimage', bannerImageState);
     */


    /*仪表盘*/
    let dashboardState = {
        name: 'dashboard',
        url: '/dashboard',
        cache: false,
        template: require('./views/qo_views/dashboard.html'),
        controller: 'DashboardController'
    };

    /*仪表盘*/
    let advertListState = {
        name: 'advertList',
        url: '/advertList',
        cache: false,
        template: require('./views/qo_views/advertList.html'),
        controller: 'AdvertController'
    };

    //预申请查询
    let preApplyState = {
        name: 'preapply',
        url: '/preapply',
        cache: false,
        template: require('./views/qo_views/preapply.html'),
        controller: "PreApplyController"
    };
    /*广告管理*/
    let ksd_advertisementState = {
        name: 'advertisement',
        url: '/advertisement',
        cache: false,
        template: require('./views/qo_views/advertisementList.html'),
        controller: 'adController'
    }
    /*客户建议*/
    let ksd_customerAdviceState = {
        name: 'customerAdvice',
        url: '/customerAdvice',
        cache: false,
        template: require('./views/qo_views/customerAdvice.html'),
        controller: 'customerAdviceController'
    }
    /*跨时贷系统设置*/
    let ksd_globalSettingState = {
        name: 'globalSettings',
        url: '/globalSettings',
        cache: false,
        template: require('./views/qo_views/globalSettings.html'),
        controller: 'globalSettingsController'
    }
    /*Qone用户管理*/
    let qo_userManagementState = {
        name: 'userManagement',
        url: '/userManagement',
        cache: false,
        template: require('./views/qo_views/userManagement.html'),
        controller: 'userManagementController'
    }
    /*HRM用户管理*/
    let qo_hrmUserManagementState = {
        name: 'hrmUserManagement',
        url: '/hrmUserManagement',
        cache: false,
        template: require('./views/qo_views/hrmUserManagement.html'),
        controller: 'hrmUserManagementController'
    }
    //产品管理
    let proManageState = {
        name: 'promanage',
        url: '/promanage',
        cache: false,
        template: require('./views/qo_views/promanage.html'),
        controller: 'ProManageController'
    }
    let departmentsState = {
        name: 'departments',
        url: '/departments',
        cache: false,
        template: require('./views/qo_views/departments.html'),
        controller: "DepartmentsController"
    }
    let feedbackState = {
        name: 'feedback',
        url: '/feedback',
        cache: false,
        template: require('./views/qo_views/feedbacks.html'),
        controller: "FeedBackController"
    }
    let cobrastatusmapState = {
        name: "cobrastatusmap",
        url: "/cobrastatusmap",
        cache: false,
        template: require('./views/qo_views/cobrastatusmap.html'),
        controller: "CobrasSatusMapController"
    }
    let qo_globalsettingState = {
        name: 'qo_globalsetting',
        url: '/qo_globalsetting',
        cache: false,
        template: require('./views/qo_views/qo_globalsetting.html'),
        controller: "QO_GlobalSettingsController"
    };

    // 客户管理
    let qo_customerState = {
        name: 'qo_customer',
        url: '/qo_customer',
        cache: false,
        template: require('./views/qo_views/customerList.html'),
        controller: "CustomerController"
    };

    //  常用地址
    let qo_commonlinksState = {
        name: 'qo_commonlinks',
        url: '/qo_commonlinks',
        cache: false,
        template: require('./views/qo_views/commonlinks.html'),
        controller: "CommonLinksController"
    };
    //  工作日历
    let qo_calendarState = {
        name: 'qo_calendar',
        url: '/qo_calendar',
        cache: false,
        template: require('./views/qo_views/calendar.html'),
        controller: "CalendarController"
    };

    //qone 系统配置
    $stateProvider.state("main.qo_globalsetting", qo_globalsettingState);
    //配置进件状态
    $stateProvider.state("main.cobrastatusmap", cobrastatusmapState);
    //意见反馈
    $stateProvider.state("main.feedback", feedbackState);
    //部门管理
    $stateProvider.state("main.departments", departmentsState);
    //产品管理
    $stateProvider.state("main.promanage", proManageState);
    // 预申请查询
    $stateProvider.state("main.preapply", preApplyState);
    // 仪表盘
    $stateProvider.state("main.dashBoard", dashboardState);
    //广告管理
    $stateProvider.state("main.advertisement", ksd_advertisementState);
    //广告管理
    $stateProvider.state("main.advertList", advertListState);
    //客户建议
    $stateProvider.state("main.customerAdvice", ksd_customerAdviceState);
    //系统配置
    $stateProvider.state("main.globalSettings", ksd_globalSettingState);
    //Qone用户管理
    $stateProvider.state("main.userManagement", qo_userManagementState);
    //HRM用户管理
    $stateProvider.state("main.hrmUserManagement", qo_hrmUserManagementState);
    // 客户管理
    $stateProvider.state("main.customer", qo_customerState);
    // 常用地址
    $stateProvider.state("main.commonlinks", qo_commonlinksState);
    // 工作日历
    $stateProvider.state("main.calendar", qo_calendarState);

    $urlRouterProvider.otherwise("/login");
}
config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'tooltipsConfProvider'];
