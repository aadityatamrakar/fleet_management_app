angular
  .module('app')
  .controller('BuiltyController', function ($scope, $state, Company, Material, Setting, Party, Vehicle, $stateParams, ngNotify, $filter) {
    $scope.pkg = {};
    var today = $filter('date')(new Date(), 'dd/MM/yyyy');
    $scope.pickup_point = [];
    $scope.setting = {};
    $scope.materials = Material.find();
    $scope.companies = Company.find();
    $scope.vehicles = [];
    $scope.vehicle_owner = [];
    $scope.tax_percent = {igst: 0, sgst: 0, cgst: 0};

    function getVehicles(cb) {
      Vehicle.find()
        .$promise
        .then(function (owner) {
          $scope.vehicle_owner = owner;
          owner.forEach(element => {
            element.vehicles.forEach(reg => {
              reg.owner = element.id;
              $scope.vehicles.push(reg);
            })
          });
          if (cb) cb();
        })
    }
    getVehicles();

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

    $scope.updateVehicle = function () {
      var res = $scope.vehicles.filter(c => { if ($scope.builty.vehicle == c.reg_no) { return c } });
      if (res.length > 0) {
        $scope.builty.vehicle_owner = res[0].owner;
        setTimeout(function () {
          $('#vehicle_owner').trigger('change');
        }, 150);
      }
    }

    $scope.updatePaidBy = function (){
      var res;
      if($scope.builty.paid_by == "GTA") {
        res = $scope.companies.filter(c => { if($scope.builty.company == c.id ) return c; });
        var company_state_code = res[0].state.substr(0,2);
        var consignee_state_code = $scope.builty.consignee_gstin.substr(0,2);
        if(company_state_code != consignee_state_code) {
          $scope.tax_percent = {igst: 5, sgst: 0, cgst: 0};
        }else{
          $scope.tax_percent = {igst: 0, sgst: 2.5, cgst: 2.5};
        }
      }else{
        var consignee_state_code = $scope.builty.consignee_gstin.substr(0,2);
        var consignor_state_code = $scope.builty.consignor_gstin.substr(0,2);
        if(consignor_state_code != consignee_state_code) {
          $scope.tax_percent = {igst: 5, sgst: 0, cgst: 0};
        }else{
          $scope.tax_percent = {igst: 0, sgst: 2.5, cgst: 2.5};
        }
      }
    }

    function calculate_freight() {
      $scope.builty.freight = 0;
      $scope.builty.materials.forEach(e => {
        $scope.builty.freight += parseFloat(e.total);
      });
      calculate_tax();
    }

    function calculate_tax() {
      $scope.builty.total = $scope.builty.freight * 1.05;
      $scope.builty.tax = {
        igst: ($scope.tax_percent.igst/100) * $scope.builty.freight,
        sgst: ($scope.tax_percent.sgst/100) * $scope.builty.freight,
        cgst: ($scope.tax_percent.cgst/100) * $scope.builty.freight
      }
    }

    function init() {
      $('select[data-type="select2"]').select2({
        placeholder: "--select--",
        allowClear: true
      });
    }
    init();
  });


/*

  Cash advance report
    GR NO
    Cash Voucher NO
    
  Diesel note
    GR NO
    Cash Voucher NO
    
*/
