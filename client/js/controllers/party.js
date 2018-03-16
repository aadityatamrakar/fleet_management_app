angular
  .module('app')
  .controller('PartyViewController', function ($scope, $state, Party, $stateParams, ngNotify) {
    $scope.parties = [];
    function getParties() {
      Party
        .find()
        .$promise
        .then(function (results) {
          $scope.parties = results;
        });
    }
    getParties();

    $scope.removeParty = function (id) {
      if(confirm('Confirm Delete ?')) { 
        Party
        .deleteById({id: id })
        .$promise
        .then(function () {
          ngNotify.set('Party Deleted.', 'error');
          getParties();
        });
      }
    };
  });

angular
  .module('app')
  .controller('PartyFormController', function ($scope, $state, Party, $stateParams, $timeout, ngNotify) {
    $scope.party = {};
    if ($stateParams && $stateParams.partyId) {
      Party
        .findById({ id: $stateParams.partyId })
        .$promise
        .then(function (party) {
          $scope.party = party;
        });
    }

    $scope.addParty = function () {
      if($scope.party && $scope.party.id) {
        $scope.party.$save();
        $scope.party = {};
        ngNotify.set('Party Updated.', 'info');
        $state.go('admin.view_party');
      } else {
        Party
        .create($scope.party)
        .$promise
        .then(function (party) {
          $timeout(function (){
            $scope.party = {};
            ngNotify.set('Party Added.', 'success');
          }, 300);
        });
      }
    };

  });
