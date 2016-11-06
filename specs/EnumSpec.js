/* eslint-env node, mocha */
/* global chai */

import Map from '../es6/Map'
import Enum from '../es6/Enum'

const assert = chai.assert

const IsOdd = x => x % 2 === 1
const IsEven = x => x % 2 === 0

describe('Enum', () => {
  describe('#at', () => {
    it('finds the element at the given index (zero-based)', () => {
      assert.strictEqual([2, 4, 6]::Enum.at(0), 2)
      assert.strictEqual([2, 4, 6]::Enum.at(2), 6)
    })
    it('returns default if index is out of bounds', () => {
      assert.strictEqual([2, 4, 6]::Enum.at(4), null)
      assert.strictEqual([2, 4, 6]::Enum.at(4, 'none'), 'none')
    })
    it('accepts negative indices', () => {
      assert.strictEqual([2, 4, 6]::Enum.at(-1), 6)
    })
  })

  describe('#any', () => {
    it('returns true if at least one fn invocation returns a truthy value', () => {
      assert.isFalse(Enum.any([2, 4, 6], IsOdd))
      assert.isTrue([2, 3, 6]::Enum.any(IsOdd))
    })
    it('checks for at least one truthy value if no fn is given', () => {
      assert.isFalse([false, false, false]::Enum.any())
      assert.isTrue(Enum.any([false, true, true]))
    })
    it('returns on ASAP', () => {
      let count = 0
      const fn = (x) => (count += 1, x) // eslint-disable-line no-sequences
      assert.isTrue(Enum.any([false, true, true], fn))
      assert.equal(count, 2)
    })
  })

  describe('#all', () => {
    it('returns true if all fn invocation returns a truthy value', () => {
      assert.isTrue(Enum.all([2, 4, 6], IsEven))
      assert.isFalse([2, 3, 6]::Enum.all(IsEven))
    })
    it('checks for all values to be truthy if no fn is given', () => {
      assert.isTrue([true, true, true]::Enum.all())
      assert.isFalse(Enum.all([true, false, true, true]))
    })
    it('returns on ASAP', () => {
      let count = 0
      const fn = (x) => (count += 1, x) // eslint-disable-line no-sequences
      assert.isFalse(Enum.all([true, true, false, true, true], fn))
      assert.equal(count, 3)
    })
  })

  describe('#chunk', () => {
    it('returns list of lists containing count items each, where each new chunk starts step elements into the enumerable', () => {
      assert.deepEqual(
        Enum.chunk([1, 2, 3, 4, 5, 6], 2),
        [[1, 2], [3, 4], [5, 6]]
      )
      assert.deepEqual(
        Enum.chunk([1, 2, 3, 4, 5, 6], 3, 2),
        [[1, 2, 3], [3, 4, 5]]
      )
      assert.deepEqual(
        Enum.chunk([1, 2, 3, 4, 5, 6], 3, 2, [7]),
        [[1, 2, 3], [3, 4, 5], [5, 6, 7]]
      )
      assert.deepEqual(
        Enum.chunk([1, 2, 3, 4], 3, 3, []),
        [[1, 2, 3], [4]]
      )
      assert.deepEqual(
        [1, 2, 3, 4]::Enum.chunk(10),
        []
      )
      assert.deepEqual(
        [1, 2, 3, 4]::Enum.chunk(10, 10, []),
        [[1, 2, 3, 4]]
      )
    })
  })

  describe('#chunkBy', () => {
    it('splits enumerable on every element for which fun returns a new value', () => {
      assert.deepEqual(
        Enum.chunkBy([1, 2, 2, 3, 4, 4, 6, 7, 7], IsOdd),
        [[1], [2, 2], [3], [4, 4, 6], [7, 7]]
      )
    })
    it('handles empty enumerable', () => {
      assert.deepEqual(Enum.chunkBy([], x => x), [])
      assert.deepEqual({}::Enum.chunkBy(x => x), [])
    })
  })

  describe('#concat', () => {
    it('concatenates the enumerables into a single list', () => {
      assert.deepEqual(
        [[1, 2, 3], [4], [5, 6, 7]]::Enum.concat(),
        [1, 2, 3, 4, 5, 6, 7]
      )
      assert.deepEqual(
        Enum.concat([[1, [2], 3], [4], [5, 6]]),
        [1, [2], 3, 4, 5, 6]
      )
    })
    it('accepts 2 args', () => {
      assert.deepEqual(
        Enum.concat([1, 2, 3], [4, 5, 6]),
        [1, 2, 3, 4, 5, 6]
      )
      assert.deepEqual(
        [1]::Enum.concat([4, 6]),
        [1, 4, 6]
      )
    })
  })

  describe('#count', () => {
    it('returns the size of the enumerable', () => {
      assert.equal([1, 2, 3]::Enum.count(), 3)
      assert.equal(Enum.count({ a: 1, b: 2 }), 2)
      assert.equal(Map([[1, 2]])::Enum.count(), 1)
    })
    it('returns the count of items in the enumerable for which fun returns a truthy value', () => {
      assert.equal(Enum.count([1, 2, 3, 4, 5], IsOdd), 3)
      assert.equal([1, 2, 3, 4, 5]::Enum.count(IsEven), 2)
    })
  })

  describe('#dedup', () => {
    it('returns a list where all consecutive duplicated elements are collapsed to a single element', () => {
      assert.deepEqual(
        Enum.dedup([1, 2, 3, 3, 2, 1]),
        [1, 2, 3, 2, 1]
      )
      assert.deepEqual(
        [1, 1, '2', 2, 2.0]::Enum.dedup(),
        [1, '2', 2]
      )
      assert.deepEqual(
        [1, 1, '2', 2, 2.0]::Enum.dedup((x, y) => x == y), // eslint-disable-line eqeqeq
        [1, '2']
      )
    })
    it('handles null at first', () => {
      assert.deepEqual(
        [null, null, undefined, 1, 2, 2]::Enum.dedup(),
        [null, undefined, 1, 2]
      )
      assert.deepEqual(
        [undefined, 1, 2, 2]::Enum.dedup(),
        [undefined, 1, 2]
      )
    })
    it('handles empty enum', () => {
      assert.deepEqual([]::Enum.dedup(), [])
    })
    it('does not mutates the enumerable', () => {
      const list = [1, 1, '2', 2, 2.0]
      assert.deepEqual(Enum.dedup(list), [1, '2', 2])
      assert.deepEqual(list, [1, 1, '2', 2, 2.0])
    })
  })

  describe('#dedupBy', () => {
    it('returns a list where all consecutive duplicated elements are collapsed to a single element', () => {
      assert.deepEqual(
        Enum.dedupBy([[1, 'a'], [2, 'b'], [2, 'c'], [1, 'a']], ([x, _]) => x),
        [[1, 'a'], [2, 'b'], [1, 'a']]
      )
      assert.deepEqual(
        [1, 3, 5, 2, 3, 6, 10]::Enum.dedupBy(IsOdd),
        [1, 2, 3, 6]
      )
    })
    it('does not mutates the enumerable', () => {
      const list = [1, 3, 5, 2, 3, 6, 10]
      assert.deepEqual(
        Enum.dedupBy(list, IsOdd),
        [1, 2, 3, 6]
      )
      assert.deepEqual(list, [1, 3, 5, 2, 3, 6, 10])
    })
  })

  describe('#drop', () => {
    it('drops first n items of enumerable', () => {
      assert.deepEqual(Enum.drop([1, 2, 3], 2), [3])
      assert.deepEqual([1, 2, 3]::Enum.drop(0), [1, 2, 3])
      assert.deepEqual([1, 2, 3]::Enum.drop(10), [])
    })
    it('drops from the end if n is negative', () => {
      assert.deepEqual(Enum.drop([1, 2, 3], -1), [1, 2])
      assert.deepEqual(Enum.drop([1, 2, 3], -2), [1])
    })
    it('does not mutates the enumerable', () => {
      const list = [1, 2, 3, 4]
      assert.deepEqual(Enum.drop(list, 2), [3, 4])
      assert.deepEqual(list, [1, 2, 3, 4])
    })
  })

  describe('#dropEvery', () => {
    it('drops every nth item in the enumerable, starting with the first element', () => {
      assert.deepEqual(
        Enum.drop_every([1, 2, 3, 4, 5, 6], 2),
        [2, 4, 6]
      )
      assert.deepEqual(
        [1, 2, 3, 4, 5, 6]::Enum.drop_every(0),
        [1, 2, 3, 4, 5, 6]
      )
      assert.deepEqual(
        [1, 2, 3, 4, 5, 6]::Enum.drop_every(1),
        []
      )
    })
    it('does not mutates the enumerable', () => {
      const list = [1, 2, 3, 4]
      assert.deepEqual(Enum.dropEvery(list, 2), [2, 4])
      assert.deepEqual(list, [1, 2, 3, 4])
    })
  })

  describe('#dropWhile', () => {
    it('drops items at the beginning of the enumerable while fun returns a truthy value', () => {
      assert.deepEqual(
        [1, 2, 3, 1, 2, 3]::Enum.dropWhile(x => x < 3),
        [3, 1, 2, 3]
      )
      assert.deepEqual(
        [1, 2, 3, 1, 2, 3]::Enum.dropWhile(x => x < 1000),
        []
      )
      assert.deepEqual(
        [1, 2, 3, 1, 2, 3]::Enum.dropWhile(x => x !== 1),
        [1, 2, 3, 1, 2, 3]
      )
    })
    it('does not mutates the enumerable', () => {
      const list = [1, 2, 3, 4]
      assert.deepEqual(Enum.dropWhile(list, IsOdd), [2, 3, 4])
      assert.deepEqual(list, [1, 2, 3, 4])
    })
  })

  describe('#into', () => {
    it('inserts the given enumerable into a collectable', () => {
      assert.deepEqual(Enum.into([1, 2], [0]), [0, 1, 2])
      assert.deepEqual(Enum.into(Map({ a: 1 }), Map({ b: 2 })), Map({ a: 1, b: 2 }))
      assert.deepEqual([['a', 1], ['c', 3]]::Enum.into({}), Map({ a: 1, c: 3 }))
    })
  })

  describe('#map', () => {
    it('maps the enumerable with given fn', () => {
      assert.deepEqual(
        Enum.map([1, 2, 3], x => x + 10),
        [11, 12, 13]
      )
      assert.deepEqual(
        [1, 2, 3]::Enum.map(x => x * 10),
        [10, 20, 30]
      )
    })

    it('passes [key, value] pair to fn when enumerable is a Map', () => {
      const M = Map({ a: 1, b: 2, c: 3 })
      assert.deepEqual(
        M::Enum.map(([k, v]) => k),
        ['a', 'b', 'c']
      )
      assert.deepEqual(
        M::Enum.map(([k, v]) => v),
        [1, 2, 3]
      )
    })
  })

  describe('#sort', () => {
    it('sorts the enumerable according to string Unicode code points', () => {
      assert.deepEqual(Enum.sort([3, 2, 1]), [1, 2, 3])
      assert.deepEqual(Enum.sort(['a', 'c', 'b']), ['a', 'b', 'c'])
    })

    it('does not mutates the enumerable', () => {
      const list = [3, 4, 2, 1]
      assert.deepEqual(Enum.sort(list), [1, 2, 3, 4])
      assert.deepEqual(list, [3, 4, 2, 1])
    })

    it('sorts the enumerable by the given function.', () => {
      assert.deepEqual(Enum.sort([1, 2, 3], (x, y) => x > y), [3, 2, 1])
      assert.deepEqual(
        Enum.sort(['some', 'sample', 'of', 'monster'], (x, y) => x.length <= y.length),
        ['of', 'some', 'sample', 'monster']
      )
    })
  })
})
