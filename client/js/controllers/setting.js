angular
  .module('app')
  .controller('SettingController', function ($scope, $state, Setting, $stateParams, ngNotify) {
    $scope.setting = {};
    $scope.saved = {};

    function getSetting() {
      Setting.find()
        .$promise
        .then(function (setting) {
          $scope.setting = {};
          setting.forEach(element => {
            $scope.saved[element.name] = element;
            $scope.setting[element.name] = element.value;
          });
        })
    }
    getSetting();

    $scope.saveSetting = function () {
      var setting = Object.keys($scope.setting);
      setting.forEach(e => {
        if ($scope.saved[e]) {
          $scope.saved[e].value = $scope.setting[e];
          $scope.saved[e].$save();
        } else {
          var data = { name: e, value: $scope.setting[e] };
          Setting.create(data)
        }
      });
      ngNotify.set('Settings Updated.', 'success');
    }
  });