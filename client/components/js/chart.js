/* global define */

define(['resource_ctrl', 'd3', 'dc', 'underscore', 'utils'], function(ResourceCtrl, d3, dc, _){
  console.log('construct directive PIECHART');
  var piechart = ResourceCtrl.directive('piechart', function($parse){
    console.log('init directive PIECHART');
    function link(scope, element, attr){
      scope.chart_name = attr.name;
      var component_id = attr.id;
      var globals = scope.$parent.globals;
      var dim = $parse(attr.dimension);
      var dimension = globals.data.dimension(dim);
      var group = dimension.group().reduceCount();
      var chart = dc.pieChart('#' + component_id + ' .panel-body')
        .dimension(dimension)
        //.colors(d3.scale.category20())
        .group(group)
        .height(200)
        .width(200);
      globals.register_renderer('dc', dc.renderAll);
      globals.register_redrawer('dc', dc.redrawAll);
      chart.on('filtered', function(){
        globals.redraw('dc');
      });
    }
    return {
      scope: true,
      restrict: 'E',
      templateUrl: '/components/html/chart.html',
      link: link
    };
  });

  var timeline = ResourceCtrl.directive('timeline', function($parse){
    console.log('init directive timeline');
    function link(scope, element, attr){
      scope.chart_name = attr.name;
      var component_id = attr.id;
      var globals = scope.$parent.globals;
      var scale = attr.scale;
      var dim = $parse(attr.dimension);
      var dimension = globals.data.dimension(function(d){
        return d3.time[scale](new Date(dim(d)));
      });
      var group = dimension.group().reduceCount();

      var chart = dc.barChart('#' + component_id + ' .panel-body')
        .width(400)
        .height(120)
        .dimension(dimension)
        .group(group)
        .x(d3.time.scale().domain([new Date("2013-01-01"), new Date("2013-12-31")]))
        .elasticX(true)
        .xUnits(d3.time[scale + 's'])
        .centerBar(true)
        .gap(1)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .brushOn(true)
        .title(function(d) { return "Value: " + d.value; })
        .renderTitle(true);

      globals.register_renderer('dc', dc.renderAll);
      globals.register_redrawer('dc', dc.redrawAll);
      chart.on('filtered', function(){
        globals.redraw('dc');
      });
    }
    return {
      scope: true,
      restrict: 'E',
      templateUrl: '/components/html/chart.html',
      link: link
    };
  });
  return {piechart: piechart, timeline: timeline};
});
