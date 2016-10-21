/* eslint-env node, mocha */
/* global chai */

import Ex from '../src/Ex'
import Map from '../src/Map'

const assert = chai.assert

describe('Ex', () => {
  describe('#getIn', () => {
    it('get value in nested lists', () => {
      const list = [0, 1, [2, [3, 4, [5]]], 6]
      assert.equal(Ex.getIn(list, [0]), 0)
      assert.equal(Ex.getIn(list, [1]), 1)
      assert.equal(Ex.getIn(list, [2, 0]), 2)
      assert.equal(Ex.getIn(list, [2, 1, 2, 0]), 5)
    })

    it('gets value in nested maps', () => {
      const map = Map({ a: 1, b: Map({ c: 2, d: Map({ e: Map({ f: 3 }), g: 4 }) }) })
      assert.equal(Ex.getIn(map, ['a']), 1)
      assert.equal(Ex.getIn(map, ['b', 'c']), 2)
      assert.equal(Ex.getIn(map, ['b', 'd', 'e', 'f']), 3)
    })
  })

  describe('#putIn', () => {
    it('puts value in a nested list', () => {
      const list = [[1, 2], [3, 4], 5]
      assert.deepEqual(Ex.putIn(list, [0, 0], 100), [[100, 2], [3, 4], 5])
      assert.deepEqual(Ex.putIn(list, [0, 1], 100), [[1, 100], [3, 4], 5])
      assert.deepEqual(Ex.putIn(list, [1, 1], 100), [[1, 2], [3, 100], 5])
      assert.deepEqual(Ex.putIn(list, [2], 100), [[1, 2], [3, 4], 100])
    })
  })

  describe('#popIn', () => {
    it('pops a value from a nested list', () => {
      const list = [[1, 2], [3, 4], 5]
      assert.deepEqual(Ex.popIn(list, [0, 0]), [[2], [3, 4], 5])
      assert.deepEqual(Ex.popIn(list, [0, 1]), [[1], [3, 4], 5])
      assert.deepEqual(Ex.popIn(list, [1, 1]), [[1, 2], [3], 5])
      assert.deepEqual(Ex.popIn(list, [2]), [[1, 2], [3, 4]])
    })
  })

  describe('#updateIn', () => {
    it('updated value in a nested list with given fn', () => {
      const list = [[1, 2], [3, 4], 5]
      const tenTimes = (x) => x * 10
      assert.deepEqual(Ex.updateIn(list, [0, 0], tenTimes), [[10, 2], [3, 4], 5])
      assert.deepEqual(Ex.updateIn(list, [0, 1], tenTimes), [[1, 20], [3, 4], 5])
      assert.deepEqual(Ex.updateIn(list, [1, 1], tenTimes), [[1, 2], [3, 40], 5])
      assert.deepEqual(Ex.updateIn(list, [2], tenTimes), [[1, 2], [3, 4], 50])
    })
  })

  describe('#equals', () => {
    it('returns true if the two items are equal', () => {
      assert.isTrue(Ex.equals(1.0, 1))
      assert.isTrue(Ex.equals('test', 'test'))
      assert.isTrue(Ex.equals([1, 2, 3], [1, 2, 3]))
      assert.isTrue(Ex.equals({ a: 1, b: 2 }, { a: 1, b: 2 }))
      assert.isTrue(Ex.equals({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }))
    })

    it('returns false if the two items not are equal', () => {
      assert.isFalse(Ex.equals(1, 2))
      assert.isFalse(Ex.equals('test', 'example'))
      assert.isFalse(Ex.equals(1, 'test'))
      assert.isFalse(Ex.equals([1, 2, 3], [1, 2]))
      assert.isFalse(Ex.equals([1, 2, 3], {}))
      assert.isFalse(Ex.equals({ a: 1, b: 2 }, { a: 1, b: 3 }))
      assert.isFalse(Ex.equals({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } }))
    })
  })
})
