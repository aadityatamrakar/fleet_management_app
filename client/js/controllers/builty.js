angular
  .module('app')
  .controller('BuiltyController', function ($scope, $state, Builty, Voucher, Company, Material, Setting, Party, Vehicle, $stateParams, ngNotify, $filter) {
    $scope.pkg = {};
    var today = $filter('date')(new Date(), 'dd/MM/yyyy');
    $scope.pickup_point = [];
    $scope.setting = {};
    $scope.materials = Material.find();
    $scope.companies = Company.find();
    $scope.vehicles = [];
    $scope.vehicle_owner = [];
    $scope.builty = { materials: [], gr_date: today, tax_percent: { igst: 0, sgst: 0, cgst: 0 } };
    $scope.vouchers = { cash: [], diesel: [] };
    var gr_no;
    $scope.cash_vch = { date: today };
    Builty.findOne({
      filter: {
        order: 'gr_no DESC',
        fields: { gr_no: 1 }
      }
    }).$promise.then(function (record) {
      if (record && record.gr_no) {
        gr_no = parseInt(record.gr_no) + 1;
      } else gr_no = 1;
      $scope.builty.gr_no = gr_no;
    });

    function getVehicles(cb) {
      Vehicle.find()
        .$promise
        .then(function (owner) {
          $scope.vehicle_owner = owner;
          owner.forEach(function (element) {
            element.vehicles.forEach(function (reg) {
              reg.owner = element.id;
              $scope.vehicles.push(reg);
            })
          });
          if (cb) cb();
        })
    }
    getVehicles();
    $scope.reload = function () {
      window.location.reload();
    }

    function getSetting(cb) {
      Setting.find()
        .$promise
        .then(function (setting) {
          $scope.setting = {};
          setting.forEach(function (element) {
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

    $scope.saveBuilty = function () {
      if (!$scope.builty.hasOwnProperty("id")) {
        if (confirm("Confirm Save ?")) {
          Builty
            .create($scope.builty)
            .$promise
            .then(function (builty) {
              if (builty.id) {
                $scope.builty = builty;
                ngNotify.set('Builty Saved.', 'success');
                $scope.cash_vch.gr_no = builty.gr_no;
                $scope.cash_vch.builtyId = builty.id;
              }
            })
        }else{
          console.log($scope.builty);
        }
      } else {
        $scope.builty.$save();
        ngNotify.set('Builty Updated.', 'success');
      }
    }

    $scope.checkgstin= function(s){
      if(!$scope.builty[s]){
        ngNotify.set('Check GSTIN', 'warn');
      }
    }

    $scope.addCashVoucher = function (type) {
      $scope.cash_vch.type = type;
      Voucher
        .create($scope.cash_vch)
        .$promise.then(function (cash_vch) {
          $scope.vouchers[cash_vch.type].push(cash_vch);
          $scope.cash_vch = { gr_no: $scope.builty.gr_no, builtyId: $scope.builty.id, date: today };
          ngNotify.set('Voucher Added.', 'success');
        });
    }

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
      var index = ($scope.parties.map(function(c) { return c.id })).indexOf($scope.builty[$element]);
      var party = $scope.parties[index];
      $scope.builty[$element + '_name'] = party.legal_name;
      $scope.builty[$element + '_address'] = party.address;
      $scope.builty[$element + '_contact'] = party.contact;
      $scope.builty[$element + '_gstin'] = party.gstin;
    }

    $scope.updateMaterial = function () {
      var index = ($scope.materials.map(function(c) { return c.name })).indexOf($scope.pkg.material);
      var material = $scope.materials[index];
      $scope.pkg.uom = material.uom;
      $scope.pkg.rate = material.rate;
    }

    $scope.updateVehicle = function () {
      var res = $scope.vehicles.filter(function(c) { if ($scope.builty.vehicle == c.reg_no) { return c } });
      if (res.length > 0) {
        $scope.builty.vehicle_owner = res[0].owner;
        setTimeout(function () {
          $('#vehicle_owner').trigger('change');
        }, 150);
      }
    }

    $scope.updatePaidBy = function () {
      var res;
      if ($scope.builty.paid_by == "GTA") {
        res = $scope.companies.filter(function(c) { if ($scope.builty.company == c.id) return c; });
        var company_state_code = res[0].state.substr(0, 2);
        var consignee_state_code = $scope.builty.consignee_gstin.substr(0, 2);
        if (company_state_code != consignee_state_code) {
          $scope.builty.tax_percent = { igst: 5, sgst: 0, cgst: 0 };
        } else {
          $scope.builty.tax_percent = { igst: 0, sgst: 2.5, cgst: 2.5 };
        }
      } else {
        var consignee_state_code = $scope.builty.consignee_gstin.substr(0, 2);
        var consignor_state_code = $scope.builty.consignor_gstin.substr(0, 2);
        if (consignor_state_code != consignee_state_code) {
          $scope.builty.tax_percent = { igst: 5, sgst: 0, cgst: 0 };
        } else {
          $scope.builty.tax_percent = { igst: 0, sgst: 2.5, cgst: 2.5 };
        }
      }
      calculate_tax();
    }

    function calculate_freight() {
      $scope.builty.freight = 0;
      $scope.builty.materials.forEach(function(e) {
        $scope.builty.freight += parseFloat(e.total);
      });
      calculate_tax();
    }

    function calculate_tax() {
      $scope.builty.total = $scope.builty.freight * 1.05;
      $scope.builty.tax = {
        igst: ($scope.builty.tax_percent.igst / 100) * $scope.builty.freight,
        sgst: ($scope.builty.tax_percent.sgst / 100) * $scope.builty.freight,
        cgst: ($scope.builty.tax_percent.cgst / 100) * $scope.builty.freight
      }
    }

    function init() {
      $('select[data-type="select2"]').select2({
        placeholder: "--select--",
        allowClear: true
      });
    }
    init();

    $scope.printBuilty = function () {
      var $company = $scope.companies[$scope.companies.map(function (c) { return c.id; }).indexOf($scope.builty.company)];
      var $builty = $scope.builty;
      var $margin = [];

      var doc = new jsPDF();
      doc.setFont('times');
      doc.rect(5, 35, 200, 120); // Builty
      doc.setFontSize(30);
      doc.text(100, 15, $company.title, null, null, 'center');

      doc.setFontSize(15);
      doc.text(100, 24, $company.address, null, null, 'center');
      doc.text(100, 30, 'PH: '+String($company.contact) + ' GSTIN:' + $company.gstin, null, null, 'center');

      doc.rect(5, 35, 120, 32); // Consignee Details
      doc.setFontSize(20);
      doc.text(8, 44, $builty.consignee_name);
      doc.setFontSize(15);
      doc.text(8, 52, $builty.consignee_address);
      doc.text(8, 58, $builty.consignee_contact);
      doc.text(8, 64, $builty.consignee_gstin);

      doc.rect(5, 67, 120, 32); // Consignor Details
      doc.setFontSize(20);
      doc.text(8, 76, $builty.consignor_name);
      doc.setFontSize(15);
      doc.text(8, 84, $builty.consignor_address);
      doc.text(8, 90, $builty.consignor_contact);
      doc.text(8, 96, $builty.consignor_gstin);

      doc.rect(125, 35, 80, 64); // Basic
      doc.setFontSize(16);
      doc.text(127, 44, 'GR NO');
      doc.text(127, 52, 'DATE');
      doc.setFontSize(18);
      doc.setFontType('bold');
      doc.text(150, 44, ': ' + $builty.gr_no_view);
      doc.setFontType('normal');
      doc.text(150, 52, ': ' + $builty.gr_date);

      doc.rect(125, 55, 80, 22); // Basic
      doc.setFontSize(16);
      doc.text(127, 61, 'Pickup Point');
      doc.text(127, 68, $builty.pickup_point);
      doc.text(127, 74, 'City');
      doc.text(160, 74, ': ' + $builty.from_city);

      doc.text(127, 83, 'Delivery Point');
      doc.text(127, 90, $builty.delivery_point);
      doc.text(127, 96, 'Destination');
      doc.text(160, 96, ': ' + $builty.destination);

      doc.rect(5, 99, 200, 11); // Invoice Details 
      doc.text(8, 106, 'Invoice No : 123');
      doc.text(74, 106, 'Date : 10/05/2018');
      doc.text(150, 106, 'Amount : 25,00,000/-');

      doc.rect(5, 110, 140, 45); // Material Details
      doc.setFontSize(13);
      doc.text(8, 118, 'No of Pkg');
      doc.text(35, 118, 'Material');
      doc.text(78, 118, 'Qty.');
      doc.text(95, 118, 'UOM');
      doc.text(112, 118, 'Rate');
      doc.text(128, 118, 'Total');
      doc.line(8, 121, 138, 121); // material heading line 
      doc.setFontType('normal');
      
      $margin.top = 126;
      $builty.materials.forEach(function (m) {
        doc.text(8,   $margin.top, m.no_of_pkg);
        doc.text(35,  $margin.top, m.material);
        doc.text(85,  $margin.top, String(m.quantity), null, null, 'right');
        doc.text(105, $margin.top, m.uom, null, null, 'right');
        doc.text(120, $margin.top, String(m.rate), null, null, 'right');
        doc.text(138, $margin.top, String(m.total), null, null, 'right');
        $margin.top += 6;
      });

      doc.line(5, 140, 145, 140);
      doc.text(8, 145, 'Consignee Sign');
      doc.text(138, 145, 'GTA Sign', null, null, 'right');

      doc.rect(145, 110, 60, 45); // TOTAL Details
      doc.setFontSize(14);
      doc.text(146, 118, 'FREIGHT');
      doc.text(146, 126, 'IGST');
      doc.text(146, 134, 'CGST');
      doc.text(146, 142, 'SGST');
      doc.text(146, 150, 'TOTAL');
      doc.setFontSize(15);
      doc.text(170, 118, ': ' + String($builty.freight));
      doc.text(170, 126, ': ' + String($builty.tax.igst));
      doc.text(170, 134, ': ' + String($builty.tax.cgst));
      doc.text(170, 142, ': ' + String($builty.tax.sgst));
      doc.setFontType('bold');
      doc.text(170, 150, ': Rs.' + String($builty.total) + '/-');
      doc.setFontType('normal');
      doc.rect(5, 160, 200, 60); // Cash Advance
      doc.rect(5, 225, 200, 60); // Diesel Advance
      doc.save('builty.pdf');
    }
  });

/*

  Cash advance report
    GR NO
    Cash Voucher NO
    
  Diesel note
    GR NO
    Cash Voucher NO
    
*/
