angular
  .module('app')
  .controller('BuiltyController', function ($scope, $state, Party, Vehicle, $stateParams, ngNotify) {
    $scope.pkg = {};
    $scope.builty = {materials: []};

    $scope.addPkg = function (){
      $scope.builty.materials.push($scope.pkg);
      $scope.pkg = {};
    }
    $scope.delPkg = function ($index){
      $scope.builty.materials.splice($index, 1);
    }

    $scope.parties = Party.find();

    $scope.updateContact = function ($element){
      console.log($element);
    }
  });
