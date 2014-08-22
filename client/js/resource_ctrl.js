/* global define */
/* global angular */

define(['__portraitist', 'dc', 'crossfilter'], function(portraitist, dc, crossfilter){
  console.log('register controller');
  return portraitist.controller('ResourceCtrl', ['$scope', function(scope){
    console.log('build scope');
    scope.render_handlers = {};
    scope.redraw_handlers = {};
    scope.globals = {
      widget_pool: {
        sources: {},
        charts: {},
      },
      data: crossfilter([]),
      // functions 
      add_source: function(wid, widget){
        scope.globals.widget_pool.sources[wid] = widget;
      },
      fill_with: function(records){
        scope.globals.data.remove();
        scope.globals.data.add(records);
        scope.globals.render();
      },
      register_renderer: function(name, handler){
        scope.render_handlers[name] = handler;
      },
      register_redrawer: function(name, handler){
        scope.redraw_handlers[name] = handler;
      },
      render: function(ignored){ // an handler can be ignored
        for(var name in scope.render_handlers){
          if (ignored && ignored === name) {continue;}
          scope.render_handlers[name]();
        }
      },
      redraw: function(ignored){
        for(var name in scope.redraw_handlers){
          if (ignored && ignored === name) {continue;}
          scope.redraw_handlers[name]();
        }
      }
    };
  }]);
});
