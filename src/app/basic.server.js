/**
 * 基础服务
 * $http.get,$http.head,$http.post,$http.put,$http.delete,$http.jsonp,$http.patch
 * */
function UtilsService($http, $q, encryptionServer, $location) {
    return {
        getIp: function () {

            //    return  "http://172.29.20.30:8080/"; //APIENDPOINT
            //return APIENDPOINT; //APIENDPOINT
            // return  "http://172.16.6.42:8080/"; //APIENDPOINT
            //return  "http://172.29.20.29:8080/"; //APIENDPOINT
            // return  "http://172.29.23.29:8080/"; //明杰
            //return "http://qf-shuguangx-03.quark.com:8083/";
            // return "http://172.16.6.42:8082/";
           // return "http://172.29.250.20:10072/";

             return APIENDPOINT;

        },
        getFileServerIp: function () {

            return APIENDPOINT;    //"http://172.16.6.42:8080/"
        },

        query: function (sUrl, sData, sMethod = "post") {
            // sMethod ? sMethod : sMethod = "post";
            return $http({
                headers: {'apiKey': "opc"},
                url: sUrl,
                data: sData,
                cache: false,
                method: sMethod,
                ignoreLoadingBar: false
            });
        },
        downLoad: function (sUrl) {
            return $http({
                headers: {'apiKey': "opc"},
                method: "GET",
                url: sUrl,
                //params: { name: name },
                responseType: 'arraybuffer'
            });
        },
        getUserToken: function () {
            var result = {};
            result = encryptionServer.getCurrentUserInfo("currentuser_obj") || {};
            return result.token || "";
            /*if(result=={}){
                return "";
                $location.path('/login');
            }else{
                return result.token;
            }*/
        },
        get: function (sUrl, sData) {
            return $http({
                headers: {'authorization': this.getUserToken()},
                url: sUrl,
                data: sData,
                cache: false,
                method: "GET",
                ignoreLoadingBar: false
            });
        },
        post: function (sUrl, sData) {
            return $http({
                headers: {'authorization': this.getUserToken()},
                url: sUrl,
                data: sData,
                cache: false,
                method: "POST",
                ignoreLoadingBar: false
            });
        },
        postBlob: function (sUrl, sData) {
            return $http({
                headers: {'authorization': this.getUserToken()},
                url: sUrl,
                data: sData,
                cache: false,
                method: "POST",
                ignoreLoadingBar: false,
                responseType: 'blob'
            });
        },
        put: function (sUrl, sData) {
            return $http({
                headers: {'apiKey': "opc"},
                url: sUrl,
                data: sData,
                cache: false,
                method: "PUT",
                ignoreLoadingBar: false
            });
        },
        delete: function (sUrl, sData) {
            return $http({
                headers: {'authorization': this.getUserToken()},
                url: sUrl,
                data: sData,
                cache: false,
                method: "DELETE",
                ignoreLoadingBar: false
            });
        },
        querySync: function (sUrl, sData, sMethod) {
            sMethod ? sMethod : sMethod = "post";
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            $http({
                url: sUrl,
                data: sData,
                cache: false,
                method: sMethod,
                ignoreLoadingBar: false
            })
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                });
            return deferred.promise;
        },
        $get: function (url) {
            return $http.get(url, {headers: {'apiKey': "opc"}});
        },
        $post: function (url, data) {
            return $http.post(url, data, {headers: {'apiKey': "opc"}});
        },
        $put: function (url) {
            return $http.put(url, {headers: {'apiKey': "opc"}});
        },
        $delete: function (url) {
            return $http.delete(url, {headers: {'apiKey': "opc"}});
        },
    };
}

UtilsService.$inject = ['$http', '$q' ,'encryptionServer'];

export default UtilsService;
