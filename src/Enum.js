
const isArray = Array.isArray

export function toPairs () {
  const pairs = []
  for (const key in this) {
    if (this.hasOwnProperty(key)) {
      pairs.push([key, this[key]])
    }
  }
  return pairs
}

export function fromPairs() {
  const obj = {}
  for (const [key, value] of this) obj[key] = value
  return obj
}

export function keys () {
  return isArray(this)
    ? this.map(([key, _]) => key)
    : Object.keys(this)
}

export function values () {
  return isArray(this)
    ? this.map(([_, value]) => value)
    : Object.values(this)
}

export function all(fn) {
  return isArray(this)
    ? this.every(fn)
    : this::toPairs().every(fn)
}

export function any(fn) {
  return isArray(this)
    ? this.some(fn)
    : this::toPairs().some(fn)
}

export function at(index) {
  return isArray(this)
    ? this[index]
    : this::toPairs()[index]
}

export function range(end, start = 0, step = 1) {
  const list = []
  for (let i = start; i < end; i += step) list.push(i)
  return list
}

export function chunk(count, step, leftover = null) {
  if (!isArray(this)) return this::toPairs()::chunk(count, step, leftover)
  const s = step || count
  return range(this.length, 0, s)
    .map(index => this.filter((_, i) => index <= i && i < index + count))
}

// chunkBy

export function concat(other) {
  if (other == null) {
    return isArray(this)
      ? [].concat(...this)
      : [].concat(...this::toPairs())
  } else {
    if (isArray(other))
      return isArray(this)
        ? this.concat(other)
        : this::toPairs().concat(other)
    return isArray(this)
      ? this.concat(other::toPairs())
      : this::toPairs().concat(other::toPairs())
  }
}

export function count() {
  return isArray(this)
    ? this.length
    : Object.keys(this).length
}

export function dedup() {
  const reducer = ([deduped, lastValue], item) =>
    item === lastValue ? [deduped, lastValue] : [deduped.push(item), item]
  return isArray(this)
    ? this.reduce(reducer, [[], null])
    : this::toPairs().reduce(reducer, [[], null])
}

export function dedupBy(fn) {
  const reducer = ([deduped, lastValue], item) =>
    fn(item) === lastValue ? [deduped, lastValue] : [deduped.push(item), fn(item)]
  return isArray(this)
    ? this.reduce(reducer, [[], null])
    : this::toPairs().reduce(reducer, [[], null])
}

export function filter(fn) {
  return isArray(this)
    ? this.filter(x => fn(x))
    : this::toPairs().filter(x => fn(x))
}

export function into(collectable) {
  if (isArray(collectable))
    return isArray(this)
      ? collectable.concat(this)
      : collectable.concat(this::toPairs())
  return isArray(this)
    ? Object.assign({}, collectable, this::fromPairs())
    : Object.assign({}, collectable, this)
}

export function map (fn) {
  if (Array.isArray(this)) return this.map(fn)
  return this::toPairs().map(fn)
}

export function reduce (initial = null, fn) {
  if (Array.isArray(this)) return this.reduce(fn, initial)
  return this::toPairs().reduce(fn, initial)
}

export function log () {
  console.log(this)
}
