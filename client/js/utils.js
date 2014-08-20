/* global define */

define(['underscore'], function(_){

  // return a funciton that will extract the element specified by the path
  // in an object.
  // arg: path a list of keys to the value to access to
  function deepaccessor(keypath){
    return function(obj){
      return _.reduce(keypath, function(memo, p){
        if(typeof(memo)==="object" && _.has(memo, p)){
          return memo[p];
        }
        else{
          return null;
        }
      }, obj);
    };
  }

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

  // var ptn_path_element = /(@\d+|@@[^.]*|(\\\.|[^.])+)/g;
  // var ptn_escape_number = /^@\d+$/;
  // var ptn_unescape_at = /^@@/;
  // var ptn_escape_dot = /\\\./;
  // function undotted(path){
  //   return _.map(path.match(ptn_path_element), function(e){
  //     if(ptn_escape_number.test(e)){
  // TODO fix this function
  //     }
  //   })
  // }

  // return a parser that will transform the data by a given function.
  // the paths should be an object where the keys are path to the element
  // and the key is a function for transforming the element.
  function transformer(transform){
    var mapping = _.object(_.map(_.pairs(transform), function(d){
      var path = d[0], tfunc = d[1];
      var pelems = path.split(".");
      var prefix = deepaccessor(_.initial(pelems));
      var key = _.last(pelems);
      return [path, {prefix: prefix, key: key, transform: tfunc}];
    }));
    return function(d){
      _.each(_.values(mapping), function(t){
        t.prefix(d)[t.key] = t.transform(t.prefix(d)[t.key]);
      });
      return d;
    };
  }

  // Return an extractor that will extract a subset of attributes of json
  // objects.
  function extractor(projection){
    var mapping = _.object(_.map(_.pairs(projection), function(d){
      var projection = d[0], path = d[1].split('.');
      return [projection, deepaccessor(path)];
    }));
    return function(d){
      return _.object(_.map(_.pairs(mapping), function(x){
        var projection = x[0], da = x[1];
        return [projection, da(d)];
      }));
    };
  }
  return {
    deepaccessor: deepaccessor,
    transformer: transformer,
    extractor: extractor,
    undotted: undotted,
  };
});
