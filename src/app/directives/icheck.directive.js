/*
/!*
 * Created by HaihuaHuang on 2017/7/28.
 *!/

angular.module("directives", [])
    .directive('inputIcheck', [function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function ($scope, $element, $attrs, $ngModel) {
                console.log(12121212);
                console.log($scope);
                console.log($element);
                console.log($attrs);
                console.log($ngModel);

                $ngModel = $ngModel || {
                        "$setViewValue": angular.noop
                    }
                $ngModel.$render = function () {
                    if ($ngModel.$modelValue == undefined) {
                        $ngModel.$setViewValue(false);
                    } else {
                        $ngModel.$setViewValue($ngModel.$modelValue);
                    }
                    if ($ngModel.$modelValue == true) {
                        $($element).find(".icheckbox_square-green").addClass("checked");
                    } else {
                        $($element).find(".icheckbox_square-green").removeClass("checked");
                    }
                }
                $($element).iCheck({
                    labelHover: false,
                    cursor: true,
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green',
                    increaseArea: '20%'
                }).on('ifClicked', function (event) {
                    $ngModel.$setViewValue(!$ngModel.$modelValue);
                    $timeout(function () {
                        if (!$ngModel.$modelValue) {
                            $($element).find(".icheckbox_square-green").addClass("checked");
                        } else {
                            $($element).find(".icheckbox_square-green").removeClass("checked");
                        }
                    });

                });
            }
        };
    });
*/
