define ['utils'], (utils) ->

  describe 'extractor', ->
    it 'extract z for {x: {y: {z: 1}, a: 2}}', ->
      zextr = utils.extractor {'z': 'x.y.z', 'a': 'x.a'}
      (expect zextr.get {x: {y: {z: 1}, a: 2}}).toEqual {z: 1, a: 2}
    it 'extract z for {x: {y: {z: 1}, a: 2}}', ->
      zextr = utils.extractor {'z': 'x.y.z', 'a': 'x.a'}
      (expect zextr.get {x: {y: {z: 1}}}).toEqual {z: 1, a: null}


  describe 'dot_notation', ->
    it 'simple', ->
      (expect utils.undotted 'x').toEqual ['x']
      (expect utils.undotted '1').toEqual ['1']
    it 'escape number', ->
      (expect utils.undotted '@1').toEqual [1]
      (expect utils.undotted '@@1').toEqual ['@1']
    it 'nested', ->
      (expect utils.undotted 'x.y').toEqual ['x', 'y']
      (expect utils.undotted 'x.1').toEqual ['x', '1']
      (expect utils.undotted 'x.@1').toEqual ['x', 1]
      (expect utils.undotted '@1.x').toEqual [1, 'x']
    it 'escape dot', ->
      (expect utils.undotted 'x\\.y').toEqual ['x.y']
      (expect utils.undotted 'x\\..y').toEqual ['x.', 'y']
      (expect utils.undotted 'x.\\.y').toEqual ['x', '.y']
      (expect utils.undotted 'x\\..\\.y').toEqual ['x.', '.y']
