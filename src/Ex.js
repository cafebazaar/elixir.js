import { GetAndUpdate as GUMap, MapOf, IsMap } from './Map'
import { GetAndUpdate as GUList, IsList } from './List'
import Enum from './Enum'

import { BindableFor } from './Utils'

function Equals (a, b) {
  if (IsList(a)) {
    if (!IsList(b)) return false
    if (a.length !== b.length) return false
    return Enum.zip(a, b)::Enum.all(([x, y]) => Equals(x, y))
  }
  if (IsMap(a)) {
    if (!IsMap(b)) return false
    return Equals(Enum.toList(a), Enum.toList(b))
  }
  return a === b
}

function GetAndUpdateIn (data, keys, next) {
  const [head, ...tail] = keys
  if (IsList(data)) {
    if (tail.length) {
      return GUList(data, head, (value) => GetAndUpdateIn(value, tail, next))
    }
    return GUList(data, head, next)
  }
  const map = MapOf(data)
  if (tail.length) {
    return GUMap(map, head, (value) => GetAndUpdateIn(value, tail, next))
  }
  return GUMap(map, head, next)
}

const GetIn = (data, keys) =>
  GetAndUpdateIn(data, keys, (x) => [x, x])[0]

const PopIn = (data, keys) =>
  GetAndUpdateIn(data, keys, (x) => 'pop')[1]

const PutIn = (data, keys, value) =>
  GetAndUpdateIn(data, keys, (x) => [x, value])[1]

const UpdateIn = (data, keys, fn) =>
  GetAndUpdateIn(data, keys, (x) => [x, fn(x)])[1]

function Inspect (data) {
  if (IsList(data)) {
    const items = data.map(Inspect)
    return `[${items.join(', ')}]`
  }
  if (typeof data === 'object') {
    const items = []
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        items.push(`${key}: ${Inspect(data[key])}`)
      }
    }
    return `%{${items.join(', ')}}`
  }
  if (typeof data === 'string') return `"${data}"`
  if (data == null) return 'null'
  return data.toString()
}

const Module = Inspect
const Bindable = BindableFor(Module)

export const equals = Bindable(Equals)
export const inspect = Bindable(Inspect)
export const getAndUpdateIn = Bindable(GetAndUpdateIn)
export const getIn = Bindable(GetIn)
export const popIn = Bindable(PopIn)
export const putIn = Bindable(PutIn)
export const updateIn = Bindable(UpdateIn)

Object.assign(Module, {
  equals,
  inspect,
  getAndUpdateIn,
  get_and_update_in: getAndUpdateIn,
  getIn,
  get_in: getIn,
  popIn,
  pop_in: popIn,
  putIn,
  put_in: putIn,
  updateIn,
  update_in: updateIn,
})

export default Module
