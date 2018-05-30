/**
 * Created by V-XiongXiang on 2017/7/25.
 */


angular.module('directives')
    .directive('angularTable', [function () {
        return {
            restrict: 'A',
            scope: {
                model: '='
            },
            link: function ($scope, $element, $attrs) {
                $scope.model.dom = '<"top">rt<"bottom"p><"clear"i>';
                $scope.model.sPaginationType = "full_numbers";
                $scope.model.bAutoWidth = false;        //是否自适应宽度
                $scope.model.iDisplayLength = 10;        //用于指定一屏显示的条数，需开启分页器
                $scope.model.bServerSide = true;         //是否想服务器端传递参数，用于服务端分页。
                $scope.model.bPaginate = true;           //是否显示分页器
                $scope.model.bFilter = false;            //是否启用客户端过滤器
                /*$scope.model.bLengthChange = false;
                 $scope.model.bFilter = false;*/

                $scope.bScrollInfinite = true;
                $scope.model.oLanguage = {
                    "sProcessing": "<img src='/images/datatable_loading.gif'>  努力加载数据中.",
                    "sLengthMenu": "每页显示 _MENU_ 条记录",
                    "sZeroRecords": "抱歉， 没有找到",
                    "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                    "sInfoEmpty": "没有数据",
                    "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                    "sZeroRecords": "没有检索到数据",
                    "sSearch": "模糊查询:  ",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "前一页",
                        "sNext": "后一页",
                        "sLast": "尾页"
                    }
                }

                var table = $('#' + $attrs.id).DataTable($scope.model);

                new $.fn.dataTable.FixedColumns(table, $scope.model.column);


                // 选中行  单选
                 $('#' + $attrs.id + ' tbody').on('click', 'tr', function () {
                    $(':checkbox[type="checkbox"]').removeAttr('checked');
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                        //  $(this).find("input[type=checkbox]").attr("checked", false);
                    } else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                        $(this).find("input[type=checkbox]").attr("checked", true);
                    }
                });

                // 全选/反选
                // $("#allboxs").click(function () {
                //     var isChecked = $('#allboxs').is(":checked");
                //     var checks = $("input[name^='boxs']");
                //     for(var item=0;item<checks.length;item++){
                //         checks[item].checked=isChecked;
                //     }
                // });
            }

        };
    }]);






























 