import "babel-polyfill";
import angular from 'angular';
import sanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import 'ng-table';
import * as _ from 'lodash';
import 'angular-ui-bootstrap';
import uiBootstrap from 'angular-ui-bootstrap';
import toastr from 'angular-toastr';
import  ngCookies from 'angular-cookies';
import fileUpload from 'ng-file-upload';
//import 'ng-file-upload';


import '../../node_modules/moment';
import 'bootstrap';
import 'angular-bootstrap-datetimepicker';
import '../../node_modules/isteven-angular-multiselect/isteven-multi-select.css';
import '../lib/isteven-multi-select.js';
import '../../node_modules/metismenu/dist/metisMenu.min';
import '../../node_modules/metismenu/dist/metisMenu.min.css';
import  '../styles/loader.css';
import './controllers';
import './services';
import './directives';
import './filter/main.filter';
import '../lib/jquery-ui.min';
import '../../node_modules/datatables.net-select-dt/css/select.dataTables.css';


//app js
import UtilsService from './basic.server';
import appConfig from './config';

//css
import '../styles/main.css';
import '../styles/golbal.css';
import '../styles/timeline.css';
import '../styles/app.css';
import '../styles/font.css';
import '../styles/vendor.css';

 import '../../node_modules/bootstrap/dist/css/bootstrap.css';

import '../../node_modules/angular-toastr/dist/angular-toastr.css';
import '../../node_modules/angular-bootstrap-datetimepicker/src/css/datetimepicker.css';
import '../../node_modules/angular-tooltips/dist/angular-tooltips.js';
import '../../node_modules/angular-tooltips/dist/angular-tooltips.min.css';
import '../../node_modules/angular-ui-switch/angular-ui-switch.js';
import '../../node_modules/angular-ui-switch/angular-ui-switch.css';


import '../../node_modules/angularjs-dropdown-multiselect/dist/index.css';
import '../../node_modules/angularjs-dropdown-multiselect/dist/src/angularjs-dropdown-multiselect';


import  '../../node_modules/datatables.net-fixedcolumns/js/dataTables.fixedColumns';

import '../../node_modules/fullcalendar/dist/fullcalendar.css';
import '../../node_modules/fullcalendar/dist/fullcalendar';





let homeModule = angular.module('opchannelapp',
    [uiRouter, uiBootstrap, toastr, 'ngTable', sanitize, 'directives', 'controller', 'services', 'main.filter', fileUpload,
        'ui.bootstrap.datetimepicker', 'isteven-multi-select', 'ui.bootstrap.pagination', '720kb.tooltips', 'uiSwitch', ngCookies,
        'angularjs-dropdown-multiselect']);

homeModule.factory('UtilsService', UtilsService);
homeModule.config(appConfig);

/**
 * 程序run时，请求接口，获取权限数据
 * */
// let permissionList;
// homeModule.run(function ($q, permissions) {
//     permissions.setPermissions(permissionList);
// });
angular.element(document).ready(function () {
    angular.bootstrap(document, ['opchannelapp']);
});
