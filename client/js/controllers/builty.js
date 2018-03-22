angular
  .module('app')
  .controller('BuiltyController', function ($scope, $state, Material, Setting, Party, Vehicle, $stateParams, ngNotify, $filter) {
    $scope.pkg = {};
    var today = $filter('date')(new Date(), 'dd/MM/yyyy');
    $scope.pickup_point = [];
    $scope.setting = {};
    $scope.materials = Material.find();

    function getSetting(cb) {
      Setting.find()
        .$promise
        .then(function (setting) {
          $scope.setting = {};
          setting.forEach(element => {
            $scope.setting[element.name] = element.value;
          });
          cb();
        })
    }
    getSetting(function () {
      $scope.builty.gr_no_view = ($scope.setting.gr_prefix) ? $scope.setting.gr_prefix : '';
      $scope.builty.gr_no_view += $scope.builty.gr_no;
      $scope.builty.gr_no_view += ($scope.setting.gr_suffix) ? $scope.setting.gr_suffix : '';
      $scope.pickup_point = $scope.setting.pickup_point.split(',');
    });

    $scope.builty = { materials: [], gr_date: today, gr_no: 1 };

    $scope.addPkg = function () {
      $scope.pkg.total = parseFloat($scope.pkg.rate) * parseFloat($scope.pkg.quantity);
      $scope.builty.materials.push($scope.pkg);
      $scope.pkg = {};
      calculate_freight();
    }
    $scope.delPkg = function ($index) {
      $scope.builty.materials.splice($index, 1);
      calculate_freight();
    }

    $scope.parties = Party.find();

    $scope.updateContact = function ($element) {
      var index = ($scope.parties.map(c => { return c.id })).indexOf($scope.builty[$element]);
      var party = $scope.parties[index];
      $scope.builty[$element + '_address'] = party.address;
      $scope.builty[$element + '_contact'] = party.contact;
      $scope.builty[$element + '_gstin'] = party.gstin;
    }

    $scope.updateMaterial = function () {
      var index = ($scope.materials.map(c => { return c.name })).indexOf($scope.pkg.material);
      var material = $scope.materials[index];
      $scope.pkg.uom = material.uom;
      $scope.pkg.rate = material.rate;
    }
    
    $scope.updatePaidBy = function (){
      
    }

    function calculate_freight() {
      $scope.builty.freight = 0;
      $scope.builty.materials.forEach(e => {
        $scope.builty.freight += parseFloat(e.total);
      })
    }

    function init() {
      $('select[data-type="select2"]').select2({
        placeholder: "--select--",
        allowClear: true
      });
    }
    init();
  });
