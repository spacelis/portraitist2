/* global define */

define(['angular', 'resource_ctrl', 'wordcloud', 'wordfreq'], function(angular, ResourceCtrl, WordCloud, WordFreq){
  console.log('construct directive wordcloud');
  return ResourceCtrl.directive('tagcloud', ['$parse', function(parse){
    console.log('init directive WORDCLOUD');

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
      scope.chart_name = attr.name;
      var component_id = attr.id;
      function selector(other){ return '#' + component_id + ' ' + other; }

      var globals = scope.$parent.globals;
      var dim = parse(attr.dimension);
      var dimension = globals.data.dimension(dim);
      var group = dimension.group().reduceCount();

      var links = /((http(s)?:\/\/)?\w+\.\w+((\/)?[\w#!:.?+=&%@!\-\/]+)?)/;
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
            var e = jQuery.Event('keydown');
            e.keyCode = 13;
            $('#q').val(item[0]).trigger(e);
          },
          weightFactor: function(w){
            return w / list[0][1] * 50;
          }
        });
      }

      function wf_preprocess(ds) {
        return ds.map(
          function(d){return d.toLowerCase().replace(links, ' ').replace('http', ' ');});
      }
      var wordfreq_opt = {
        workerUrl: '/lib/wordfreq/src/wordfreq.worker.js',
        stopWords: ['english1', 'english2'],
        minimumCount: 1,
      };
      

      var render = function (){
        var wordprocessor = new WordFreq(wordfreq_opt);
        var text = group.all().map(function(d){
          if(d.value > 0){
            return Array.apply(null, Array(d.value)).map(function(_){return d.key;}).join(' ');
          } else {
            return '';
          }
        }).filter(function(t){return t !== '';});
        wf_preprocess(text).forEach(function(d){wordprocessor.process(d);});
        wordprocessor.getList(function (list) {
          build_cloud2(list);
        });
      };
      globals.register_renderer('wordcloud', render);
      globals.register_redrawer('wordcloud', render);
    } // end of link func
    return {
      scope: true,
      restrict: 'E',
      templateUrl: '/components/html/tagcloud.html',
      link: link
    };
  }]);
});
