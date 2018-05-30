HomeController.$inject = ['$scope', '$location', 'permissions', '$cookieStore', '$http', '$q','toastr','UserInfoService','encryptionServer'];

class Menu {
    constructor(title, url, permission, icon, isNavCollapsed = false) {
        this.title = title;
        this.url = url;
        this.icon = icon;
        this.permission = permission;
        this.isNavCollapsed = isNavCollapsed;
        this.childrens = [];
    }

    addChildren(obj) {
        this.childrens.push(obj);
    }
}

function HomeController($scope, $location, permissions, $cookieStore, $http, $q,toastr,UserInfoService,encryptionServer) {
    $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        let permission = toState.permission;
        let currentuser = encryptionServer.getCurrentUserInfo("currentuser_obj");

        //console.log(currentuser);
        if (_.isString(permission) && !permissions.hasPermission(currentuser, permission)){
            $location.path('/main/unauthorized');
            return;
        }else if(!currentuser){
            $location.path('/login');
            return;
        }
    });

    $scope.isNavCollapsed = false;

    $scope.toggle = function (type) {
        if (type == "qone") {
            $scope.menus = QoneSideBarMenu();
        }
        if (type == "qyj") {
            $scope.menus = QyjSideBarMenu();
        }
    };

    //退出系统清空数据
    $scope.Logout = function () {
        sessionStorage.removeItem("currentuser_obj");
        $location.path('/login');
        UserInfoService.LogoutClearData().then(function (result) {
            if (result.responseCode == '10000') {
                toastr.success("用户退出成功！");
            } else {
                toastr.error(result.responseMsg);
            }
        });
    };

    $scope.initPage = function () {
        //var user = $cookieStore.get('currentuser_obj');

        //获取用户信息
        var userObj = encryptionServer.getCurrentUserInfo("currentuser_obj") || {};
        $scope.viewModel = {
            userName: userObj.userName
        };

        let menus = [];
        $scope.menus = menus;
        $scope.menus = QoneSideBarMenu();
        //$scope.menus = QyjSideBarMenu();   //默认展示Q易借控台导航菜单栏

    };

    // Q易借控台-菜单
    let QyjSideBarMenu = function () {
        let menus = [];
        menus.push(new Menu("Dashboard", "main.portal", "qyj_portal_page", "icon-icon-dashboard"));
        menus.push(new Menu("用户管理", "", "qyj_user_manage", "icon-icon-user-checked", true));
        menus[1].addChildren(new Menu("用户信息", "main.searchUserInfo", "qyj_search_userinfo_page", ""));
        menus[1].addChildren(new Menu("用户解锁", "main.modifiUser", "qyj_modifiuser_page", ""));
        menus[1].addChildren(new Menu("登录日志", "main.searchLog", "qyj_searchlog_page", ""));

        menus.push(new Menu("进件管理", "", "qyj_qcapp_manage", "icon-icon-channel"));
        menus[2].addChildren(new Menu("进件查询", "main.searchSaleRecord", "qyj_searchsale_page", ""));
        menus[2].addChildren(new Menu("合同查询", "main.searchCompact", "qyj_searchcompact_page", ""));

        menus.push(new Menu("运营配置", "", "qyj_operation_config", "fa fa-filter"));
        /*menus[3].addChildren(new Menu("广告管理", "main.bannerimage", "qyj_banner_page", ""));
         menus[3].addChildren(new Menu("消息中心", "main.messageCenter", "qyj_message_page", ""));*/
        //menus[3].addChildren(new Menu("协议管理", "main.protocolMgr", "qyj_protocolmgr_page", ""));
        menus[3].addChildren(new Menu("banner管理", "main.bannerMgr", "qyj_bannermgr_page", ""));
        menus[3].addChildren(new Menu("系统消息", "main.systemMessage", "qyj_systemmessage_page", ""));
        menus[3].addChildren(new Menu("借款消息", "main.loanMessage", "qyj_loanmessage_page", ""));
        menus[3].addChildren(new Menu("渠道管理", "main.channelmgr", "qyj_channelmgr_page", ""));


        menus.push(new Menu("系统管理", "", "qyj_systems_manage", "icon-icon-settings"));
        menus[4].addChildren(new Menu("字典管理", "main.globalSetting", "qyj_globalsetting_page", ""));
        menus[4].addChildren(new Menu("版本管理", "main.versionMgr", "qyj_versionmgr_page", ""));
        //menus[4].addChildren(new Menu("Android系统更新", "main.androidSystem", "qyj_system_config", ""));
        //menus[4].addChildren(new Menu("ios系统管理", "main.iosSystemMgr", "qyj_system_config", ""));
        //menus[4].addChildren(new Menu("批量管理", "main.batchmgr", "qyj_batchmgr_page", ""));

        menus.push(new Menu("意见反馈", "main.qyjFeedback", "qyj_feedback_page", "icon-icon-file"));
        return menus;
    };

    // Qone 菜单
    let QoneSideBarMenu = function () {

        let menus = [];
        menus.push(new Menu("Q-ONE控制台", "main.portal", "dashboard", "icon-icon-dashboard"));
        menus.push(new Menu("仪表盘", "main.dashBoard", "dashboard", "fa fa-dashboard"));
        menus.push(new Menu("客户管理", "main.customer", "qone_customer_page", "fa fa-suitcase"));
        menus.push(new Menu("预申请管理", "main.preapply", "qone_preapply_page", "fa fa-magic"));
        menus.push(new Menu("产品管理", "main.promanage", "qone_promanage_page", "fa fa-reorder"));
        menus.push(new Menu("部门管理", "main.departments", "qone_departments_page", "fa fa-space-shuttle"));

        menus.push(new Menu("用户管理", "", "qone_user_page", "fa fa-user"));

        menus[6].addChildren(new Menu("用户管理", "main.userManagement", "qone_user_manage_page", ""));
        menus[6].addChildren(new Menu("HRM用户管理", "main.hrmUserManagement", "qone_users_hrmmanage_page", ""));

        menus.push(new Menu("通用管理", "", "qone_general_manage", "fa fa-flask"));
        menus[7].addChildren(new Menu("广告管理", "main.advertList", "qone_advertList_page", ""));
        menus[7].addChildren(new Menu("常用地址", "main.commonlinks", "qone_commonlinks_page", ""));

        menus.push(new Menu("系统配置", "", "qone_system_config", "fa fa-cog"));
        menus[8].addChildren(new Menu("进件状态", "main.cobrastatusmap", "qone_cobrastatusmap_page", ""));
        menus[8].addChildren(new Menu("工作日历", "main.calendar", "qone_calendar_page", ""));
        //    menus[6].addChildren(new Menu("qo_任务调度", "main.batchmgr", "qyj_batchmgr_page", ""));
        menus[8].addChildren(new Menu("系统配置", "main.qo_globalsetting", "qone_globalsetting_page", ""));

        /*  menus.push(new Menu("qo_任务调度", "", "dashboard", "icon-icon-dashboard"));
         menus[9].addChildren(new Menu("qo_任务管理", "main.cobrastatusmap", "qyj_batchmgr_page", ""));
         menus[9].addChildren(new Menu("qo_任务节点", "main.batchmgr", "qyj_batchmgr_page", ""));
         menus[9].addChildren(new Menu("qo_任务分类", "main.batchmgr", "qyj_batchmgr_page", ""));*/


        /*  menus.push(new Menu("qo_跨时代", "", "dashboard", "icon-icon-dashboard"));
         menus[9].addChildren(new Menu("qo_广告管理", "main.advertisement", "qo_advertisement_page", ""));
         menus[9].addChildren(new Menu("qo_系统配置", "main.globalSettings", "qo_globalSettings_page", ""));
         menus[9].addChildren(new Menu("qo_客户建议", "main.customerAdvice", "qp_customerAdvice_page", ""));*/

        menus.push(new Menu("意见反馈", "main.feedback", "qone_feedback_page", "fa fa-comments-o"));
        /*  menus.push(new Menu("qo_监控日志", "main.portal", "dashboard", "icon-icon-dashboard"));
         menus.push(new Menu("qo_接口文档中心", "main.portal", "dashboard", "icon-icon-dashboard"));*/

        return menus;
    };
}

angular.module('controller').controller("HomeController", HomeController);
