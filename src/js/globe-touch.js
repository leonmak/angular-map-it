angularMaps.directive('globeTouch', function ($parse) {
  var directiveDefinitionObject = {
    //We restrict its use to an element
    //as usually  <globe> is semantically
    //more understandable
    restrict: 'E',
    //this is important,
    //we don't want to overwrite our directive declaration
    //in the HTML mark-up
    replace: false,
    //our data source would be json passed thru globe-data attribute
    //globe data value range would be an array of size 2 passed thru value-range attribute
    //color range would be an array of size 2 passed thru color-range attribute
    //dimension would be number passed thru dimension attribute
    scope: {
      worldData: '=worldData',
      valueRange: '=valueRange',
      colorRange: '=colorRange',
      dimension: '=dimension',
      countryFillColor: '=countryFillColor',
      countryBorderColor: '=countryBorderColor'
    },
    link: function (scope, element, attrs) {
      var MIN_DIMENSION=200;
      var MAX_DIMENSION=800;
      if(scope.dimension==null) {
        scope.dimension = 600;
      }
      if(scope.colorRange==null) {
        scope.colorRange = ["#F03B20", "#FFEDA0"];
      }
      if(scope.valueRange==null) {
        scope.valueRange = [0, 100];
      }
      if(scope.worldData==null) {
        scope.worldData = [];
      }
      if(scope.countryFillColor==null) {
        scope.countryFillColor = "#aaa";
      }
      if(scope.countryBorderColor==null) {
        scope.countryBorderColor = "#fff";
      }


      if(scope.dimension<MIN_DIMENSION) {
        scope.dimension=MIN_DIMENSION;
      }
      var feature;
      var MIN_SCALE=scope.dimension/MIN_DIMENSION;
      var MAX_SCALE=MAX_DIMENSION/100;
      var scale = MIN_SCALE;
      var translateX = scope.dimension/2,
          translateY = scope.dimension/2;

      var projection = d3.geo.azimuthal()
          .scale(scale*100)
          .origin([16.07, 43.3])
          .mode("orthographic")
          .translate([translateX, translateY]);

      var circle = d3.geo.greatCircle()
          .origin(projection.origin());

      var path = d3.geo.path()
          .projection(projection);

      var m0,
          o0;
      var rotate = [0,0];

      var zoom = d3.behavior.zoom()
          .scaleExtent([MIN_SCALE, MAX_SCALE])
          .on("zoomstart", function(){
            m0 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];
            var proj = rotate;
            o0 = [-proj[0],-proj[1]];

            d3.event.sourceEvent.stopPropagation();
          })
          .on("zoom", function() {
            if (m0) {
              var constant = (scale < 4) ? 4 : scale * 2;

              var m1 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY],
                  o1 = [o0[0] + (m0[0] - m1[0]) / constant, o0[1] + (m1[1] - m0[1]) / constant];

            }

            rotate = [-o1[0], -o1[1]];
            if(d3.event.scale >= MIN_SCALE) {
              scale = d3.event.scale;
              if(d3.event.scale >= MAX_SCALE) {
                scale = MAX_SCALE;
              }
            } else {
              scale = MIN_SCALE;
            }

            projection.scale(scale*100);
            refresh(50);
          });

      var m0,
          o0, m1, o1;

      function dragstart() {
        d3.event.sourceEvent.stopPropagation();
      }
      function ondrag() {
        var m1 = [d3.event.x, d3.event.y],
              o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
        projection.origin(o1);
        circle.origin(o1);

        refresh();

        m0=m1;
        o0=o1;
      }
      function dragend() {
      }

      var drag = d3.behavior.drag();
              drag.on("dragstart", dragstart)
              .on("drag", ondrag)
              .on("dragend", dragend);

      var svg = d3.select(element[0])
          .append("svg:svg")
          .attr("width", scope.dimension)
          .attr("height", scope.dimension)
          .call(zoom)
          .call(drag);

      var color, data;

      color = d3.scale.linear()
        .domain(scope.valueRange)
        .range(scope.colorRange)
        .clamp(true);

      data = scope.worldData;
      data = d3.map(scope.worldData, function(d) { return d.countryCode; });



      feature = svg.selectAll("path")
          .data(worldTopoData.features)
          .enter().append("svg:path")
          .attr("d", clip)
          .attr("fill", scope.countryFillColor)
          .attr("stroke", scope.countryBorderColor);

      feature.append("svg:title")
          .text(function(d) { return d.properties.name; });

      feature.filter(function(d) { return data.has(d.id); })
          .style("fill", function(d) { var c= color(data.get(d.id).value); return c; });




      function refresh(duration) {
        (duration ? feature.transition().duration(duration) : feature).attr("d", clip);
      }

      function clip(d) {
        return path(circle.clip(d));
      }

    }
  };

  return directiveDefinitionObject;
});
