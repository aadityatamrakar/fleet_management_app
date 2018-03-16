angular
  .module('app')
  .controller('VehicleViewController', function ($scope, $state, Vehicle, $stateParams, ngNotify) {
    $scope.vehicles = [];
    function getVehicles() {
      Vehicle
        .find()
        .$promise
        .then(function (results) {
          $scope.vehicles = results;
        });
    }
    getVehicles();

    $scope.remove = function (id) {
      if(confirm('Confirm Delete ?')) { 
        Vehicle
        .deleteById({id: id })
        .$promise
        .then(function () {
          ngNotify.set('Party Deleted.', 'error');
          getVehicles();
        });
      }
    };
  });

angular
  .module('app')
  .controller('VehicleFormController', function ($scope, $state, Vehicle, $stateParams, $timeout, ngNotify) {
    $scope.vehicle = {gst_type: "No", vehicles: []};
    $scope.svehicle = {};

    $scope.addVeh = function (){
      if ($scope.vehicle && $scope.vehicle.vehicles) {
        $scope.vehicle.vehicles.push($scope.svehicle);
        $scope.svehicle = {};
      }
    }
    $scope.removeVeh = function (index){ 
      $scope.vehicle.vehicles.splice(index, 1);
    }

    if ($stateParams && $stateParams.vehicleId) {
      Vehicle
        .findById({ id: $stateParams.vehicleId })
        .$promise
        .then(function (vehicle) {
          $scope.vehicle = vehicle;
        });
    }

    $scope.addVehicle = function () {
      if($scope.vehicle && $scope.vehicle.id) {
        $scope.vehicle.$save();
        $scope.vehicle = {};
        ngNotify.set('Vehicle Updated.', 'info');
        $state.go('admin.view_vehicle');
      } else {
        Vehicle
        .create($scope.vehicle)
        .$promise
        .then(function (vehicle) {
          $timeout(function (){
            $scope.vehicle = {};
            ngNotify.set('Vehicle Added.', 'success');
          }, 300);
        });
      }
    };

  });
