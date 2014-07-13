/* global define */

define(['underscore'], function(_){
  // return a funciton that will extract the element specified by the path
  // in an object.
  function deepaccessor(path){
    return function(obj){
      return _.reduce(path, function(memo, p){
        if(typeof(memo)==="object" && _.has(memo, p)){
          return memo[p];
        }
        else{
          return null;
        }
      }, obj);
    };
  }

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
  return {
    deepaccessor: deepaccessor,
    transformer: transformer,
  };
});
