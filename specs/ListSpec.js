/* eslint-env node, mocha */
/* global chai */

import List from '../es6/List'

const assert = chai.assert

describe('List', () => {
  describe('#delete', () => {
    it('deletes the given item from the list', () => {
      assert.deepEqual(
        List.delete([1, 2, 3], 1),
        [2, 3]
      )
      assert.deepEqual(
        [1, 2, 3]::List.delete(1),
        [2, 3]
      )
      assert.deepEqual(
        List.delete([1, 2, 2, 3], 2),
        [1, 2, 3]
      )
      assert.deepEqual(
        [1, 2, 2, 3]::List.delete(2),
        [1, 2, 3]
      )
    })

    it('does not mutate the list', () => {
      const list = [1, 2, 3]
      list::List.delete(2)
      assert.deepEqual(list, [1, 2, 3])
    })
  })

  describe('#deleteAt', () => {
    it('roduces a new list by removing the value at the specified index', () => {
      assert.deepEqual(
        List.deleteAt([1, 2, 3], 0),
        [2, 3]
      )
      assert.deepEqual(
        [1, 2, 3]::List.deleteAt(0),
        [2, 3]
      )
    })

    it('returns the original list if index is out of bounds', () => {
      assert.deepEqual(
        List.deleteAt([1, 2, 3], 10),
        [1, 2, 3]
      )
      assert.deepEqual(
        [1, 2, 3]::List.deleteAt(10),
        [1, 2, 3]
      )
    })

    it('handles negative indices from end of the list', () => {
      assert.deepEqual(
        List.deleteAt([1, 2, 3], -1),
        [1, 2]
      )
      assert.deepEqual(
        [1, 2, 3]::List.deleteAt(-1),
        [1, 2]
      )
    })
  })

  describe('#duplicate', () => {
    it('duplicates the given element n times in a list', () => {
      assert.deepEqual(
        List.duplicate('hello', 3),
        ['hello', 'hello', 'hello']
      )
      assert.deepEqual(
        'hello'::List.duplicate(3),
        ['hello', 'hello', 'hello']
      )
      assert.deepEqual(
        List.duplicate([1, 2], 2),
        [[1, 2], [1, 2]]
      )
      assert.deepEqual(
        [1, 2]::List.duplicate(2),
        [[1, 2], [1, 2]]
      )
    })
  })

  describe('#flatten', () => {
    it('flattens the given list of nested lists', () => {
      assert.deepEqual(
        List.flatten([1, [[2], 3]]),
        [1, 2, 3]
      )
      assert.deepEqual(
        [1, [[2], 3]]::List.flatten(),
        [1, 2, 3]
      )
    })

    it('adds tail to the end of the flattened list', () => {
      assert.deepEqual(
        List.flatten([1, [[2], 3]], [4, 5]),
        [1, 2, 3, 4, 5]
      )
      assert.deepEqual(
        [1, [[2], 3]]::List.flatten([4, 5]),
        [1, 2, 3, 4, 5]
      )
    })
  })

  describe('#foldr', () => {
    it('folds (reduces) the given list from the right with a function', () => {
      assert.deepEqual(
        List.foldr([1, 2, 3, 4], 0, (x, acc) => x - acc),
        -2
      )
      assert.deepEqual(
        [1, 2, 3, 4]::List.foldr(0, (x, acc) => x - acc),
        -2
      )
    })
  })

  describe('#foldl', () => {
    it('folds (reduces) the given list from the left with a function', () => {
      assert.deepEqual(
        List.foldl([1, 2, 3, 4], 0, (x, acc) => x - acc),
        2
      )
      assert.deepEqual(
        [1, 2, 3, 4]::List.foldl(0, (x, acc) => x - acc),
        2
      )
      assert.deepEqual(
        List.foldl([1, 2, 3, 4], 0, (x, acc) => x + acc),
        10
      )
      assert.deepEqual(
        [1, 2, 3, 4]::List.foldl(10, (x, acc) => x + acc),
        20
      )
    })
  })

  describe('#insertAt', () => {
    it('returns a list with value inserted at the specified index', () => {
      assert.deepEqual(
        [1, 2, 3, 4]::List.insertAt(2, 0),
        [1, 2, 0, 3, 4]
      )
      assert.deepEqual(
        List.insertAt([1, 2, 3], 10, 0),
        [1, 2, 3, 0]
      )
      assert.deepEqual(
        List.insertAt([1, 2, 3], -1, 0),
        [1, 2, 3, 0]
      )
      assert.deepEqual(
        List.insertAt([1, 2, 3], -10, 0),
        [0, 1, 2, 3]
      )
    })
  })

  describe('#replaceAt', () => {
    it('returns a list with value inserted at the specified index', () => {
      assert.deepEqual(
        [1, 2, 3, 4]::List.replaceAt(2, 0),
        [1, 2, 0, 4]
      )
      assert.deepEqual(
        List.replaceAt([1, 2, 3], 10, 0),
        [1, 2, 3]
      )
      assert.deepEqual(
        List.replaceAt([1, 2, 3], -1, 0),
        [1, 2, 0]
      )
      assert.deepEqual(
        List.replaceAt([1, 2, 3], -10, 0),
        [1, 2, 3]
      )
    })
  })

  describe('#updateAt', () => {
    it('returns a list with value inserted at the specified index', () => {
      const addTen = x => x + 10
      assert.deepEqual(
        [1, 2, 3]::List.updateAt(0, addTen),
        [11, 2, 3]
      )
      assert.deepEqual(
        List.updateAt([1, 2, 3], 10, addTen),
        [1, 2, 3]
      )
      assert.deepEqual(
        List.updateAt([1, 2, 3], -1, addTen),
        [1, 2, 13]
      )
      assert.deepEqual(
        List.updateAt([1, 2, 3], -10, addTen),
        [1, 2, 3]
      )
    })
  })

  describe('#wrap', () => {
    it('wraps the argument in a list', () => {
      assert.deepEqual(List.wrap('hello'), ['hello'])
      assert.deepEqual(List.wrap(null), [])
      assert.deepEqual(undefined::List.wrap(), [])
      assert.deepEqual([1, 2, 3]::List.wrap(), [1, 2, 3])
    })
  })

  describe('#zip', () => {
    it('zips corresponding elements from each list in lists', () => {
      assert.deepEqual(
        List.zip([[1, 2], [3, 4], [5, 6]]),
        [[1, 3, 5], [2, 4, 6]]
      )
      assert.deepEqual(
        [[1, 2], [3], [4, 5, 6]]::List.zip(),
        [[1, 3, 4]]
      )
    })
  })
})
