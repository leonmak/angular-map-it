
angularMaps.directive('worldMap', function ($parse) {
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
      mapWidth: '=mapWidth',
      countryFillColor: '=countryFillColor',
      countryBorderColor: '=countryBorderColor',
      descriptiveText: '=descriptiveText'
    },
    link: function (scope, element, attrs) {
      var MIN_WIDTH=400;
      var MAX_WIDTH=1240;
      var MIN_SCALE=1,
          MAX_SCALE=8;
      if(scope.descriptiveText==null) {
        scope.descriptiveText = '';
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
      if(scope.mapWidth==null || scope.mapWidth < MIN_WIDTH) {
        scope.mapWidth = MIN_WIDTH;
      }

      scope.$watch(function() {
        return scope.worldData;
      }, function() {
          d3.select('svg').remove();
          throttle()
      }, true);

      d3.select(window).on("resize", throttle);

      var zoom = d3.behavior.zoom()
          .scaleExtent([MIN_SCALE, MAX_SCALE])
          .on("zoom", move);

      var width = scope.mapWidth;
      var height = width / 2;

      var projection,path,svg,g;

      var tooltip = d3.select(element[0]).append("div").attr("class", "worldMapTooltip worldMapTooltipHidden");

      setup(width,height);

      function setup(width,height){
        projection = d3.geo.mercator()
                        .translate([0, 0])
                        .scale(width );

        path = d3.geo.path()
                  .projection(projection);

        svg = d3.select(element[0]).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .call(zoom);

        g = svg.append("g");

    }

    var color, data;

    color = getColor();

    function getColor() {
      return d3.scale.linear()
        .domain(scope.valueRange)
        .range(scope.colorRange)
        .clamp(true);
    }

    data = d3.map(scope.worldData, function(d) { return d.countryCode; });

    var topo = worldTopoData.features;

    draw(topo);

    function draw(topo) {

      var country = g.selectAll(".worldMapMycountry").data(topo);

      country.enter().insert("path")
          .attr("class", "worldMapMycountry")
          .attr("d", path)
          .attr("id", function(d,i) { return d.id; })
          .attr("title", function(d,i) { return d.properties.name; })
          .style("fill", function(d, i) {
            var c=scope.countryFillColor;
            if(data) {
              var cData =data.get(d.id);
              if(cData) {
                c = color(cData.value);
              }
            }
            return c;
          })
          .attr("stroke", scope.countryBorderColor);

      var offsetL = element[0].offsetLeft+(width/2)+40;
      var offsetT = element[0].offsetTop+(height/2)+20;

      //tooltips
      var title;
      country
      .on("mousemove", function(d,i) {
          var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

          var tooltipValue=d.properties.name;
          if(data.get(d.id)) {
            tooltipValue += ' '+ scope.descriptiveText + ' : ' + data.get(d.id).value;
          }
          tooltip
            .classed("worldMapTooltipHidden", false)
            .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
            .html(tooltipValue)
        })
      .on("mouseout",  function(d,i) {
          tooltip.classed("worldMapTooltipHidden", true)
        });

    }

    function redraw() {
      width = scope.mapWidth;
      height = width / 2;
      setup(width,height);
      draw(topo);
    }

    function move() {

      var t = d3.event.translate;
      var s = d3.event.scale;

      var h = height / 3;

      t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
      t[1] = Math.min(height / 2 * (s - 1) + h * s, Math.max(height / 2 * (1 - s) - h * s, t[1]));

      zoom.translate(t);
      g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }

    var throttleTimer;
    function throttle() {
      d3.select('svg').remove();
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
        color = getColor();
        data = d3.map(scope.worldData, function(d) { return d.countryCode; });
        redraw();
      }, 200);
    }

    }
  };

  return directiveDefinitionObject;
});