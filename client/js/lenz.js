/* global define */

define(['underscore', 'utils'], function(_, u){

  function lenz(get, set){
    var l = {};
    l.get = get;
    l.set = set;
    l.mod = function(modf, x){ return set(x, modf(get(x))); };
    l.com = function(ol){
      return lenz(function(x){
        return ol.get(get(x));
      }, function(x, v){
        return set(x, ol.set(get(x), v));
      });
    };
    return l;
  }

  var identity = lenz(function(x){return x;}, function(x, v){return v;});

  function property(key){
    return lenz(
      function(obj){
        if(typeof(obj)==="object" && _.has(obj, key)){
          return obj[key];
        }
        else{
          throw new Error(obj.toString() + ' is not an object or does not have property ' + key);
        }
      },
      function(obj, v){
        var nobj = _.clone(obj);
        if(typeof(obj)==="object" && _.has(obj, key)){
          nobj[key] = v;
        }
        else{
          throw new Error(obj.toString() + ' is not an object or does not have property ' + key);
        }
        return nobj;
      }
    );
  }

  function chained(ls){
    return _.reduce(ls, function(acc, l){
      return acc.com(l);
    }, identity);
  }

  function nested_property(keys){
    return chained(_.map(keys, property));
  }

  function projector(mapping){
    return lenz(
      function(obj){
        return _.object(_.keys(mapping), _.map(_.values(mapping), function(x){return x.get(obj);}));
      },
      function(obj, val){
        return _.reduce(_.pairs(mapping), function(acc, x){
          return x[1].set(acc, val[x[0]]);
        }, obj);
      }
    );
  }

  return {
    lenz: lenz,
    property: property,
    identity: identity,
    chained: chained,
    nested_property: nested_property,
    projector: projector,
  };
});
