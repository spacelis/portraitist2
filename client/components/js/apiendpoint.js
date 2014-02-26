/* global define */

define(['resource_ctrl', 'crossfilter', 'csv'], function(ResourceCtrl, crossfilter){
  console.log('construct directive APIENDPOINT');
  return ResourceCtrl.directive('apiendpoint', ['$http', '$window', function(http, window){
    console.log('init directive APIENDPOINT');
    // <apiendpoint id='endpoint1' data-url='https://'></apiendpoint>
    function link(scope, element, attr){
      var component_id = attr.id;
      var dataprocess = function(_){return _;};
      var $globals = scope.$parent.globals;
      scope.url = attr.url;
      scope.format = attr.format;
      if(attr.parsetime){
        dataprocess = function(data){
          data.foreach(function(d){
            for(var i in scope.parsetime.split(',')){
              d[i] = new Date(d[i]);
            }
          });
        };
      }
      scope.kind = 'source';
      scope.get = function(url){
        http.get(url).success(function(data, status, headers, config){
          if(scope.format === 'csv' || (!scope.format && url.endsWith('csv'))){
            data = dataprocess($.csv.toObjects(data));
            $globals.fill_with(data);
          } else {
            data = dataprocess(data);
            $globals.fill_with(data);
          }
        }).error(function(data, status, headers, config){
          window.alert('Error: ' + status);
        });
      };
      scope.config = function(){};
      $globals.add_source(component_id, scope);
    }
    return {
      scope: true,
      restrict: 'E',
      templateUrl: '/components/html/apiendpoint.html',
      link: link
    };
  }]);
});
