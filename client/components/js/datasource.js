/* global define */

define(['resource_ctrl', 'crossfilter', 'underscore', 'utils', 'lenz', 'jQuery', 'csv'], function(ResourceCtrl, crossfilter, _, utils, L, $){
  console.log('construct directive APIENDPOINT');
  return ResourceCtrl.directive('datasource', function($http, $window){
    console.log('init directive APIENDPOINT');
    // <apiendpoint id='endpoint1' data-url='https://' data-parsetime='a,b,c' data-format='header1,header2'></apiendpoint>
    //


    function link(scope, element, attr){
      scope.widget_id = attr.id;
      scope.widget_name = attr.name
      scope.globals = scope.$parent.globals;
      scope.url = attr.url;
      scope.settings = {
        mapping: {name: 'mapping', label: 'Field Mapping', type: 'text', tip: 'A JSON string of object mapping the data.', value: '' }, 
        datetime: {name: 'datetime', label: 'Datetime Fields', type: 'text', tip: 'The fields that is of type datetime.', value: ''},
        format: {name: 'format', label: 'Format', type: 'choice', tip: 'JSON / CSV', choice: ['JSON', 'CSV'], value: 'JSON'},
        datapath: {name: 'datapath', label: 'Path to Collection', type: 'text', tip: 'A path in dot notation.', value: ''}
      };

      scope.kind = 'source';
      scope.get = function(url){

        var preprocessor = L.identity;
        if(scope.settings.datapath.value !== ''){
          preprocessor = preprocessor.then(L.deep_property(utils.undotted(scope.settings.datapath.value)));
        }
        if(scope.settings.mapping.value !== ''){
          var mapping = JSON.parse(scope.settings.mapping.value)
          preprocessor = preprocessor.then(utils.extractor(mapping).map(_.map))
        }
        else{
          preprocessor = preprocessor.then(L.identity.map(_.map))
        }

        $http.get(url).success(function(data, status, headers, config){
          if(scope.settings.format.value === 'csv' || (!scope.settings.format && url.endsWith('csv'))){
            data = $.csv.toObjects(data);
          }
          data = preprocessor.get(data);
          scope.globals.fill_with(data);
        }).error(function(data, status, headers, config){
          $window.alert('Error: ' + status);
        });
      };
      scope.config = function(){};
      scope.globals.add_source(scope.widget_id, scope);
    }
    return {
      scope: true,
      restrict: 'E',
      templateUrl: '/components/html/datasource.html',
      link: link
    };
  });
});
