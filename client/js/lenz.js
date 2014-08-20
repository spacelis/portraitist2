/* global define */

define(['underscore'], function(_){

  /*
   * Constructing a lenz from a pair of get and set functions.
   *
   * Lenzes are combinable accessors for easy manipulating ways of
   * accessing objects. They can be combined to have nested accessors
   * and projectors.
   * Example:
   *    var accessor_x = lenz(function(a){return a.x;}, function(a, v){return {x: v};});
   *    var accessor_y = lenz(function(a){return a.y;}, function(a, v){return {y: v};});
   *    var accessor_xy = accessor_x.com(accessor_y)
   *    assert(accessor_xy.get({x: {y: 1}}) == 1);
   */
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

  /*
   * An idendity lenz where x.com(identity) == x == identity.com(x)
   */
  var identity = lenz(function(x){return x;}, function(x, v){return v;});

  /*
   * Constructing a lenz for accessing objects' propoerties.
   */
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

  /*
   * Combining a list of lenzes into a nested lenz
   */
  function chained(ls){
    return _.reduce(ls, function(acc, l){
      return acc.com(l);
    }, identity);
  }

  /*
   * Constructing a lenz for an object with a list of keys
   */
  function nested_properties(keys){
    return chained(_.map(keys, property));
  }

  /*
   * Constructing a lenz for an object with a mapping which can be seen as a projector to derive a subset of key-value pairs.
   */
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
    nested_properties: nested_properties,
    projector: projector,
  };
});
