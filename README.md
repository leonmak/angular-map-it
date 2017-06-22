# angular-map-it

Beautiful, reactive, responsive charts for Angular.JS using D3.js


# Dependencies

1. angular ~v1.4
2. d3 v3.3.13


# Installation

```shell
bower install angular-map-it
```

or

copy the files from dist/. Then add the sources to your code (adjust paths as needed) after adding the dependencies for Angular and d3.js first:

```html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/d3/index.js"></script>

<script type="text/javascript" src="js/angular-map-it.js"></script>
```


# Utilisation

There are 3 types of maps so 3 directives:

1. *globe* :- Orthographic projection of world (3D projection) with choropleth coloring enabled, rotate, zoom
2. *globe-touch* :- Orthographic projection of world (3D projection) with touch enabled, choropleth coloring enabled, rotate, zoom
3. *world-map* :- mercator projection with choropleth, zoom option, touch enabled

They all use mostly the same API:

Attribute | Default | Description
----------| ------- | -----------
```world-data``` | empty array | values across the world. Value of each country with country code. our data source would be json passed thru world-data attribute
```value-range``` | [0,100] | world data value range would be an array of size 2 passed thru value-range attribute. It will help color the world based on the value
```color-range``` | ["#F03B20", "#FFEDA0"] | color range would be an array of size 2 passed thru color-range attribute. This will color the world based on the value range.
```dimension``` | 600. Minimum=200. Maximum=800. | dimension would be number passed thru dimension attribute. This is the diameter of the globe
```map-width``` | 600. Minimum=400. Maximum=1240 | width of the world map
```country-fill-color``` | #aaa | default color which fills the country if a country does not have data value
```country-border-color``` | #fff | default color which fills the country border


# Example

## Javascript

```javascript
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

```


## Markup for world-map

```html
<world-map world-data="worldData" value-range="valueRange" color-range="colorRange" dimension="dimension"
map-width="mapWidth" descriptive-text="descriptiveText" country-fill-color="countryFillColor"
country-border-color="countryBorderColor"></world-map>
```

[Plunker Playground](http://plnkr.co/edit/DrPrLs)


## Markup for globe

```html
<globe world-data="worldData" value-range="valueRange" color-range="colorRange" dimension="dimension"
country-fill-color="countryFillColor" country-border-color="countryBorderColor"></globe>
```

[Plunker Playground](http://plnkr.co/edit/W0Y7Joh1mcBXNuFtNnXe)


## Markup for globe-touch

```html
<globe-touch world-data="worldData" value-range="valueRange" color-range="colorRange" dimension="dimension"
country-fill-color="countryFillColor" country-border-color="countryBorderColor"></globe-touch>
```

[Plunker Playground](http://plnkr.co/edit/7cLRe1)