/* global define */

define(['angular', 'resource_ctrl', 'wordcloud', 'wordfreq', 'lenz', 'utils'], function(angular, ResourceCtrl, WordCloud, WordFreq, L, utils){
  console.log('construct directive wordcloud');
  return ResourceCtrl.directive('tagcloud', ['$parse', function(parse){
    console.log('init directive WORDCLOUD');
    var LINKPTN = /((http(s)?:\/\/)?\w+\.\w+((\/)?[\w#!:.?+=&%@!\-\/]+)?)/;

    function HLBox(el){
      var self = this;
      self.p = el.parent();
      self.lpad = parseInt(self.p.css('padding-left'));
      self.tpad = parseInt(self.p.css('padding-top'));
      ['left', 'top', 'right', 'bottom'].forEach(function(side){
        self.p.append('<div style="border-' + side + ': 2px dashed #777; display: none; position: absolute; box-shadow: 2px 2px 5px #888888"></div>');
      });
      self.boarder = [1, 2, 3, 4].map(function(n){return angular.element(self.p.children()[n]);});
      
      self.move_hlbox = function move_hlbox(x, y, w, h) {
        el.css({cursor: 'pointer'});
        x = parseInt(x);
        y = parseInt(y);
        w = parseInt(w);
        h = parseInt(h);
        self.boarder[0].css({
          left: x + self.lpad, top: y + self.tpad,
          height: h, width: 1,
          display: 'inline',
        });
        self.boarder[1].css({
          left: x + self.lpad, top: y + self.tpad,
          height: 1, width: w,
          display: 'inline',
        });
        self.boarder[2].css({
          left: x + w + self.lpad, top: y + self.tpad,
          height: h + 2, width: 1,
          display: 'inline',
        });
        self.boarder[3].css({
          left: x + self.lpad, top: y + h + self.tpad,
          height: 1, width: w + 2,
          display: 'inline',
        });
      };
      self.hide_hlbox = function hide_hlbox(){
        el.css({cursor: 'default'});
        self.boarder.forEach(function(el){el.css({display: 'none'});});
      };
    }


    function link(scope, element, attr){
      scope.widget_id = attr.id;
      scope.widget_name = attr.name;
      scope.globals = scope.$parent.globals;
      
      scope.settings = {
        dimension: {name: 'dimension', label: 'Field', type: 'text', tip: 'The name of a field.', value: attr.dimension || '' }, 
      };
      scope.accessor = L.deep_property(utils.undotted(scope.settings.dimension.value)).get;

      function selector(other){ return '#' + scope.widget_id + ' ' + other; }
      var hlbox = new HLBox(angular.element(selector('canvas')));
      angular.element(selector('canvas')).mouseout(hlbox.hide_hlbox);

      function build_cloud2(list){
        WordCloud(angular.element(selector('canvas'))[0],
          { list: list,
            hover: function(item, dimension, event){
              if(dimension){
                hlbox.move_hlbox(dimension.x, dimension.y, dimension.w, dimension.h);
              } else {
                hlbox.hide_hlbox();
              }
            },
          click: function(item, dimension, event){
            scope._dimension.filter(function(t){return t.contains(item[0]);});
            scope.globals.redraw();
          },
          weightFactor: function(w){
            return w / list[0][1] * 50;
          }
        });
      }

      function wf_preprocess(ds) {
        return ds.map(
          function(d){return d.toLowerCase().replace(LINKPTN, ' ').replace('http', ' ');});
      }

      var wordfreq_opt = {
        workerUrl: '/lib/wordfreq/src/wordfreq.worker.js',
        stopWords: ['english1', 'english2'],
        minimumCount: 1,
      };
      

      var wordprocessor = new WordFreq(wordfreq_opt);

      function redraw(){
        var text = scope._dimension.top(1000).map(scope.accessor);
        wordprocessor.empty();
        wf_preprocess(text).forEach(function(d){wordprocessor.process(d);});
        wordprocessor.getList(function (list) {
          build_cloud2(list);
        });
      }

      var render = function (){
        scope.accessor = L.deep_property(utils.undotted(scope.settings.dimension.value)).get;
        if(scope._dimension){
          scope._dimension.dispose();
        }
        scope._dimension = scope.globals.data.dimension(scope.accessor);
        redraw();
      };

      scope.settings_changed = render;
      scope.globals.register_renderer('wordcloud', render);
      scope.globals.register_redrawer('wordcloud', redraw);
    } // end of link func
    return {
      scope: true,
      restrict: 'E',
      templateUrl: '/components/html/tagcloud.html',
      link: link
    };
  }]);
});
