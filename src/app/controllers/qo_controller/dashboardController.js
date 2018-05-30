/**
 * Created by HaihuaHuang on 2017/7/19.
 */

import echarts from  'echarts';

DashboardController.$inject = ['$scope', '$location', 'DashBoardService', 'toastr', '$timeout', '$rootScope']
function DashboardController($scope, $location, DashBoardService, toastr, $timeout, $rootScope) {
    $scope.init = function () {
        /*      var commonlinksChart = echarts.init(document.getElementById('commonlinksChart'));
         console.log(commonlinksChart);*/
        DashBoardService.getAppState().then(function (result) {
            console.log(result);
            if (result.responseStatus) {
                var data = result.body;
                $scope.Model = {
                    preAppOk: data.preAppOk,
                    preAppSubmited: data.preAppSubmited,
                    apping: data.apping,
                    appMadeloan: data.appMadeloan
                };
            }
        });

        $scope.getDraw();
    };

    $scope.getDraw = function () {
        // 基于准备好的dom，初始化echarts实例
        var commonlinksChart = echarts.init(document.getElementById('commonlinksChart'));
        /*  DashBoardService.getEcharts().then(function (result) {
         console.log(result);*/
        var result = {
            "took": 7,
            "timed_out": false,
            "_shards": {
                "total": 10,
                "successful": 10,
                "failed": 0
            },
            "hits": {
                "total": 876,
                "max_score": 0,
                "hits": []
            },
            "aggregations": {
                "2": {
                    "buckets": [
                        {
                            "key_as_string": "2017-08-07T00:00:00.000+08:00",
                            "key": 1502035200000,
                            "doc_count": 3
                        },
                        {
                            "key_as_string": "2017-08-07T06:00:00.000+08:00",
                            "key": 1502056800000,
                            "doc_count": 1
                        },
                        {
                            "key_as_string": "2017-08-07T09:00:00.000+08:00",
                            "key": 1502067600000,
                            "doc_count": 48
                        },
                        {
                            "key_as_string": "2017-08-07T12:00:00.000+08:00",
                            "key": 1502078400000,
                            "doc_count": 39
                        },
                        {
                            "key_as_string": "2017-08-07T15:00:00.000+08:00",
                            "key": 1502089200000,
                            "doc_count": 28
                        },
                        {
                            "key_as_string": "2017-08-07T18:00:00.000+08:00",
                            "key": 1502100000000,
                            "doc_count": 25
                        },
                        {
                            "key_as_string": "2017-08-07T21:00:00.000+08:00",
                            "key": 1502110800000,
                            "doc_count": 2
                        },
                        {
                            "key_as_string": "2017-08-08T06:00:00.000+08:00",
                            "key": 1502143200000,
                            "doc_count": 2
                        },
                        {
                            "key_as_string": "2017-08-08T09:00:00.000+08:00",
                            "key": 1502154000000,
                            "doc_count": 39
                        },
                        {
                            "key_as_string": "2017-08-08T12:00:00.000+08:00",
                            "key": 1502164800000,
                            "doc_count": 42
                        },
                        {
                            "key_as_string": "2017-08-08T15:00:00.000+08:00",
                            "key": 1502175600000,
                            "doc_count": 54
                        },
                        {
                            "key_as_string": "2017-08-08T18:00:00.000+08:00",
                            "key": 1502186400000,
                            "doc_count": 33
                        },
                        {
                            "key_as_string": "2017-08-09T00:00:00.000+08:00",
                            "key": 1502208000000,
                            "doc_count": 4
                        },
                        {
                            "key_as_string": "2017-08-09T06:00:00.000+08:00",
                            "key": 1502229600000,
                            "doc_count": 2
                        },
                        {
                            "key_as_string": "2017-08-09T09:00:00.000+08:00",
                            "key": 1502240400000,
                            "doc_count": 50
                        },
                        {
                            "key_as_string": "2017-08-09T12:00:00.000+08:00",
                            "key": 1502251200000,
                            "doc_count": 31
                        },
                        {
                            "key_as_string": "2017-08-09T15:00:00.000+08:00",
                            "key": 1502262000000,
                            "doc_count": 37
                        },
                        {
                            "key_as_string": "2017-08-09T18:00:00.000+08:00",
                            "key": 1502272800000,
                            "doc_count": 9
                        },
                        {
                            "key_as_string": "2017-08-09T21:00:00.000+08:00",
                            "key": 1502283600000,
                            "doc_count": 13
                        },
                        {
                            "key_as_string": "2017-08-10T00:00:00.000+08:00",
                            "key": 1502294400000,
                            "doc_count": 1
                        },
                        {
                            "key_as_string": "2017-08-10T09:00:00.000+08:00",
                            "key": 1502326800000,
                            "doc_count": 43
                        }
                    ]
                }
            },
            "status": 200
        };

        if (result.status) {
            console.log(result);
            var data = result;
            var datas = data.aggregations["2"].buckets;
            var dates = [];
            var seriesData = [];
            for (var i = 0; i < datas.length; i++) {
                dates.push(datas[i].key_as_string.substring(0, 10));
                seriesData.push(datas[i].doc_count);
            }
            console.log(seriesData);
            console.log(dates);
            var option = {
                tooltip: {
                    trigger: 'axis',
                    //formatter: '访问:{c0}',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    //data: ['访问']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: dates
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitNumber: 2
                    }
                ],
                color: ['#57c17b'],
                series: [
                    {

                        name: '访问',
                        type: 'bar',
                        data: seriesData
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            commonlinksChart.setOption(option);
         //   commonlinksChart.resize();
        }
        //   });
    };
}
angular.module("controller").controller("DashboardController", DashboardController);


