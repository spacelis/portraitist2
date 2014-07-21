/* global define */

define(['angular', 'resource_ctrl', 'GMaps', 'underscore', 'utils'], function(angular, ResourceCtrl, GMaps, _, utils){
  console.log('construct directive PIECHART');
  return ResourceCtrl.directive('googlemap', function(){
    console.log('init directive GOOGLEMAP');
    function link(scope, element, attr){
      scope.chart_name = attr.name;
      scope.widget_id = attr.id;
      var globals = scope.$parent.globals;

      // Build customized mapping creation
      // var mapping = {id: parse('id'), name: parse('name'), lat: parse('lat'), lng: parse('lng')};
      var extr = utils.extractor({
        id: attr.field_id || 'id',
        label: attr.field_label || 'name',
        text: attr.field_text || 'text',
        lat: attr.field_lat || 'lat',
        lon: attr.field_lon || 'lon'
      });

      // Build dimension for data
      scope.dimension = globals.data.dimension(function(d){
        d = extr(d);
        d.valueOf = function(){
          return d.id;
        };
        return d;
      });
      var group = scope.dimension.group().reduceCount();
      scope.map = new GMaps({
        lat: 41.0,
        lng: -100.0,
        height: attr.mapheight || '500px',
        div: angular.element('#' + scope.widget_id + ' .pt-map-canvas')[0],
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
            lng: poi.lon,
            title: poi.label,
            infoWindow: {
              content: poi.text,
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
  });
});
