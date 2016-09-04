import { filter, into, toPairs } from './Enum'

export function drop(keys) {
  const obj = Object.assign({}, this)
  for (const key of keys) delete obj[key]
  return obj
}

export function remove(key) {
  const obj = Object.assign({}, this)
  delete obj[key]
  return obj
}

export function get(key, def = null) {
  return this::hasKey(key)
    ? this[key]
    : def
}

export function getLazy(key, fn) {
  return this::hasKey(key)
    ? this[key]
    : fn()
}

export function hasKey(key) {
  return this.hasOwnProperty(key)
}

export function keys() {
  return Object.keys(this)
}

export function merge(other) {
  return Object.assign({}, this, other)
}

export function pop(key, def = null) {
  return this::popLazy(key, () => def)
}

export function popLazy(key, fn) {
  const res = Object.assign({}, this)
  delete res[key]
  return this::hasKey(key)
    ? [this[key], res]
    : [fn(), res]
}

export function put(key, value) {
  return Object.assign({}, this, { [key]: value })
}

export function putNew(key, value) {
  return this::hasKey(key)
    ? this
    : this::put(key, value)
}

export function putNewLazy(key, fn) {
  return this::hasKey(key)
    ? this
    : this::put(key, fn())
}

export function split(keys) {
  return [this::take(keys), this::drop(keys)]
}

export function take(keys) {
  return this
    ::filter(([key, value]) => keys.includes(key))
    ::into({})
}

export function toList() {
  return this::toPairs()
}

export function update(key, initial, fn) {
  const keyValue =
    this::hasKey(key)
      ? { [key]: fn(this[key]) }
      : { [key]: initial }
  return Object.assign({}, this, keyValue)
}

export function values() {
  return this::keys().map(key => this[key])
}

export default {
  drop,
  delete: remove,
  get,
  getLazy,
  hasKey,
  keys,
  merge,
  put,
  putNew,
  putNewLazy,
  split,
  take,
  toList,
  values,
  remove,
}
