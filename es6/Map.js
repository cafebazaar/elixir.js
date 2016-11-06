import { BindableFor } from './Utils'

const IsArray = Array.isArray
export const IsMap = x => x instanceof Object

const ToPairs = (object) => {
  const pairs = []
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      pairs.push([key, object[key]])
    }
  }
  return pairs
}

export const FromPairs = (pairs) => {
  const object = {}
  for (const [key, value] of pairs) {
    object[key] = value
  }
  return object
}

export const MapOf = (arg) => {
  if (IsArray(arg)) return FromPairs(arg)
  if (IsMap(arg)) return arg
  return {}
}

const Clone = (map) =>
  Object.assign({}, map)

const Drop = (map, keys) => {
  const copy = Clone(map)
  for (const key of keys) delete copy[key]
  return copy
}

const HasKey = (map, key) =>
  IsMap(map) && map.hasOwnProperty(key)

const Delete = (map, key) => {
  if (!HasKey(map, key)) return map

  const copy = Clone(map)
  delete copy[key]
  return copy
}

const Get = (map, key, def = null) =>
  HasKey(map, key) ? map[key] : def

export const GetAndUpdate = (map, key, fn) => {
  const value = Get(map, key)
  const result = fn(value)
  if (result === 'pop') {
    return Pop(map, key)
  }
  return [result[0], Put(map, key, result[1])]
}

const GetLazy = (map, key, fn) =>
  HasKey(map, key) ? map[key] : fn()

const Keys = (map) =>
  Object.keys(map)

const Project3 = (x, y, z) => z

export const Merge = (map, other, fn = Project3) => {
  const copy = Clone(map)
  for (const key of Keys(other)) {
    if (HasKey(map, key)) {
      copy[key] = fn(key, map[key], other[key])
    } else {
      copy[key] = other[key]
    }
  }
  return copy
}

const Pop = (map, key, def = null) => {
  if (!HasKey(map, key)) return [def, map]

  const copy = Clone(map)
  delete copy[key]
  return [map[key], copy]
}

const PopLazy = (map, key, fn) => {
  if (!HasKey(map, key)) return [fn(), map]

  const copy = Clone(map)
  delete copy[key]
  return [map[key], copy]
}

const Put = (map, key, value) => {
  if (map[key] === value) return map

  const copy = Clone(map)
  copy[key] = value
  return copy
}

const PutNew = (map, key, value) =>
  HasKey(map, key) ? map : Put(map, key, value)

const PutNewLazy = (map, key, fn) =>
  HasKey(map, key) ? map : Put(map, key, fn())

const Take = (map, keys) => {
  const taken = {}
  for (const key of keys) {
    if (HasKey(map, key)) taken[key] = map[key]
  }
  return taken
}

const Split = (map, keys) =>
  [Take(map, keys), Drop(map, keys)]

export const ToList = map =>
  IsArray(map) ? map : ToPairs(map)

const Update = (map, key, initial, fn) => {
  const updated = Clone(map)
  if (HasKey(updated, key)) {
    updated[key] = fn(updated[key])
  } else {
    updated[key] = initial
  }
  return updated
}

const Values = (map) =>
  Keys(map).map(key => map[key])

const Module = MapOf
const Bindable = BindableFor(Module)

export const drop = Bindable(Drop)
export const remove = Bindable(Delete)
export const get = Bindable(Get)
export const getAndUpdate = Bindable(GetAndUpdate)
export const getLazy = Bindable(GetLazy)
export const hasKey = Bindable(HasKey)
export const isMap = Bindable(IsMap)
export const keys = Bindable(Keys)
export const merge = Bindable(Merge)
export const pop = Bindable(Pop)
export const popLazy = Bindable(PopLazy)
export const put = Bindable(Put)
export const putNew = Bindable(PutNew)
export const putNewLazy = Bindable(PutNewLazy)
export const split = Bindable(Split)
export const take = Bindable(Take)
export const toList = Bindable(ToList)
export const update = Bindable(Update)
export const values = Bindable(Values)

Object.assign(Module, {
  drop,
  delete: remove,
  get,
  getAndUpdate,
  get_and_update: getAndUpdate,
  getLazy,
  get_lazy: getLazy,
  hasKey,
  has_key: hasKey,
  isMap,
  keys,
  merge,
  pop,
  popLazy,
  pop_lazy: popLazy,
  put,
  putNew,
  put_new: putNew,
  putNewLazy,
  put_new_lazy: putNewLazy,
  split,
  take,
  toList,
  to_list: toList,
  update,
  values,
})

export default Module

