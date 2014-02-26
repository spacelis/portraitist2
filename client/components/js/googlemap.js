/* global define */

define(['angular', 'resource_ctrl', 'GMaps'], function(angular, ResourceCtrl, GMaps){
  console.log('construct directive PIECHART');
  return ResourceCtrl.directive('googlemap', ['$window', '$parse', function(window, parse){
    console.log('init directive GOOGLEMAP');
    function link(scope, element, attr){
      scope.chart_name = attr.name;
      var component_id = attr.id;
      var globals = scope.$parent.globals;

      // Build customized mapping creation
      var mapping = {id: parse('id'), name: parse('name'), lat: parse('lat'), lng: parse('lng')};
      attr.format.split(',').map(function(d){return d.split('=');}).forEach(function(d){
        mapping[d[0]]=parse(d[1]);});
      var placeformat = function(d){
        var nd = {};
        for(var n in mapping){
          nd[n] = mapping[n](d); //TODO may resulting in attribute overwritten
        }
        return nd;
      };

      // Build dimension for data
      var dimension = scope.dimension = globals.data.dimension(function(d){
        d = placeformat(d);
        d.valueOf = function(){
          return d.id;
        };
        return d;
      });
      var group = dimension.group().reduceCount();
      scope.map = new GMaps({
        lat: 41.0,
        lng: -100.0,
        height: attr.mapheight || '500px',
        div: angular.element('#' + component_id + ' .pt-map-canvas')[0],
        zoom: 3,
      });
      // For updating the map
      var render = function (){

        var pois = group.top(attr.atmost || 30);
        scope.map.removeMarkers();
        for(var i in pois) {
          if(pois[i].value === 0) {continue;}
          var poi = pois[i].key;
          scope.map.addMarker({
            lat: poi.lat,
            lng: poi.lng,
            title: poi.name, //TODO make customizable
            infoWindow: {
              content: poi.name, //TODO make customizable
            },
            //icon: '/static/profileviewer/images/map_icons/' + poi.category.id + '_black.png',
          });
        }
        scope.map.fitZoom();
        if(scope.map.getZoom() > 17){
          scope.map.setZoom(17);
        }
      };
      globals.register_renderer('googlemap', render);
      globals.register_redrawer('googlemap', render);
    } // end of link func
    return {
      scope: true,
      restrict: 'E',
      templateUrl: '/components/html/googlemap.html',
      link: link
    };
  }]);
});
