
export function at(index) {
  return index >= 0 ? this[index] : this[this.length + index]
}

export function delete(item) {
  return this.filter((x) => x !== item)
}

export function deleteAt(index) {
  return this.splice(index, 1)
}

export function duplicate(item, n) {
  const res = []
  for (let i = 0; i < n; i++) res.push(item)
  return res
}

export function first() {
  return this[0]
}

export function flatten() {
  let res = []
  for (const item of this) {
    res = res.concat(Array.isArray(item) ? item::flatten() : item)
  }
  return res
}

export const foldl = reduce

export function foldr(initial, fn) {
  this.reverse()::reduce(initial, fn)
}

export function isList() {
  return Array.isArray(this)
}

export function insertAt(index, value) {
  return this.splice(index, 0, value)
}

export function keyDelete(key, position) {
  const index = this::findIndex(key, position)
  return index === -1 ? this : this::deleteAt(index)
}

export function keyFind(key, position) {
  return this.find(el => el[position] === key)
}

export function keyMember(key, position) {
  return this::keyFind(key, position) != null
}

export function keyIndex(key, position) {
  return this.findIndex(el => el[position] === key)
}

export function keyReplace(key, position, newList) {
  const index = this::keyIndex(key, position)
  return index >= 0
    ? this::replaceAt(index, newList)
    : this
}

export function keySort(position) {
  const copy = this.map(x => x)
  return copy.sort((a, b) => {
    if (a[position] > b[position]) return 1
    if (a[position] < b[position]) return -1
    return 0
  })
}

export function keyStore(key, position, newList) {
  const index = this::keyIndex(key, position)
  return index >= 0
    ? this::replaceAt(index, newList)
    : this.map(x => x).push(newList)
}

export function keyTake(key, position) {
  const index = this::findIndex(key, position)
  return index === -1 ? null : [this[index], this::deleteAt(index)]
}

export function last() {
  return this.length ? this[this.length - 1] : null
}

export function reduce(initial, fn) {
  let acc = initial
  for (const item of this) acc = fn(item, acc)
  return acc
}

export function relpaceAt(index, value) {
  if (this::hasAt(index)) {
    return index >= 0
      ? this.splice(index, 1, value)
      : this.splice(this.length + index, 1, value)
  }
  return this
}

export function hasAt(index) {
  return this::at(index) != null
}

export function updateAt(index, fn) {
  return this::hasAt(index)
    ? this::relpaceAt(index, fn(this::at(index)))
    : this
}

export function wrap() {
  return Array.isArray(this) ? this : [this]
}

export function zip() {
  const length = this::reduce(null, (l, x) => l ? Math.min(l, x.length) : x.length)
  const zipped = []
  for (let i = 0; i < length; i++) {
      zipped[i] = this.map(x => x[i])
  }
  return zipped
}

export default {
  at,
  delete,
  deleteAt,
  duplicate,
  first,
  flatten,
  foldl,
  foldr,
  insertAt,
  keyDelete,
  keyExist,
  keyFind,
  keyIndex,
  keyMember,
  keyReplace,
  keySort,
  keyStore,
  last,
  reduce,
  replaceAt,
  updateAt,
  wrap,
  zip,
}

