define ['utils'], (utils) ->
  describe 'deepaccessor', ->
    it '{x: {y: {z: 1}}}[x, y, z] == 1', ->
      (expect (utils.deepaccessor ['x', 'y', 'z']) {x: {y: {z: 1}}}).toEqual 1
    it '{x: {y: {z: 1}}}[x, y] == {z: 1}', ->
      (expect ((utils.deepaccessor ['x', 'y']) {x: {y: {z: 1}}})['z']).toEqual 1

  describe 'transformer', ->
    it 'adder for {x: {y: {z: 1}}}', ->
      adder = utils.transformer {'x.y.z': (x) -> x + 1}
      (expect (adder {x: {y: {z: 1}}})['x']['y']['z']).toEqual 2
    it 'adder2 for {x: {y: {z: 1}, a: 2}}', ->
      obj = {x: {y: {z: 1}, a: 2}}
      tfuncs =
        'x.y.z': (x) -> x + 1
        'x.a': (x) -> x + 10
      adder = utils.transformer tfuncs
      adder obj
      (expect obj['x']['y']['z']).toEqual 2
      (expect obj['x']['a']).toEqual 12
