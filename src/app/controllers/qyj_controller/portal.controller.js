PortalController.$inject = ['$scope', 'PortalService','$filter','$timeout','toastr', 'UserInfoService', "$q"];
const today = new Date().setDate(new Date().getDate());
const yesterday = new Date().setDate(new Date().getDate() - 1);

function PortalController($scope,PortalService,$filter,$timeout,toastr, UserInfoService, $q) {
    let dateFilter = $filter('date');
    $scope.btnName1 = "<i class='icon-icon-filter-outline'></i> 选择类型 ";
    $scope.btnName2 = "<i class='icon-icon-filter-outline'></i> 选择渠道或应用市场 ";
    $scope.btnClass = "btn btnSelect dropdown-toggle";
    $scope.localLang = {
        selectAll: "全选",
        selectNone: "全不选",
        reset: "重置",
        search: "搜索...",
        nothingSelected: "请选择"
    };

    $scope.viewModel={
        overview: {
            selectDay: 1,
            startDate: new Date().setDate((new Date()).getDate() - 7),
            endDate: today,
            searchStatisticData: () => {
                let startTime = new Date($scope.viewModel.overview.startDate).setHours(23, 59, 59, 0);
                let endTime = new Date($scope.viewModel.overview.endDate).setHours(23, 59, 59, 0);
                if(startTime < endTime){
                    $scope.viewModel.chat1.dataShow = true;
                    return getStatisticsData();
                }else{
                    toastr.error("开始时间必须小于结束时间！");
                    $scope.viewModel.chat1.dataShow = false;
                    $scope.viewModel.chat1.textShow = "您选择的时间范围有误，暂无数据！"
                }
            }
        },
        view1:{
            name:"",
            value:""
        },
        viewDataList:{},
        viewShow:false,
        showText:"loading.....",
        legendList:[],
        chat1: {
            dataShow: true,
            textShow: ""
        },
        chat2: {
            dataShow: true,
            textShow: "",
            loading: false,
            dataType: [
                {"dataCode":"0", "dataName":"渠道", selected: true},
                {"dataCode":"1", "dataName":"应用市场", selected: true}
            ],
            dataTypeSelect: [],
            detailChannel: [],
            detailChannelSelect: [],
            channel: [],
            appMarket: [],
            allChannel: [],
            startDate: new Date().setDate((new Date()).getDate() - 7),
            endDate: today,
            channelDisable: true,
            seachDataType: () => {
                var leg = $scope.viewModel.chat2.dataTypeSelect.length;
                if(leg == 0){
                    clearDetailChannel();  //清空数据
                    toastr.warning("请至少选择一种类型!", "Warning");
                    $scope.viewModel.chat2.textShow = "您还没有选择任何类型，故暂无数据！";
                    $scope.chat2Seach(true);
                }else if(leg == 1){
                    clearDetailChannel();  //清空数据
                    let channelType = getPropList($scope.viewModel.chat2.dataTypeSelect, "dataCode")[0];
                    if(channelType=="0"){
                        $scope.viewModel.chat2.detailChannel = $scope.viewModel.chat2.channel;
                    }else if(channelType=="1"){
                        $scope.viewModel.chat2.detailChannel = $scope.viewModel.chat2.appMarket;
                    }
                    $scope.chat2Seach(true);
                }else if(leg > 1){
                    clearDetailChannel();  //清空数据
                    $scope.viewModel.chat2.detailChannel = $scope.viewModel.chat2.allChannel;
                    $scope.chat2Seach(true);
                }
            },
            changeDatePicker:() => {
                let startTime = new Date($scope.viewModel.chat2.startDate).setHours(23, 59, 59, 0);
                let endTime = new Date($scope.viewModel.chat2.endDate).setHours(23, 59, 59, 0);
                if(startTime > endTime){
                    toastr.error("开始时间必须小于或等于结束时间！");
                    $scope.viewModel.chat2.dataShow = false;
                    $scope.viewModel.chat2.textShow = "您选择的时间范围有误，暂无数据！"
                }else{
                    $scope.viewModel.chat2.dataShow = true;
                    return $scope.chat2Seach(false);
                }
            }
        }
    };
    //私有方法
    let getPropList = function (arr, prop) {
        let result = [];
        angular.forEach(arr, (item) => {
            result.push(item[prop]);
        });
        return result;
    };

    //清空二级下拉框数据
    let clearDetailChannel = function(){
        $scope.viewModel.chat2.detailChannel = [];
        $scope.viewModel.chat2.detailChannelSelect = [];
    };

    //获取二级下拉框数据
    let getAllChannel = function(channelType){
        return UserInfoService.getChannelSelect(channelType).then(function (data) {
            if(data.responseCode == "10000"){
                if(channelType == "0"){
                    $scope.viewModel.chat2.channel = angular.copy(data.body); //渠道
                }else if(channelType == "1"){
                    $scope.viewModel.chat2.appMarket = angular.copy(data.body); //应用市场
                }
            }else{
                toastr.error(data.responseMsg, "error");
            }
        });
    };


    $scope.changeSelectDay=function (day) {
        $scope.viewModel.overview.selectDay = day;
        getKeyData();
    };

    $scope.initPage = function(){
        getKeyData();
        getStatisticsData();

        $q.all([
            getAllChannel("0"),  //渠道
            getAllChannel("1"),  //应用市场
        ]).then(function(){
            var result = [];
            angular.forEach($scope.viewModel.chat2.channel, (item)=> {
                result.push(item);
            });
            angular.forEach($scope.viewModel.chat2.appMarket, (item)=> {
                result.push(item);
            });
            $scope.viewModel.chat2.detailChannel = angular.copy(result);
            $scope.viewModel.chat2.allChannel = angular.copy(result); //二级下拉框所有数据,留着备用

            //首次刷新页面,初始化报表
            $scope.chat2Seach(true);
        });
    };

    let getKeyData = function () {
        let day =  $scope.viewModel.overview.selectDay;
        return PortalService.getKeyData(day).then((data)=> {
            if(data!=undefined||data!=null){
                if(data.responseStatus==true){
                    $scope.viewModel.viewShow=true;
                    $scope.viewModel.showText="";
                    $scope.viewModel.viewDataList=angular.copy(data.body);
                } else{
                    $scope.viewModel.viewShow=false;
                    $scope.viewModel.showText="请求错误";
                    toastr.error(data.responseMsg, "error");
                }
            } else{
                    toastr.warning("连接不上后端啦！", "warning");
                    $scope.viewModel.viewShow=false;
                    $scope.viewModel.showText="请求失败";
            }


        });
    }

    let getStatisticsData = function () {
        let postData={
            "startDate": dateFilter($scope.viewModel.overview.startDate, 'yyyy-MM-dd'),
            "endDate": dateFilter($scope.viewModel.overview.endDate, 'yyyy-MM-dd'),
        }
        console.log(postData);
        return PortalService.getStatisticData(postData).then((data)=> {
            console.log(data);
            if(data!=undefined||data!=null){
                if(data.responseStatus){
                    $scope.viewModel.legendList=[];
                    angular.forEach(data.body.list, (item)=> {
                        $scope.viewModel.legendList.push(item.name);
                    });
                    let  option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data:$scope.viewModel.legendList,
                        },
                        grid: {
                            left: '5%',
                            right: '5%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type: 'category',
                                boundaryGap: false,
                                data:data.body.labels,
                            }
                        ],
                        yAxis : [
                            {
                                type: 'value',
                                splitNumber: 4        // 数值轴用，分割段数，默认为5

                            }
                        ],
                        series : data.body.list,
                    };
                    // 为echarts对象加载数据
                    $scope.chat1Option=option;
                }
                else{
                    if(data.responseMsg!=null){
                        toastr.error(data.responseMsg, "error");
                    }

                }
            } else{
                toastr.warning("连接不上后端啦！", "warning");
            }


        });
    };

    //给选中的每一项添加selected为true属性
    let getQueryCodes = function(inputArr){
        var result = [];
        angular.forEach(inputArr, (item) => {
            item.selected = true;
            result.push(item);
        });
        return result;
    };

    $scope.chat2Seach = function (first = false) {
        $scope.viewModel.chat2.loading = true;
        let queryCodes = [];
        if($scope.viewModel.chat2.detailChannelSelect.length==0){
            if(first==true){
                let resultArr = getQueryCodes($scope.viewModel.chat2.detailChannel);
                queryCodes = getPropList(resultArr,"code");
            }else{
                toastr["info"]("至少选择一种渠道或应用市场! 无选择时默认选中第一个","温馨提示");
                $scope.viewModel.chat2.detailChannel[0].selected = true;
                queryCodes.push($scope.viewModel.chat2.detailChannel[0].code);
            }
        }else{
            let resultArr = getQueryCodes($scope.viewModel.chat2.detailChannelSelect);
            queryCodes = getPropList(resultArr, "code");
        }

        let postData={
            "startDate": dateFilter($scope.viewModel.chat2.startDate, 'yyyy-MM-dd'),
            "endDate": dateFilter($scope.viewModel.chat2.endDate, 'yyyy-MM-dd'),
            "queryCodes": queryCodes,
        };
        //console.log("参数为: ",postData);
        return PortalService.getChannelAndmarketCompare(postData).then((data)=> {
            if(data!=undefined||data!=null){
                if(data.responseStatus==true){
                    $scope.viewModel.chat2.dataShow=true;
                    let option = {
                        color: ['#61C0DE'],  //['#3398DB']
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {    // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '5%',
                            right: '10%',
                            bottom: '13%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                name: '(渠道/应用市场)',
                                data : data.body.labels,
                                axisTick: {
                                    alignWithLabel: true
                                },
                                axisLabel:{
                                    interval:0,//横轴信息全部显示
                                    rotate:-20,//-20度角倾斜显示
                                }
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                name: '(注册人数)',
                            }
                        ],
                        series : data.body.list
                    };
                    $scope.chat2Option = option;
                    $scope.viewModel.chat2.loading = false;
                } else{
                    //toastr.error(data.responseMsg, "error");
                    $timeout(function () {
                        $scope.viewModel.chat2.loading = false;
                    }, 500);
                    $scope.viewModel.chat2.dataShow = false;
                }
            } else{
                toastr.warning("连接不上后端啦！", "warning");
                $timeout(function () {
                    $scope.viewModel.chat2.loading = false;
                }, 500);
                $scope.viewModel.chat2.dataShow = false;
                $scope.viewModel.chat2.textShow = "连接不上后端,暂无数据";
            }
        });
    };



}

angular.module('controller').controller("PortalController", PortalController);
