/* global define */

define(['underscore', 'lenz'], function(_, L){


  var ptn_path_element = /(\\\.|[^.])+/g;
  var ptn_escape_number = /^@\d+$/;
  var ptn_unescape_at = /^@@/;
  function undotted(path){
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


  // Return an extractor that will extract a subset of attributes of json
  // objects.
  function extractor(projection){
    var mapping = _.object(_.map(_.pairs(projection), function(d){
      var key = d[0], path = undotted(d[1]);
      return [key, L.nested_properties(path).com(L.error2null)];
    }));
    return L.projector(mapping);
  }
  return {
    extractor: extractor,
    undotted: undotted,
  };
});
