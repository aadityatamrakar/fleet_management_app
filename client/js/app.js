
angular
  .module('app', [
    'lbServices',
    'ui.router',
    'ngNotify', 'angular-loading-bar'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,
    $urlRouterProvider) {
    console.log('Angular Init');
    $stateProvider
      .state('public', {
        abstract: true,
        url: '/public',
        templateUrl: 'views/nav.html'
      })
      .state('admin', {
        abstract: true,
        url: '/admin',
        templateUrl: 'views/nav_admin.html',
        controller: 'navAdminController'
      })

      .state('admin.index', {
        url: '/index',
        templateUrl: 'views/admin/index.html'
      })

      .state('admin.add_party', {
        url: '/party/add',
        templateUrl: 'views/party/add.html',
        controller: 'PartyFormController'
      })
      .state('admin.edit_party', {
        url: '/party/:partyId/edit',
        templateUrl: 'views/party/add.html',
        controller: 'PartyFormController'
      })
      .state('admin.view_party', {
        url: '/party/view',
        templateUrl: 'views/party/view.html',
        controller: 'PartyViewController'
      })

      .state('admin.add_vehicle', {
        url: '/vehicle/add',
        templateUrl: 'views/vehicle/add.html',
        controller: 'VehicleFormController'
      })
      .state('admin.edit_vehicle', {
        url: '/vehicle/:vehicleId/edit',
        templateUrl: 'views/vehicle/add.html',
        controller: 'VehicleFormController'
      })
      .state('admin.view_vehicle', {
        url: '/vehicle/view',
        templateUrl: 'views/vehicle/view.html',
        controller: 'VehicleViewController'
      })

      .state('admin.material', {
        url: '/material/index',
        templateUrl: 'views/admin/material.html',
        controller: 'MaterialController'
      })
      .state('admin.company', {
        url: '/company/index',
        templateUrl: 'views/admin/company.html',
        controller: 'CompanyController'
      })

      .state('admin.builty', {
        url: '/builty/create',
        templateUrl: 'views/admin/builty.html',
        controller: 'BuiltyController'
      })

      .state('admin.setting', {
        url: '/setting',
        templateUrl: 'views/admin/setting.html',
        controller: 'SettingController'
      })

      .state('public.index', {
        url: '/index',
        templateUrl: 'views/public/login.html'
      });

    $urlRouterProvider.otherwise('/public/index');
  }]);
