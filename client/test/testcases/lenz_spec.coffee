define ['lenz', 'underscore'], (lenz, _) ->
  describe 'lenz', ->
    it 'Basic', ->
      obj = {a: 1, b: 2}
      lenz_a = lenz.lenz ((x) -> x.a),  ((x, v) -> {a: v, b: x.b})
      (expect lenz_a.get obj).toEqual 1
      (expect lenz_a.set obj, 2).toEqual {a: 2, b: 2}
      (expect lenz_a.mod ((x) -> x + 10), obj).toEqual {a: 11, b: 2}

    it 'Composition', ->
      obj = {a: {x: 1, y: 2}, b: 3}
      lenz_a = lenz.lenz ((x) -> x.a),  ((x, v) -> {a: v, b: x.b})
      lenz_x = lenz.lenz ((x) -> x.x),  ((x, v) -> {x: v, y: x.y})
      lenz_ax = lenz_a.then lenz_x
      (expect lenz_ax.get obj).toEqual 1
      (expect lenz_ax.set obj, 10).toEqual {a: {x: 10, y: 2}, b: 3}
      (expect lenz_ax.mod ((x) -> x * 3), obj).toEqual {a: {x: 3, y: 2}, b: 3}

  describe 'property', ->
    it 'Basic', ->
      obj = {a: 1, b: 2}
      lenz_a = lenz.property('a')
      (expect lenz_a.get obj).toEqual 1
      (expect lenz_a.set obj, 2).toEqual {a: 2, b: 2}
      (expect lenz_a.mod ((x) -> x + 10), obj).toEqual {a: 11, b: 2}

    it 'Composition', ->
      obj = {a: {x: 1, y: 2}, b: 3}
      lenz_ax = (lenz.property 'a').then lenz.property 'x'
      (expect lenz_ax.get obj).toEqual 1
      (expect lenz_ax.set obj, 10).toEqual {a: {x: 10, y: 2}, b: 3}
      (expect lenz_ax.mod ((x) -> x * 3), obj).toEqual {a: {x: 3, y: 2}, b: 3}

  describe 'map lenz', ->
    it '[{a: 1, b: 2}, {a:3, b:4}, {a:5, b:6}] property(a).map(_.map) == [1, 3, 5]', ->
      obj = [{a: 1, b: 2}, {a:3, b:4}, {a:5, b:6}]
      lr = (lenz.property 'a').map _.map
      (expect lr.get obj).toEqual [1, 3, 5]
      (expect lr.set obj, 10).toEqual [{a:10, b:2}, {a:10, b:4}, {a:10, b:6}]

  describe 'identity', ->
    it 'Basic', ->
      obj = {a: 1, b: 2}
      lenz_id = lenz.identity
      (expect lenz_id.get obj).toEqual {a: 1, b: 2}
      (expect lenz_id.set obj, 10).toEqual 10
      (expect lenz_id.mod ((x) -> x.a + 1), obj).toEqual 2


  describe 'chained', ->
    it 'Composition', ->
      obj = {a: {x: {v: 1, w: 2}, y: 3}, b: 4}
      lenz_axv = lenz.chained [(lenz.property 'a'), (lenz.property 'x'), (lenz.property 'v')]
      (expect lenz_axv.get obj).toEqual 1
      (expect lenz_axv.set obj, 10).toEqual {a: {x: {v: 10, w: 2}, y: 3}, b: 4}
      (expect lenz_axv.mod ((x) -> x + 4), obj).toEqual {a: {x: {v: 5, w: 2}, y: 3}, b: 4}

  describe 'deep_property', ->
    it '{x: {y: {z: 1}}}[x, y, z] == 1', ->
      (expect (lenz.deep_property ['x', 'y', 'z']).get {x: {y: {z: 1}}}).toEqual 1
    it '{x: {y: {z: 1}}}[x, y] == {z: 1}', ->
      (expect ((lenz.deep_property ['x', 'y']).get {x: {y: {z: 1}}})['z']).toEqual 1

  describe 'projector', ->
    it 'project {x: {y: {z: 1}, a: 2}} by {z: x.y.z, a: x.a}', ->
      obj = {x: {y: {z: 1}, a: 2}}
      zextr = lenz.projector
        'z': lenz.deep_property ['x', 'y', 'z']
        'a': lenz.deep_property ['x', 'a']
      (expect zextr.get obj).toEqual {z: 1, a: 2}
      (expect zextr.set obj, {z: 10, a: 20}).toEqual {x: {y: {z: 10}, a: 20}}

