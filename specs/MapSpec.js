/* eslint-env node, mocha */
/* global chai, sinon */

import eq from 'lodash.isequal'

import Map from '../src/Map'

const assert = chai.assert

describe('Map', () => {
  const map = Map({ x: 1, y: 2, empty: '', falsy: false })
  const copy = Map({ x: 1, y: 2, empty: '', falsy: false })

  describe('#Map', () => {
    it('creates a new map from given pairs', () => {
      const subject = Map([['a', 1], ['b', 2], [3, 'c']])
      assert(eq(subject, { a: 1, b: 2, 3: 'c' }))
    })

    it('creates a new map from given object', () => {
      const subject = Map({ a: 1, b: 2 })
      assert(eq(subject, { a: 1, b: 2 }))
    })
  })

  describe('#drop', () => {
    it('drops the given keys from map', () => {
      assert(eq(
        map::Map.drop(['x', 'y']),
        Map({ empty: '', falsy: false })
      ))
      assert(eq(
        Map.drop(map, ['y', 'falsy']),
        Map({ x: 1, empty: '' })
      ))
    })

    it('does not mutate the map', () => {
      map::Map.drop(['x', 'y'])
      assert(eq(map, copy))
    })
  })

  describe('#delete', () => {
    it('deletes the entries in map for a specific key', () => {
      assert(eq(
        Map.delete(map, 'x'),
        Map({ y: 2, empty: '', falsy: false })
      ))
      assert(eq(
        map::Map.delete('falsy'),
        Map({ x: 1, y: 2, empty: '' })
      ))
    })

    it('returns map unchanged if the key does not exist', () => {
      assert.equal(map::Map.delete('missing'), map)
    })

    it('does not mutate the map', () => {
      map::Map.delete('x')
      assert(eq(map, copy))
    })
  })

  describe('#get', () => {
    it('gets the value for a specific key', () => {
      assert.strictEqual(map::Map.get('x'), 1)
      assert.strictEqual(map::Map.get('empty'), '')
      assert.strictEqual(map::Map.get('falsy'), false)

      assert.strictEqual(map::Map.get('x', 100), 1)
      assert.strictEqual(map::Map.get('empty', 100), '')
      assert.strictEqual(map::Map.get('falsy', 100), false)
    })

    it('returns null if key does not exist and no default is passed', () => {
      assert.isNull(map::Map.get('missing'))
    })

    it('returns default value if key does not exist', () => {
      assert.strictEqual(map::Map.get('missing', 100), 100)
    })
  })

  describe('#getAndUpdate', () => {
    it('Gets the value from key', () => {
      assert(eq(
        Map({ a: 1, b: 2, c: 3 })::Map.getAndUpdate('a', x => [x, 100]),
        [1, Map({ a: 100, b: 2, c: 3 })]
      ))

      assert(eq(
        Map({ a: 1 })::Map.getAndUpdate('missing', x => [x, 'value']),
        [null, Map({ a: 1, missing: 'value' })]
      ))
    })

    it('can specify get value', () => {
      assert(eq(
        Map({ a: 1, b: 2, c: 3 })::Map.getAndUpdate('a', x => ['SPECIFIC', 100]),
        ['SPECIFIC', Map({ a: 100, b: 2, c: 3 })]
      ))
    })

    it('can pop value at key', () => {
      assert(eq(
        Map({ a: 1, b: 2, c: 3 })::Map.getAndUpdate('c', () => 'pop'),
        [3, Map({ a: 1, b: 2 })]
      ))

      assert(eq(
        Map({ a: 1, b: 2, c: 3 })::Map.getAndUpdate('missing', () => 'pop'),
        [null, Map({ a: 1, b: 2, c: 3 })]
      ))
    })
  })

  describe('#getLazy', () => {
    it('gets the value for a specific key', () => {
      const fn = sinon.spy()
      assert.strictEqual(map::Map.getLazy('x', fn), 1)
      assert.strictEqual(map::Map.getLazy('empty', fn), '')
      assert.strictEqual(map::Map.getLazy('falsy', fn), false)
      assert.equal(fn.callCount, 0)
    })

    it('lazily evaluates fun and returns its result, if key does not exist', () => {
      assert.strictEqual(map::Map.getLazy('missing', () => 'some-default'), 'some-default')
    })
  })

  describe('#hasKey', () => {
    it('returns whether a given key exists in the given map', () => {
      assert.isTrue(map::Map.hasKey('x'))
      assert.isTrue(map::Map.hasKey('empty'))
      assert.isTrue(map::Map.hasKey('falsy'))
      assert.isFalse(map::Map.hasKey('missing'))
    })
  })

  describe('#keys', () => {
    it('returns all keys from map', () => {
      assert(eq(map::Map.keys(), ['x', 'y', 'empty', 'falsy']))
    })
  })

  describe('#merge', () => {
    it('merges two maps into one.', () => {
      const a = Map({ x: 1 })
      const b = Map({ y: 'test' })
      const ab = Map({ x: 1, y: 'test' })
      const c = Map({ x: 2 })
      const abc = Map({ x: 2, y: 'test' })
      assert(eq(a::Map.merge(b), ab))
      assert(eq(a::Map.merge(c), c))
      assert(eq(ab::Map.merge(c), abc))
    })

    it('accepts non map args', () => {
      assert(eq(
        Map({ a: 1 })::Map.merge({ b: 2 }),
        Map({ a: 1, b: 2 })
      ))
    })

    it('the given function will be invoked with the key, value1 and value2 to solve conflicts', () => {
      const a = Map({ x: 1, a: 20 })
      const b = Map({ x: 2, b: 30, c: 40 })
      const fn = sinon.spy()
      a::Map.merge(b, fn)
      assert.isTrue(fn.calledOnce)
      assert.isTrue(fn.calledWithExactly('x', 1, 2))

      assert(eq(
        a::Map.merge(b, (k, x, y) => x + y),
        Map({ x: 3, a: 20, b: 30, c: 40 })
      ))
    })
  })

  describe('#pop', () => {
    it('returns and removes the value associated with key in map', () => {
      assert(eq(
        map::Map.pop('x'),
        [1, Map({ y: 2, empty: '', falsy: false })]
      ))
      assert(eq(
        map::Map.pop('falsy'),
        [false, Map({ x: 1, y: 2, empty: '' })]
      ))
    })

    it('returns map unchanged if the key does not exist', () => {
      assert(eq(map::Map.pop('missing', 100), [100, map]))
      assert(eq(map::Map.pop('missing'), [null, map]))
    })

    it('does not mutate the map', () => {
      map::Map.pop('x')
      assert(eq(map, copy))
    })
  })

  describe('#popLazy', () => {
    it('calls fn only if key does not exist', () => {
      const fn = sinon.spy()
      map::Map.popLazy('x', fn)
      assert.equal(fn.callCount, 0)
      map::Map.popLazy('missing', fn)
      assert.equal(fn.callCount, 1)

      assert(eq(map::Map.popLazy('missing', () => 100), [100, map]))
    })
  })

  describe('#put', () => {
    it('puts the given value under key.', () => {
      assert(eq(
        Map({ x: 1 })::Map.put('x', 2),
        { x: 2 }
      ))
      assert(eq(
        Map({ x: 1 })::Map.put('y', 2),
        { x: 1, y: 2 }
      ))
      assert(eq(
        Map({ empty: '' })::Map.put('x', 2),
        { x: 2, empty: '' }
      ))
    })

    it('does not mutate passed object', () => {
      map::Map.put('x', 1000)
      assert(eq(map, copy))
    })
  })

  describe('#putNew', () => {
    it('puts the given value under key unless the entry key already exists', () => {
      const subject = Map({ x: 1 })
      assert(eq(
        subject::Map.putNew('x', 2),
        subject
      ))
      assert(eq(
        subject::Map.putNew('y', 2),
        { x: 1, y: 2 }
      ))
    })

    it('does not mutate passed object', () => {
      map::Map.putNew('missing', 1000)
      assert(eq(map, copy))
    })
  })

  describe('#putNewLazy', () => {
    it('evaluates fun and puts the result under key in map unless key is already present', () => {
      const subject = Map({ x: 1 })
      const fn = sinon.spy()
      assert(eq(
        subject::Map.putNewLazy('x', fn),
        subject
      ))
      assert.equal(fn.callCount, 0)
      assert(eq(
        subject::Map.putNewLazy('y', () => 2),
        { x: 1, y: 2 }
      ))
    })

    it('does not mutate passed object', () => {
      map::Map.putNewLazy('missing', () => 1000)
      assert(eq(map, copy))
    })
  })

  describe('#split', () => {
    it('takes all entries corresponding to the given keys and extracts them into a separate map.', () => {
      const map = Map({ a: 1, b: 2, c: 3 })
      assert(eq(
        map::Map.split(['a', 'c', 'e']),
        [Map({ a: 1, c: 3 }), Map({ b: 2 })])
      )
      assert(eq(map, { a: 1, b: 2, c: 3 }))
    })
  })

  describe('#take', () => {
    it('takes all entries corresponding to the given keys and returns them in a new map.', () => {
      const map = Map({ a: 1, b: 2, c: 3 })
      assert(eq(
        map::Map.take(['a', 'c', 'e']),
        { a: 1, c: 3 }
      ))
      assert(eq(map, { a: 1, b: 2, c: 3 }))
    })
  })

  describe('#toList', () => {
    it('converts map to a list.', () => {
      assert({ a: 1, b: 2 }::Map.toList(), [['a', 1], ['b', 2]])
      assert(Map({ a: 1 })::Map.put(10, 10)::Map.toList(), [['a', 1], [10, 10]])
      assert(Map({ a: 1 })::Map.put([], 'list')::Map.toList(), [['a', 1], [[], 'list']])
    })
  })

  describe('#update', () => {
    it('updates the key in map with the given function', () => {
      assert(eq(
        Map({ a: 1 })::Map.update('a', 13, x => x * 2),
        { a: 2 }
      ))
    })

    it('inserts the given initial value, if the key does not exist', () => {
      assert(eq(
        Map({ a: 1 })::Map.update('b', 13, x => x * 2),
        { a: 1, b: 13 }
      ))
    })
  })

  describe('#values', () => {
    it('returns all values from map', () => {
      assert(eq(map::Map.values(), [1, 2, '', false]))
    })
  })

  describe('binding', () => {
    it('returns a function which accepts a subject for action', () => {
      const incrementCount = ::Map.update('count', 0, x => x + 1)
      assert.isFunction(incrementCount)
      assert(eq(incrementCount(Map({ count: 2 })), Map({ count: 3 })))
    })
  })
})
