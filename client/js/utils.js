/* global define */

define(['underscore', 'lenz'], function(_, L){


  var ptn_path_element = /(\\\.|[^.])+/g;
  var ptn_escape_number = /^@\d+$/;
  var ptn_unescape_at = /^@@/;
  function undotted(path){
    if (path === undefined || path === ''){
      return [];
    }
    return _.map(_.map(path.match(ptn_path_element), function(pe){
      if(ptn_escape_number.test(pe)){
        return parseInt(pe.substr(1));
      } else if (ptn_unescape_at.test(pe)){
        return pe.substr(1);
      } else {
        return pe;
      }
    }), function(pe){
      if(typeof(pe) === 'string'){
        return pe.replace(/\\\./, '.');
      }
      return pe;
    });
  }

  var error2null = L.lenz(
    function(x){
      if(x instanceof Error) {
        return null;
      }
      else {
        return x;
      }},
    function(x, v){
      return v;});

  // Return an extractor that will extract a subset of attributes of json
  // objects.
  function extractor(mapping){
    var m = _.object(_.map(_.pairs(mapping), function(d){
      var key = d[0], path = undotted(d[1]);
      return [key, L.deep_property(path).then(error2null)];
    }));
    return L.projector(m);
  }

  str2datetime = L.lenz(
    function(a){
      return new Date(a);
    },
    function(a, x){
      return x.toString();
    }); 

  return {
    extractor: extractor,
    undotted: undotted,
    str2datetime: str2datetime,
    error2null: error2null,
  };
});
