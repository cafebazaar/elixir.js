import Map from '../src/Map'

const assert = chai.assert

describe('Map', () => {
  const o = {x: 1, y: 2, empty: '', falsy: false}
  const copy = {x: 1, y: 2, empty: '', falsy: false}
  function Sample() {}
  Sample.prototype.one = 1
  Sample.prototype.list = []
  const obj = new Sample()
  obj.two = 2

  describe('#drop', () => {
    it('should drop given keys from object', () => {
      assert.deepEqual(o::Map.drop(['x', 'y']), { empty: '', falsy: false })
      assert.deepEqual(o::Map.drop(['y', 'falsy']), { x: 1, empty: '' })
    })

    it('should not mutate passed object', () => {
      o::Map.drop(['x', 'y'])
      assert.deepEqual(copy, o)
    })
  })

  describe('#delete', () => {
    it('should drop given key from object', () => {
      assert.deepEqual(o::Map.delete('x'), { y: 2, empty: '', falsy: false })
      assert.deepEqual(o::Map.delete('falsy'), { x: 1, y: 2, empty: '' })
    })

    it('should not mutate passed object', () => {
      o::Map.delete('x')
      assert.deepEqual(copy, o)
    })
  })

  describe('#get', () => {
    it('returns value at given key', () => {
      assert.equal(o::Map.get('x'), 1)
      assert.equal(o::Map.get('empty'), '')
      assert.equal(o::Map.get('falsy'), false)
    })

    it('returns null if key is not present', () => {
      assert.equal(o::Map.get('t'), null)
    })

    it('returns given default value if key is not present', () => {
      assert.equal(o::Map.get('x', 100), 1)
      assert.equal(o::Map.get('empty', 100), '')
      assert.equal(o::Map.get('falsy', 100), false)
      assert.equal(o::Map.get('t', 'some-default'), 'some-default')
    })

    it('should not mutate passed object', () => {
      o::Map.get('x')
      assert.deepEqual(copy, o)
    })
  })

  describe('#getLazy', () => {
    it('returns value at given key', () => {
      const fn = sinon.spy()
      assert.equal(o::Map.getLazy('x', fn), 1)
      assert.equal(o::Map.getLazy('empty', fn), '')
      assert.equal(o::Map.getLazy('falsy', fn), false)
      assert.equal(fn.callCount, 0)
    })

    it('returns result of given function if key is not present', () => {
      assert.equal(o::Map.getLazy('t', () => 'some-default'), 'some-default')
    })

    it('should not mutate passed object', () => {
      const fn = sinon.spy()
      o::Map.getLazy('x', fn)
      assert.deepEqual(copy, o)
      assert.equal(fn.callCount, 0)
      o::Map.getLazy('test', fn)
      assert.equal(fn.callCount, 1)
    })
  })

  describe('#hasKey', () => {
    it('returns true if object has given key', () => {
      assert.equal(o::Map.hasKey('x'), true)
      assert.equal(o::Map.hasKey('empty'), true)
      assert.equal(o::Map.hasKey('falsy'), true)
      assert.equal(o::Map.hasKey('notkey'), false)
    })

    it('checks own properties', () => {
      assert.equal(obj::Map.hasKey('one'), false)
      assert.equal(obj::Map.hasKey('list'), false)
      assert.equal(obj::Map.hasKey('two'), true)
    })
  })

  describe('#keys', () => {
    it('returns list of object keys', () => {
      assert.deepEqual(o::Map.keys(), ['x', 'y', 'empty', 'falsy'])
      assert.deepEqual(obj::Map.keys(), ['two'])
    })
  })

  describe('#merge', () => {
    it('merges to objects', () => {
      const a = { x: 1 }
      const b = { y: 'test' }
      const ab = { x: 1, y: 'test' }
      const c = { x: 2 }
      const abc = { x: 2, y: 'test' }
      assert.deepEqual(a::Map.merge(b), ab)
      assert.deepEqual(a::Map.merge(c), c)
      assert.deepEqual(ab::Map.merge(c), abc)
      assert.deepEqual(a::Map.merge(obj), { x: 1, two: 2 })
    })
  })

  describe('#put', () => {
    it('puts the given value under key.', () => {
      const a = { x: 1 }
      assert.deepEqual(a::Map.put('x', 2), { x: 2 })
      assert.deepEqual(a::Map.put('y', 2), { x: 1, y: 2 })
      const b = { empty: '' }
      assert.deepEqual(b::Map.put('x', 2), { x: 2, empty: '' })
    })

    it('dose not mutate passed object', () => {
      o::Map.put('x', 1000)
      assert.deepEqual(copy, o)
    })
  })

  describe('#putNew', () => {
    it('puts the given value under key unless the entry key already exists.', () => {
      const a = { x: 1 }
      assert.equal(a::Map.putNew('x', 2), a)
      assert.deepEqual(a::Map.putNew('y', 2), { x: 1, y: 2 })
      const b = { empty: '' }
      assert.deepEqual(b::Map.putNew('x', 2), { x: 2, empty: '' })
    })
  })

  describe('#putNewLazy', () => {
    it('evaluates fn and puts the result under key in map unless key is already present.', () => {
      const fn = sinon.spy()
      const a = { x: 1 }
      assert.equal(a::Map.putNewLazy('x', fn), a)
      assert.equal(fn.callCount, 0)
      assert.deepEqual(a::Map.putNewLazy('y', () => 10 + 1), { x: 1, y: 11 })
    })
  })

  describe('#split', () => {
    it('takes all entries corresponding to the given keys and extracts them into a separate map.', () => {
      const map = { a: 1, b: 2, c: 3 }
      assert.deepEqual(map::Map.split(['a', 'c', 'e']), [{ a: 1, c: 3 }, { b: 2 }])
      assert.deepEqual(map, { a: 1, b: 2, c: 3 })
    })
  })

  describe('#take', () => {
    it('takes all entries corresponding to the given keys and returns them in a new map.', () => {
      const map = { a: 1, b: 2, c: 3 }
      assert.deepEqual(map::Map.take(['a', 'c', 'e']), { a: 1, c: 3 })
      assert.deepEqual(map, { a: 1, b: 2, c: 3 })
    })
  })

  describe('#toList', () => {
    it('converts map to a list.', () => {
      assert.deepEqual({ a: 1, b: 2 }::Map.toList(), [['a', 1], ['b', 2]])
    })
  })

  describe('#values', () => {
    it('returns all values from map.', () => {
      assert.deepEqual({ a: 1, b: 2 }::Map.values(), [1, 2])
      assert.deepEqual(obj::Map.values(), [2])
    })
  })
})
