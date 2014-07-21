/* global define */

define(['resource_ctrl', 'crossfilter', 'underscore', 'utils', 'jQuery', 'csv'], function(ResourceCtrl, crossfilter, _, utils, $){
  console.log('construct directive APIENDPOINT');
  return ResourceCtrl.directive('datasource', function($http, $window){
    console.log('init directive APIENDPOINT');
    // <apiendpoint id='endpoint1' data-url='https://' data-parsetime='a,b,c' data-format='header1,header2'></apiendpoint>
    function link(scope, element, attr){
      scope.widget_id = attr.id;
      var $globals = scope.$parent.globals;
      scope.url = attr.url;
      scope.format = attr.format;
      scope.parsetime = attr.parsetime;
      scope.widget_id = element.attr('id');
      var preprocessor = utils.transformer(_.object(_.map(scope.parsetime.split(','), function(d){return [d, function(x){return new Date(x);}];})));

      scope.kind = 'source';
      scope.get = function(url){
        $http.get(url).success(function(data, status, headers, config){
          if(scope.format === 'csv' || (!scope.format && url.endsWith('csv'))){
            data = $.csv.toObjects(data);
          }
          _.each(data, preprocessor);
          $globals.fill_with(data);
        }).error(function(data, status, headers, config){
          $window.alert('Error: ' + status);
        });
      };
      scope.config = function(){};
      $globals.add_source(scope.widget_id, scope);
    }
    return {
      scope: true,
      restrict: 'E',
      templateUrl: '/components/html/datasource.html',
      link: link
    };
  });
});
