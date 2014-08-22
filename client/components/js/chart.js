/* global define */

define(['resource_ctrl', 'd3', 'dc', 'underscore', 'lenz', 'utils'], function(ResourceCtrl, d3, dc, _, L, utils){
  console.log('construct directive PIECHART');
  var piechart = ResourceCtrl.directive('piechart', function($parse){
    console.log('init directive PIECHART');
    function link(scope, element, attr){
      scope.widget_name = attr.name;
      scope.widget_id = attr.id
      scope.globals = scope.$parent.globals;
      scope.settings = {
        dimension: {name: 'dimension', label: 'Field', type: 'text', tip: 'The name of a field.', value: '' }, 
        redmethod: {name: 'redmethod', label: 'Reduce Method', type: 'choice', tip: 'JSON / CSV', choice: ['reduceSum', 'reduceCount'], value: 'reduceCount'},
      };
      scope.settings.dimension.value = attr.dimension;

      var chart = dc.pieChart('#' + scope.widget_id + ' .panel-body');
      scope.chart = chart;
      function mkchart(){
        var $globals = scope.globals;
        var accessor = L.deep_property(utils.undotted(scope.settings.dimension.value)).then(utils.error2null)
        if(scope._dimension){
          scope._dimension.dispose();
        }
        scope._dimension = $globals.data.dimension(accessor.get);
        var group = scope._dimension.group()[scope.settings.redmethod.value]();
        chart
          .dimension(scope._dimension)
          .group(group)
          .height(200)
          .width(200);
      }
      mkchart();

      scope.chart.on('preRender', mkchart);
      scope.chart.on('filtered', function(){
        scope.globals.redraw('dc');
      });
      scope.settings_changed = function(){
        chart.render();
      }
      scope.globals.register_renderer('dc', function(){
        dc.renderAll();
      });
      scope.globals.register_redrawer('dc', function(){
        dc.redrawAll();
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
      scope.widget_id = attr.id;
      scope.widget_name = attr.name;
      scope.globals = scope.$parent.globals;
      scope.settings = {
        dimension: {name: 'dimension', label: 'Field', type: 'text', tip: 'The name of a field.', value: '' }, 
        scale: {name: 'scale', label: 'Scale', type: 'text', tip: 'The name of a field.', value: 'hour' }, 
        redmethod: {name: 'redmethod', label: 'Reduce Method', type: 'choice', tip: 'JSON / CSV', choice: ['reduceSum', 'reduceCount'], value: 'reduceCount'},
      };
      scope.settings.scale.value = attr.scale;
      scope.settings.dimension.value = attr.dimension;
      
      var chart = dc.barChart('#' + scope.widget_id + ' .panel-body');
      scope.chart = chart;
      function mkchart(){
        var $globals = scope.globals;
        var accessor = L.deep_property(utils.undotted(scope.settings.dimension.value)).then(utils.str2datetime)
        if(scope._dimension){
          scope._dimension.dispose();
        }
        scope._dimension = $globals.data.dimension(accessor.get);
        var dimmin = scope._dimension.bottom(1)[0];
        var dimmax = scope._dimension.top(1)[0];
        var group = scope._dimension.group()[scope.settings.redmethod.value]();
        chart
          .dimension(scope._dimension)
          .group(group)
          .x(d3.time.scale().domain([dimmin, dimmax]))
          .elasticX(true)
          .xUnits(d3.time[scope.settings.scale.value + 's'])
          .centerBar(true)
          .gap(1)
          .renderHorizontalGridLines(true)
          .renderVerticalGridLines(true)
          .brushOn(true)
          .title(function(d) { return "Value: " + d.value; })
          .renderTitle(true)
          .width(1000)
          .height(120);
      }


      scope.chart.on('preRender', mkchart);
      scope.chart.on('filtered', function(){
        scope.globals.redraw('dc');
      });
      scope.settings_changed = function(){
        chart.render();
      }
      scope.globals.register_renderer('dc', function(){
        dc.renderAll();
      });
      scope.globals.register_redrawer('dc', function(){
        dc.redrawAll();
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
