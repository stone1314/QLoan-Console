/*system interfaces url*/
export const Test_url = "服务接口";

export const LOGIN_USER = "qyjApi/bk/home/login";
/*Logout时清除后台缓存数据*/
export const LOGIN_OUT_CLEAR = "qyjApi/bk/home/loginOut";

/*获取用户联系人信息*/
export  const GET_CONTACTSINFO =  "/qyjapi/userinfo/getUserContact";
/*获取用户认证数据*/
export const GET_USER ="qyjApi/bk/user/getUser";



/* 获取字典集合*/
export const  GET_GLOBALSETTING_LIST = "/qyjApi/bk/dict/getQyjCobraMapping";
/* 更新字典信息*/
export const MODIFY_GLOBALSETTING_DATA = "/qyjApi/bk/dict/updQyjCobraMapping";
/** 上传文件*/
export  const BANNER_UPLOAD_IMG = "/upload/image";
/*根据Code查询字典 */
export const GET_DIC_BY_CODE="/QeasyBorrow/GetDicByCode";
/*根据ParentCode获取字典信息*/
export const GET_DIC_BY_PARENTCODE="/QeasyBorrow/GetDicByParentCode";
/*获取用户信息查询列表*/
export const GET_USERINFOLIST =  "/qyjApi/bk/user/getUserList";

/* 渠道查询 - 所有 */
export const GET_CHANNEL_LIST = "/qyjApi/bk/oper/getChannelList";
/* 渠道查询 - 单条 */
export const GET_CHANNEL_BY_ID = "/qyjApi/bk/oper/getChannelById";
/* 渠道创建 */
export const ADD_CHANNEL = "/qyjApi/bk/oper/addChannel";
/* 渠道修改 */
export const UPDATE_CHANNEL = "/qyjApi/bk/oper/updChannel";
/* 渠道逻辑删除 */
export const DEL_CHANNEL_BY_ID = "/qyjApi/bk/oper/deleteChannel";
 
/*登录日志*/
export const GET_LOGINLOG = "/qyjApi/bk/user/getLoginLogList";
/*进件信息查询*/
export const  GET_ORDERLIST="/qyjApi/bk/order/getOrderList";
/*根据id查进件信息*/
export const GET_ORDERBYID="/qyjApi/bk/order/getOrderById/";
/*获取合同信息*/
export const GET_CONTRACTLIST="/qyjApi/bk/order/getContractList";
/*获取合同的还款计划*/
export const GET_REPAYPLANS="/qyjApi/bk/order/queryQyjRepayPlans";
/*发送消息*/
export const SEND_MESSAGE="/qyjApi/bk/msg/addPushMsg";
/*解锁被锁用户*/
export const GET_UNLOCKACCOUNT="/qyjApi/bk/user/unlockAccount/";
/*获取用户基础信息*/
export  const GET_BASICSINFO="qyjapi/userinfo/getUserBasic";
/*获取渠道和应用市场下拉框数据*/
export const GET_CHANNEL_SELECT="qyjApi/bk/selectBaseData/getChannel";
/*分单方式下拉框*/
export const GET_SEPARATE_MODE="qyjApi/bk/selectBaseData/getSeparateMode";
/*营业部区域和门店数据获取*/
export const GET_QLOAN_ORGANIZA="qyjApi/bk/selectBaseData/getQloanOrganiza";

/*版本管理列表*/
export const GET_VERSION_MANAGE_LIST="qyjApi/bk/versionManage/getVersionManageList";
/*版本管理查单条*/
export const GET_VERSION_BY_ID="qyjApi/bk/versionManage/getVersionById";
/*版本管理更新*/
export const UP_VERSION="qyjApi/bk/versionManage/upVersion";
/*版本管理新增*/
export const ADD_VERSION="qyjApi/bk/versionManage/addVersion";
/*版本管理删除*/
export const DELETE_VERSION="qyjApi/bk/versionManage/deleteVersion";


/*意见反馈详情*/
export const GET_USER_ADVICE="qyjApi/bk/user/getUserAdvice";

/*系统消息列表*/
export const GET_SYS_RESPONSE_MSG="qyjApi/bk/msg/getSysResponseMsg";
/*借款消息列表*/
export const GET_LOAN_RESPONSE_MSG="qyjApi/bk/msg/getLoanResponseMsg";
/*系统消息和借款消息详情*/
export const QUERY_PUSH_MSG="qyjApi/bk/msg/queryPushMsg/";
/*新增系统消息*/
export const ADD_PUSH_MSG="qyjApi/bk/msg/addPushMsg";
/*编辑系统消息*/
export const EDIT_PUSH_MSG="qyjApi/bk/msg/editPushMsg";
/*删除系统消息*/
export const DEL_PUSH_MSG="qyjApi/bk/msg/delPushMsg/";

/*字典管理列表*/
export const GET_GLOBAL_LIST="qyjApi/bk/dict/getGlobalSettingList";
/*字典管理详情*/
export const QUERY_GLOBAL_SETTING="qyjApi/bk/dict/queryGlobalSetting/";
/*新增字典管理*/
export const ADD_GLOBAL_SETTING="qyjApi/bk/dict/addGlobalSetting";
/*编辑字典管理*/
export const UPD_QYJ_COBRA_MAPPING="qyjApi/bk/dict/updQyjCobraMapping";
/*删除字典管理*/
export const DEL_GLOBAL_SETTING="qyjApi/bk/dict/deleteGlobalSetting/";


/*banner管理列表*/
export const GET_BANNER_LIST = "qyjApi/bk/oper/getAdvertList";
/*banner管理新增*/
export const BANNER_CREATE = "qyjApi/bk/oper/addAdvert";
/*banner管理编辑*/
export const BANNER_UPDATE = "qyjApi/bk/oper/updAdvert";
/*banner管理删除*/
export const EDLET_ADVERT = "qyjApi/bk/oper/deleteAdvert/";
/*banner管理详情*/
export const GET_ADVERT_BYID = "qyjApi/bk/oper/getAdvertById/";
/*banner状态启用禁用*/
export const DISABLE_ADVERT = "qyjApi/bk/oper/disableAdvert/";


//意见反馈列表
export const GET_USER_ADVICE_LIST= "qyjApi/bk/user/getUserAdviceList";
//首页数据统计
export const GET_STATISTICAL_INFO="qyjApi/bk/home/getStatisticalInformation";
//关键数据实时指标
export const GET_KEY_DATA="qyjApi/bk/home/getKeyData";
//渠道和应用市场对比
export const CHANNEL_AND_MARKET_COMPARE="qyjApi/bk/home/getChannelAndmarketCompare";
//上传图片
export const UPLOAD_IMAGE="/qyjApi/bk/oper/fileUpload";
//Qone\
/*用户更新*/
export const SAVE_USERINFO="qoneapi/bk/userManage/saveUserInfo";
/*删除用户*/
export  const DELETE_USER="qoneapi/bk/userManage/deleteUser";
/*新增HRM用户*/
export  const ADD_HRM_USERINFO="qoneapi/bk/hrmUserManage/addHrmUserInfo";
/*删除HRM用户*/
export const DELETE_HRM_USERINFO="qoneapi/bk/hrmUserManage/deleteHrmUserInfo";
/*重置密码*/
export const RESETPASSWORD="qoneapi/bk/userManage/resetPassword";
/*根据id获取HRM用户信息*/
export const QUERYHRMUSERINFOBYID="qoneapi/bk/hrmUserManage/queryHrmUserInfoById";
/*修改HRM用户信息*/
export const UPDATEHRMUSERINFO="qoneapi/bk/hrmUserManage/updateHrmUserInfo";
/*根据id获取用户信息*/
export const QUERYUSERINFOBYID="qoneapi/bk/userManage/queryUserById";


/*-------------------------------------------Q_ONE--------------------------------------------------*/
/*删除广告信息*/
export  const DEl_ADVERT="qoneapi/bk/ad/bannerDeleteFile";
/*添加广告信息*/
export const ADD_ADVERT="qoneapi/bk/ad/addBannerFile";
/*获取广告信息*/
export const GET_ADVERT="qoneapi/bk/ad/getAdvertById/";
/*修改广告信息*/
export const UPDATE_ADVERT="qoneapi/bk/ad/updAdvert";
/*更新广告排序*/
export  const UPDATE_ADVERTBATCH="qoneapi/bk/ad/updAdvertBatch";

/*获取广告列表*/
export const GET_ADVERTLIST="qoneapi/bk/ad/getAdvertList";

/*日历*/
export const SET_CALENDAR="qoneapi/bk/date/initialYearData/";
/*设置休息日，工作日*/
export const SET_ISWORK='qoneapi/bk/date/setWorkDay';
/*获取休息工作日*/
export const GET_MONTH='qoneapi/bk/date/getMonth';

/*添加网址*/
export const ADD_LINK="qoneapi/bk/url/addUrl";
/*修改网址*/
export const UPDATE_LINK="qoneapi/bk/url/updUrl";
/*批量更新sort*/
export const UPDATE_LINKSORT="qoneapi/bk/url/updUrlBatch";
/*删除网址*/
export const DELTET_LINK="qoneapi/bk/url/delUrl/";
/*查询单条*/
export const GET_LINK="qoneapi/bk/url/getUrlById/"
/*h获取网址列表*/
export const GET_LINLS='qoneapi/bk/url/getUrlList'


/*仪表盘统计信息*/
export const GET_APPSTATE  ="qoneapi/bk/home/getPreAppStatistics";
/*echar折线图*/
export const GET_ECHARTS="qoneapi/bk/home/getCommonLinks";


/*客户管理  根据身份证号码获取认证信息*/
export const GET_CERTIFY="qoneapi/bk/customerManage/getCertifyWithIdNo";
/*客户管理 根据id 获取客户详细信息*/
export const GET_CUSTOMERINFO="qoneapi/bk/customerManage/queryCustomerInfo";
/*客户管理 获取产品LOGO*/
export const GET_PRODUCTLOGO="qoneapi/bk/preApplyManage/getAllProductLogos"
/*客户管理 根据产品LOGO获取产品信息*/
export  const GET_PRODUCT="qoneapi/bk/preApplyManage/getProductByLogo";
/*客户管理 列表*/
export const GET_CUSTOMERLIST="qoneapi/bk/customerManage/getPreAppCustomerViewPage";

/*删除部门信息*/
export const DEL_DEPMENT="qoneapi/bk/departmentManage/deleteDepartmentInfo";
/*添加部门信息*/
export const ADD_DEPMENT="qoneapi/bk/departmentManage/addDepartmentInfo";
/*修改部门信息*/
export const UPDATE_DEPMENT="qoneapi/bk/departmentManage/updateDepartmentInfo";
/*根据code查询单条部门信息*/
export const GET_DEPMENT="qoneapi/bk/departmentManage/getCobraDepartmentList";
/*根据id和属性值修改状态*/
export const UPDATE_DEPSTATE="qoneapi/bk/departmentManage/updateDepartmentInfo";
/*获取部门信息列表*/
export  const GET_DEPMENTLIST='qoneapi/bk/departmentManage/getCobraDepartmentList';

//查询产品管理信息
export  const  GET_PRO="qoneapi/bk/productManage/queryProductInfoPage";
//产品启用禁用
export const   UPDATE_PROSTATE="qoneapi/bk/productManage/activeProduct";
//产品同步
export const SYN_PRODUCT="qoneapi/bk/taskScheduling/syncProductInfo";

//获取城市信息
export const GET_CITYLIST="qoneapi/bk/appCity/queryProductCity";
//修改产品管理城市
export  const  UPDATE_PRODEPMAP="qoneapi/bk/productManage/saveProductDepartmentMapping"
//获取产品列表
export const GET_PRODUCTLIST="qoneapi/bk/productManage/queryProductInfoPage";

//关闭离职员工权限
export const CLOSEPERMISSION="qoneapi/bk/taskScheduling/closePermission";


//系统配置
export const GLOBAL_SETTINGLIST="qoneapi/bk/set/getGlobalSettingList";
//系统配置修改或添加------根据是有id判断
export const UPDATE_GLOBALSETTINF="qoneapi/bk/set/addOrUpdGlobalSetting";

export  const  GET_SETTINGBYID="qoneapi/bk/set/getGlobalSettingById/";
 //更新系统缓存
export const CLEAR_CACHE='qoneapi/bk/set/clearCache';

//意见反馈集合
export const GET_FEEDBACKLIST= "qoneapi/bk/feedback/getFeedbackList";
//意见反馈单条
export const  GET_FEEDBACK="qoneapi/bk/feedback/getFeedbackById/";



/******公共获取的字典qyjapi/baseData/getCacheForPidKey*****/
export const REDIOS_API ="qoneApi/baseData/getCacheForPidKey";

//获取所有产品类型
export const GETALLPRODUCT="qoneapi/bk/preApplyManage/getAllProductLogos";
//根据产品类型获取产品
export const GETPRODUCTBYLOGO="qoneapi/bk/preApplyManage/getProductByLogo";
//获取预申请结果
export const GETPRESTATUS="qoneapi/baseData/getCacheForPidKey";
//跳过运营商认证
export const SKIPCERTIFY="qoneapi/bk/preApplyManage/skipCertify";
//根据预申请号获取详细信息
export const GETAPPINFOBYPREALLCODE="qoneapi/bk/preApplyManage/getAppInfoByIdOrPreAppCode";
// 根据预申请号获取认证状态
export const GETCERTIFYSTATUSBYPREAPPCODE="qoneapi/bk/preApplyManage/queryCertifyWithPreAppCode";
// 根据产品ID获取产品回退历史
export const  GETPRODUCTCHANGEHISTORY="qoneapi/bk/preApplyManage/getProductChangeHistory";


//qone字典表
export  const GETCACHEFORPIDKEY ="qoneApi/baseData/getCacheForPidKey";
export  const GETCACHEFORKEY ="qoneApi/baseData/getCacheForKey";
//添加或更新
export const ADDORUPDATEAPPSTATUSMAP ="qoneapi/bk/map/addOrUpdateAppStatusMapping";
//清除缓存
export const  CLEARAPPSTATUSCACHE="qoneapi/bk/map/clearAppStatusCache";
//获取用户管理列表
export const GETUSERMANAGEMENTLIST="qoneapi/bk/userManage/queryUserInfoPage";
//获取HRM用户管理列表
export const GETHRMUSERMANAGEMENTLIST="qoneapi/bk/hrmUserManage/queryHrmUserInfoPage";
//获取预申请查询列表
export const  GETPREAPPLIST="qoneapi/bk/preApplyManage/getAllPreAppInfo";
//获取申请状态映射列表
export const GETSTATUSMAPPINGLIST="qoneapi/bk/map/getAppStatusMappingList";
//删除申请状态映射
export const DELETE_APP_STATUSMAPPING="qoneapi/bk/map/deleteAppStatusMapping/";
//根据申请ID获取申请状态映射详细
export const GETAPPSTATUSMAPPINGBYID="qoneapi/bk/map/getAppStatusMappingById/";
//获取热更新列表
export const GET_HOT_UPDATE_LIST="qyjApi/bk/versionManage/getMinoVersionManageList";
/*热更新包管理编辑*/
export const UPMINOVERSION="qyjApi/bk/versionManage/upMinoVersion";
//热更新包管理新增
export const ADD_MINO_VERSION="qyjApi/bk/versionManage/addMinoVersion";
//热更新包管理删除
export const DEL_HOT_UPDATE_DATA_BY_ID="qyjApi/bk/versionManage/deleteMinoVersion";
//版本管理启用和禁用
export const DISABLE_VERSION="qyjApi/bk/versionManage/disableVersion";
//热更新包管理删除
export const SETHOTSTATE="qyjApi/bk/versionManage/disableMinoVersion";
//清除绑定
export const CLEARBINDING ="qoneapi/bk/cache/cleanCacheByKey";

