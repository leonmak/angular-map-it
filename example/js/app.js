var myApp = angular.module('myApp', ['angular-map-it']);
myApp.controller('Ctrl', ['$scope', function($scope) {

    $scope.valueRange = [0,100];
    $scope.colorRange = ["#F03B20", "#FFEDA0"];
    $scope.dimension = 600;
    $scope.mapWidth = 600;
    $scope.descriptiveText = 'failure %';
    $scope.countryFillColor = "#aaa";
    $scope.countryBorderColor = "#fff";
    $scope.worldData = [
        {
          "countryCode": "AFG",
          "value": 10
        },
        {
          "countryCode": "USA",
          "value": 99
        },
        {
          "countryCode": "CAN",
          "value": 50
        },
        {
          "countryCode": "ISR",
          "value": 2
        },
        {
          "countryCode": "NLD",
          "value": 30
        }
      ];
}]);
