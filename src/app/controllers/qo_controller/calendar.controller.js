/**
 * Created by V-XiongXiang on 2017/7/26.
 */

import md_calendar from  '../../templates/qo_modal/modal-calendar.html';
import md_show from  '../../templates/qo_modal/modal-show.html';

import moment from  'moment';


CalendarController.$inject = ['$scope', '$uibModal', 'toastr', 'CalendarService', '$filter']
function CalendarController($scope, $uibModal, toastr, CalendarService, $filter) {

    $scope.popup = {opened: false};
    $scope.open = function () {
        if ($scope.popup.opened) {
            $scope.popup.opened = false;
        } else {
            $scope.popup.opened = true;
        }
    };

    $scope.model = {};

    $scope.getDate = function () {

        $('#calendar').fullCalendar('gotoDate', $scope.model.date);
    }

    //初始化日历
    $scope.initialYearCategory = function () {

        /*console.log(moment(1454034250000).format("YYYY-MM-DD"));

         let now = moment().format('LLLL');
         console.log(now);*/

        let modalInstance = $uibModal.open({
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: md_calendar,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.model = {YEAR: ""};

                $scope.save = function () {
                    if (!$scope.model.YEAR) {
                        toastr.info("请输入年！");
                    }

                    CalendarService.setCalendar($scope.model.YEAR).then(function (result) {
                        console.log(result);
                        if (result.responseStatus) {
                            toastr.success("初始日历成功！");
                        } else {
                            toastr.error("初始日历失败！" + result.responseMsg);
                        }
                    });

                }

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

            }]
        });

        /*
         dialog = $dialogs.create('/Calendar/ChoseYear', 'CalendarChoseYearController', null, {
         key: false,
         back: 'static'
         });
         dialog.result.then(function (model) {
         var progress = 31, i = 0;
         var msgs = [
         '连接远程服务器...',
         '清空历史数据...',
         '初始化中,请稍候...',
         '初始化完成!'
         ];
         dlg = $dialogs.wait(msgs[i++], progress);
         var fakeProgress = function () {
         $timeout(function () {
         if (progress < 90) {
         progress += 30;
         $rootScope.$broadcast('dialogs.wait.progress', {msg: msgs[i++], 'progress': progress});
         fakeProgress();
         }
         }, 1000);
         };
         fakeProgress();
         $.post("/Calendar/InitialYearData", {YEAR: model.YEAR}, function (data) {
         if (data.Result) {
         $timeout(function () {
         $rootScope.$broadcast('dialogs.wait.progress', {msg: msgs[i++], 'progress': 100});
         });
         $timeout(function () {
         $rootScope.$broadcast('dialogs.wait.complete');
         window.location.reload();
         }, 3000);
         } else {
         $timeout(function () {
         $rootScope.$broadcast('dialogs.wait.complete');
         });
         $dialogs.error(data.Message);
         }

         });
         });*/

    }

    $scope.init = function () {
        console.log($filter("date")('1454034250000', "yyyy-MM-dd"));
    }

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var calendar = $('#calendar').fullCalendar({
        header: {
            left: 'prev,next',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        today: ["今天"],
        firstDay: 0,
        buttonText: {
            today: '本月',
            month: '月',
            week: '周',
            day: '日',
            prev: '上一月',
            next: '下一月',
        },
        loading: function (bool) {
            console.log(0);
            if (bool)
                $('#loading').show();
            else
                $('#loading').hide();
        },
        viewRender: function (view, element) {

            var viewStart = moment(view.start).format("YYYY-MM-DD");
            var viewEnd = moment(view.end).format("YYYY-MM-DD");

            $("#calendar").fullCalendar('removeEvents');

            var data = {
                "dateStart": viewStart,
                "dateEnd": viewEnd
            };
            console.log(data);
            CalendarService.getMonth(data).then(function (result) {
                console.log(result);
                if (result.responseStatus) {
                    $.each(result.body, function (index, event) {
                        var calData = {
                            title: event.eventTitle,
                            start: moment(event.date).format("YYYY-MM-DD"),
                            textColor: '#666',
                            allDay: true
                        };
                        if (event.eventTitle != '休息日') {
                            calData.textColor = '#fff';
                        }

                        $("#calendar").fullCalendar('renderEvent', calData, true);
                        var date = moment(event.date).format("YYYY-MM-DD");
                        $('.fc-view-container').find('td[data-date=' + date + ']').css('background-color', '#fff');

                    });
                }
            });

        },
        eventRender: function (a, b) {
        },
        eventAfterRender: function (event, element, view) {
            if (event.title == "工作日") {
                $(element).find('.fc-event-title').css('color', '#fff');
            }
        },
        weekends: true,
        selectable: false,
        selectHelper: true,
        eventBackgroundColor: 'transparent',
        eventTextColor: '#ededed',
        eventBorderColor: 'transparent',

        dayClick: function (date, allDay, event, view) {

            var viewStart = moment(event.start).format("YYYY-MM-DD");
            var viewEnd = moment(event.end).format("YYYY-MM-DD");
            var selectdate = moment(date).format("YYYY-MM-DD");


            let modalInstance = $uibModal.open({
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: md_show,
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.model = {'date': selectdate};
                    $scope.yes = function () {
                        CalendarService.setIsWork($scope.model).then(function (result) {
                            console.log(result);
                            if (result.responseStatus) {
                                $("#calendar").fullCalendar('removeEvents');
                                var data = {
                                    "dateStart": viewStart,
                                    "dateEnd": viewEnd
                                };
                                setEvent(data);
                                $uibModalInstance.dismiss('cancel');
                            } else {
                                toastr.error("更改日期状态失败！" + result.reponseMsg);
                            }

                        });
                    }
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }]
            });


        }
        ,
        eventClick: function (event, jsEvent, view) {
         /*   var date = $.fullCalendar.formatDate(event.start, 'yyyy-MM-dd');
            $('.fc-border-separate').find('td[data-date=' + date + ']').click();*/
        }
        ,
        editable: false,
    });

    $('.fc-agendaWeek-button').unbind('click');
    $('.fc-agendaDay-button').unbind('click');

    let setEvent = function (data) {
        CalendarService.getMonth(data).then(function (result) {
            console.log(result);
            if (result.responseStatus) {
                $.each(result.body, function (index, event) {
                    var calData = {
                        title: event.eventTitle,
                        start: moment(event.date).format("YYYY-MM-DD"),
                        textColor: '#666',
                        allDay: true
                    };
                    if (event.eventTitle != '休息日') {
                        calData.textColor = '#fff';
                    }

                    $("#calendar").fullCalendar('renderEvent', calData, true);
                    var date = moment(event.date).format("YYYY-MM-DD");
                    $('.fc-view-container').find('td[data-date=' + date + ']').css('background-color', '#fff');

                });
            }
        });
    }


    //   loadingBar.complete();

}
angular.module("controller").controller("CalendarController", CalendarController)
