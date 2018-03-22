angular
    .module('app')
    .controller('MaterialController', function ($scope, $state, Material, $stateParams, ngNotify, $timeout) {
        $scope.materials = [];
        $scope.material = {};

        $scope.load = function() {
            Material
                .find()
                .$promise
                .then(function (results) {
                    $scope.materials = results;
                });
        }
        $scope.load();

        $scope.remove = function (id) {
            if (confirm('Confirm Delete ?')) {
                Material
                    .deleteById({ id: id })
                    .$promise
                    .then(function () {
                        ngNotify.set('Material Deleted.', 'error');
                        $scope.load();
                    });
            }
        };


        $scope.edit = function (id) {
            Material
                .findById({ id: id})
                .$promise
                .then(function (material) {
                    $scope.material = material;
                    $scope.load();
                });
        }

        $scope.save = function () {
            if ($scope.material && $scope.material.id) {
                $scope.material.$save();
                $scope.material = {};
                ngNotify.set('Material Updated.', 'info');
                $scope.load();
            } else {
                Material
                    .create($scope.material)
                    .$promise
                    .then(function (material) {
                        $timeout(function () {
                            $scope.material = {};
                            ngNotify.set('Material Added.', 'success');
                            $scope.load();
                        }, 300);
                    });
            }
        };

    });


    angular
    .module('app')
    .controller('CompanyController', function ($scope, $state, Company, $stateParams, ngNotify, $timeout) {
        $scope.companies = [];
        $scope.company = {};
        $scope.states = ["01 - JAMMU AND KASHMIR","02 - HIMACHAL PRADESH","03 - PUNJAB","04 - CHANDIGARH","05 - UTTARAKHAND","06 - HARYANA","07 - DELHI","08 - RAJASTHAN","09 - UTTAR  PRADESH","10 - BIHAR","11 - SIKKIM","12 - ARUNACHAL PRADESH","13 - NAGALAND","14 - MANIPUR","15 - MIZORAM","16 - TRIPURA","17 - MEGHLAYA","18 - ASSAM","19 - WEST BENGAL","20 - JHARKHAND","21 - ODISHA","22 - CHATTISGARH","23 - MADHYA PRADESH","24 - GUJARAT","25 - DAMAN AND DIU","26 - DADRA AND NAGAR HAVELI","27 - MAHARASHTRA","28 - ANDHRA PRADESH(BEFORE DIVISION)","29 - KARNATAKA","30 - GOA","31 - LAKSHWADEEP","32 - KERALA","33 - TAMIL NADU","34 - PUDUCHERRY","35 - ANDAMAN AND NICOBAR ISLANDS","36 - TELANGANA","37 - ANDHRA PRADESH (NEW)"]
        
        $scope.load = function() {
            Company
                .find()
                .$promise
                .then(function (results) {
                    $scope.companies = results;
                });
        }
        $scope.load();

        $scope.remove = function (id) {
            if (confirm('Confirm Delete ?')) {
                Company
                    .deleteById({ id: id })
                    .$promise
                    .then(function () {
                        ngNotify.set('Company Deleted.', 'error');
                        $scope.load();
                    });
            }
        };


        $scope.edit = function (id) {
            Company
                .findById({ id: id})
                .$promise
                .then(function (company) {
                    $scope.company = company;
                    $scope.load();
                });
        }

        $scope.save = function () {
            if ($scope.company && $scope.company.id) {
                $scope.company.$save();
                $scope.company = {};
                ngNotify.set('Company Updated.', 'info');
                $scope.load();
            } else {
                Company
                    .create($scope.company)
                    .$promise
                    .then(function (company) {
                        $timeout(function () {
                            $scope.company = {};
                            ngNotify.set('Company Added.', 'success');
                            $scope.load();
                        }, 300);
                    });
            }
        };

    });