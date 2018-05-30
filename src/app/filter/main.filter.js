angular.module('main.filter', [])
/**广告位过滤器*/
    .filter('adFilter', [function () {
        return function (input) {
            if (input && input.length > 0) {
                var content = "<ul class='ul'>";
                angular.forEach(input, function (row, index) {
                    if (row.url && row.url.length > 0) {
                        content += `<li>${row.bannerName}`;
                        if (row.url.length > 3) {
                            angular.forEach(row.url, function (urlRow, index) {
                                if (index < 3) { // 只显示3个
                                    content += `/<a target="_blank" title=${urlRow.campaignUrl} href=${urlRow.campaignUrl} >url链接${index + 1}</a>`;
                                }
                            })
                            content += `...</li>`;
                        } else {
                            angular.forEach(row.url, function (urlRow, index) {
                                content += `/<a target="_blank" title=${urlRow.campaignUrl} href=${urlRow.campaignUrl} >url链接${index + 1}</a>`;
                            })
                            content += `</li>`;
                        }
                    } else {
                        content += `<li>${row.bannerName ? row.bannerName : ''}</li>`;
                    }
                    ;
                })
                content += "</ul>";
                return content;
            }
        }
    }])
    /**渠道过滤器*/
    .filter('channelFilter', [function () {
        return function (input) {
            if (input && input.length <= 5) {
                return input.join("/");
            } else if (input && input.length > 5) {
                return input[0] + "/" + input[1] + "/" + input[2] + "/" + input[3] + "/" + input[4] + "/...";
            }
        }
    }])
    /**渠道名过滤器*/
    .filter('refferalNameFilter', [function () {
        return function (input) {
            if (input && input.length > 0) {
                return input.join(',');
            }
        }
    }])
    /**反馈内容字数过滤*/
    .filter('wordLimitFilter', [function () {
        return function (input) {
            var result = input;
            if (input && input.length > 20) {
                result = input.substring(0, 20) + "......";
            }
            return result;
        }
    }])
    .filter('limitFilter', [function () {
        return function (input) {
            var result = input;
            if (input && input.length > 10) {
                return input.substring(0, 10) + "......";
            }
            return result;
        }
    }])
    /** 教育程度过滤器 */
    .filter('educationFilter', [function () {
        return function (education) {
            if (education == "educationA") {
                return "硕士及以上";
            } else if (education == "educationB") {
                return "本科";
            } else if (education == "educationC") {
                return "大专";
            } else if (education == "educationD") {
                return "高中及以下";
            }
        }
    }])
    /** 婚姻状况过滤器 */
    .filter('marrageFilter', [function () {
        return function (marrage) {
            if (marrage == "marrageSingle") {
                return "未婚";
            } else if (marrage == "marrageCouple") {
                return "已婚";
            } else if (marrage == "marrageDivorced") {
                return "大专";
            } else if (marrage == "marrageOther") {
                return "其他";
            } else if (marrage == "marragelosecouple") {
                return "丧偶";
            }
        }
    }])
    /**贷款用途过滤器**/
    .filter('LoanFilter', [function () {
        return function (loan) {
            if (loan == "LoanPurposeOther") {
                return "其他";
            } else if (loan == "LoanPurposeBusiness") {
                return "经营周转";
            } else if (loan == "LoanPurposePersonal") {
                return "个人资金周转";
            } else if (loan == "LoanPurposeBuy") {
                return "消费";
            } else if (loan == "LoanPurposeinvest") {
                return "创业/投资";
            }
        }
    }])
    /**证件类型过滤器**/
    .filter('idtypeFilter', [function () {
        return function (idType) {
            var result = idType;
            switch (idType) {
                case "Id1":
                    result = "二代身份证";
                    break;
                case "Id2":
                    result = "结婚证";
                    break;
                case "Id3":
                    result = "户口本";
                    break;
                case "Id4":
                    result = "军官证";
                    break;
                case "Id5":
                    result = "护照";
                    break;
                case "Id6":
                    result = "士兵证";
                    break;
                case "Id7":
                    result = "港澳居民来往内地通行证";
                    break;
                case "Id8":
                    result = "台湾同胞来往内地通行证";
                    break;
                case "Id9":
                    result = "临时身份证";
                    break;
                case "Id10":
                    result = "外国人居留证";
                    break;
                case "Id11":
                    result = "警官证";
                    break;
                case "Id12":
                    result = "其他证件";
                    break;
            }
            return result;
        }
    }])
    /**联系人关系过滤器**/
    .filter('relationshipFilter', [function () {
        return function (idType) {
            let result = idType;
            switch (idType) {
                case "relationshipRelOther":
                    result = "其他";
                    break;
                case "relationshipRelMat":
                    result = "同事";
                    break;
                case "relationshipRelFri":
                    result = "朋友";
                    break;
                case "relationshipRelKid":
                    result = "子女";
                    break;
                case "relationshipRelCon":
                    result = "配偶";
                    break;
                case "relationshipRelRel":
                    result = "亲属";
                    break;
                case "relationshipRelPar":
                    result = "父母";
                    break;
                case "relationshipRelDri":
                    result = "司机";
                    break;
                case "relationshipRelRelAndFri":
                    result = "亲属朋友";
                    break;
            }
            return result;
        }
    }])
    /** 文本字典过滤器 */
    .filter('linkFilter', [function () {
        return function (linkType) {
            if (linkType == "text") {
                return "文本";
            }
            else if (linkType == "image") {
                return "图片";
            } else if (linkType == "link") {
                return "链接";
            }
        }
    }])
    /** 消息状态过滤器 */
    .filter('msgStatusFilter', [function () {
        return function (input) {
            if (input == "1") {
                return "已读";
            }
            else if (input == "0") {
                return "未读";
            }
        }
    }])
    /** 用户解锁状态过滤器 */
    .filter('lockFilter', [function () {
        return function (input) {
            if (input == "1") {
                return "锁定";
            }
            else if (input == "0") {
                return "正常";
            }
        }
    }])
    /** 性别过滤器 */
    .filter('genderFilter', [function () {
        return function (input) {
            if (input == "genderF") {
                return "女";
            }
            else if (input == "genderM") {
                return "男";
            }
        }
    }])
    /**渠道类型过滤器**/
    .filter('channelTypeFilter', [function () {
        return function (input) {
            if (input === "1") {
                return "应用市场";
            }
            else if (input === "0") {
                return "渠道";
            }
        }
    }])
    /**渠道状态过滤器**/
    .filter('channelStatusFilter', [function () {
        return function (input) {
            if (input === true) {
                return "有效";
            } else if (input === false) {
                return "无效";
            } else {
                return '未知状态';
            }
        }
    }])
    /**判断采集状态*/
    .filter('certifyStatus', ['$sce', function ($sce) {
        return function (certifyStatusName) {
            if (certifyStatusName == "已跳过") {
                return $sce.trustAsHtml("<label style='color: red;font-weight: normal' >已跳过</label>");
            } else {
                return $sce.trustAsHtml("<label style='color: green;font-weight: normal'>提交成功</label>");
            }
        }
    }])
    .filter('statusFilter', [function (isActive) {
        return function (isActive) {
            if (isActive == false) {
                return "禁用";
            } else {
                return "启用";
            }
        }
    }])
    /** Y,N 转换显示*/
    .filter('YNFilter', [function () {
        return function (input) {
            if (input == 'Y') {
                return '是';
            } else {
                return '否';
            }
        }
    }])
    /** 用户信息认证**/
    .filter('certifyStatusFilter', [function () {
        return function (input) {
            if (input == "0") {
                return "未认证";
            } else if (input == "1") {
                return "待认证";
            } else if (input == "2") {
                return "已认证";
            }
        }
    }])

    /**渠道名和ID过滤器, 支持名称和ID搜索*/
    .filter('refferalNameAndIdFilter', ['$filter', function ($filter) {
        return function (input, param) {
            if (input && param && input.length > 0) {
                if (_.toInteger(param) === 0)
                    return $filter("filter")(input, {'refferalName': param});
                else
                    return $filter("filter")(input, {'id': param});
            }
        };
    }])
    /**格式化手机号*/
     .filter("formatNumber", ['$filter', function ($filter) {
        return function (param) {
            if (param) {
                return param.substring(0, 3) + "******" + param.substring(7, 4);
            }
        };
    }])
    /**屏蔽重要信息*/
    .filter("hideData", ['$filter', function ($filter) {
        return function (param) {
            if (param.length == 11) {
                return param.substring(0, 3) + "******" + param.substring(9, 3);
            } else {
                return param.substring(0, 3) + "****";
            }
        };
    }])

    /**产品信息百分比*/
    .filter('ProductRate', function () {
        return function (input) {
            return (input * 100).toFixed(2) + '%';
        };
    })

    /**关系状态修改*/
    .filter("relationShip", ['CommonService', '$cookieStore', function (CommonService, $cookieStore) {
        return function (param) {
            var relationship = "";
            var data = $cookieStore.get("RELATIONSHIP");
            console.log(param);
            if (!data) {
                CommonService.getRelationShip().then(function (result) {
                    var arr = [];
                    if (result.responseStatus) {
                        var data = result.body[0].RESULT;
                        $.each(data, function (index, value) {
                            arr.push(value);
                        });
                    }
                    $cookieStore.put("RELATIONSHIP", arr);
                });
            } else {
                $.each(data, function (index, value) {
                    if (value.dataCode == param) {
                        relationship = value.dataName;
                        return;
                    }
                });
            }
            return relationship;
        };
    }])

    /**认证状态修改*/
    .filter("CertifyMap", ['CommonService', '$cookieStore', function (CommonService, $cookieStore) {
        return function (param) {
            var map = "";
            var mapdata = $cookieStore.get("CERTIFYMAP");
            if (!mapdata) {
                CommonService.getCertifyStateMap().then(function (result) {
                    var arr = [];
                    if (result.responseStatus) {
                        var data = result.body[0].RESULT;
                        $.each(data, function (index, value) {
                            arr.push(value);
                        });
                    }
                    $cookieStore.put("CERTIFYMAP", arr);
                    mapdata = $cookieStore.get("CERTIFYMAP");
                });
            }

            $.each(mapdata, function (index, value) {
                if (value.dataCode == param) {
                    map = value.dataName;
                    return;
                }
            });

            return map;
        };
    }]);