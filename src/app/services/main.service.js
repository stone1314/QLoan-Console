import md5 from '../../../node_modules/md5/md5';
angular.module('services')
    .factory('HttpInterceptor', ["$q", "$rootScope","$location", function ($q, $rootScope,$location) {
        var httpInterceptor = {
            request: function (config) {
                config.headers = config.headers || {};
                if (!(typeof ($rootScope.currentuser_name) == "undefined")){
                    //config.headers["userCode"] = encodeURI($rootScope.currentuser_name);
                    config.headers.userCode = encodeURI($rootScope.currentuser_name);
                    config.headers.userName = encodeURI($rootScope.currentuser_name);
                    config.headers.email = $rootScope.currentuser_email;
                }
                return config;
            },
            response: function (response){
                if (response.status == "200" && response.data.responseCode == "00401") {
                    $location.path('/login');
                }

                // $rootScope.isShowLoading = false;
                return response;
            },
            requestError: function (rejection){
                // $rootScope.isShowLoading = false;
                return rejection;
            },
            responseError: function (rejection){
                // $rootScope.isShowLoading = false;
                return rejection;
            }
        };
        return httpInterceptor;
    }])

    .factory('UpLoadService', ['$q', 'UtilsService', 'Upload', function ($q, UtilsService, Upload) {
        return {
            UpLoadFile: function (url, postData) {
                let deferred = $q.defer();
                Upload.upload({
                    headers: {'authorization': UtilsService.getUserToken()},
                    url: UtilsService.getFileServerIp() + url,
                    data: postData
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    deferred.notify(progressPercentage)
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }
        };
    }])

    .factory('permissions', ['$rootScope','$cookieStore', function ($rootScope,$cookieStore) {
        return {
            setPermissions: function (permissions) {
                if(permissions) {
                    //$cookieStore.put("currentuser",permissions.menuList);
                    //$cookieStore.put("currentuser_obj",permissions);
                    $rootScope.$broadcast('permissionsChanged');
                }
            },
            hasPermission: function (cu, permission) {
                let isShowDom = false;
                permission = permission.trim();
                if(cu!=undefined||cu!=null){
                    angular.forEach(cu.permList, function (item, index, array) {
                        if (item === permission) {
                            isShowDom = true;
                        }
                    });
                }
                return isShowDom;
            }
        };
    }])

    .factory('encryptionServer', ['$rootScope', '$location', function ($rootScope,$location) {
        return {
            makeSign: function (obj) {
                if(obj) {
                    let sign = md5(JSON.stringify(obj) + md5("QLOAN"));
                    obj.sign = sign;
                    return obj;
                }
            },
            checkSign: function (obj) {
                if(obj) {
                    let obj_sign = obj.sign;
                    delete obj.sign;
                    let sign = md5(JSON.stringify(obj) + md5("QLOAN"));
                    return obj_sign == sign;
                }
            },
            saveCurrentUserInfo: function(key, obj){
                if(window.sessionStorage){
                    let storage = window.sessionStorage;
                    let safetyValue = this.makeSign(obj);
                    storage.setItem(key, JSON.stringify(safetyValue));
                }
            },
            getCurrentUserInfo: function(key){

                if(window.sessionStorage) {
                    let storage = window.sessionStorage;
                    let result = JSON.parse(storage.getItem(key));
                    if (this.checkSign(result)) {
                        //console.log("获取成功");
                        return result;
                    }
                    else {
                        console.log("获取失败");
                         $location.path('/login');
                    }
                }else{
                    toastr.warning("该浏览器不支持sessionStorage,建议使用IE8以上浏览器！", "warning");
                }
            }
        };
    }])

    .factory('sessionStorageServer', ["$rootScope", function ($rootScope) {
        return {
            setItem: function (key) {

            },
            getItem: function (key) {


            }
        };
    }])

    .factory('LoadingService', ["$rootScope", function ($rootScope) {
        return {
            showLoading: ()=> {
                $rootScope.isShowLoading = true;
            },
            hideLoading: ()=> {
                $rootScope.isShowLoading = false;
            }
        };
    }]);