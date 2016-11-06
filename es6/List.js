import { BindableFor } from './Utils'

export const IsList = Array.isArray

const Clone = (list) => [].concat(list)

const IndexOf = (list, index) =>
  index >= 0 ? index : list.length + index

const InBound = (list, index) =>
  index >= 0 && index < list.length

export const At = (list, index) =>
  list[IndexOf(list, index)]

const Append = (list, item) =>
  [].concat(list, [item])

const Concat = (list, other) =>
  [].concat(list, other)

const Remove = (array, item) => {
  const index = array.findIndex(x => x === item)
  if (index === -1) return array
  const list = Clone(array)
  list.splice(index, 1)
  return list
}

const DeleteAt = (array, index) => {
  const list = Clone(array)
  list.splice(IndexOf(array, index), 1)
  return list
}

const Diffenrence = (list, other) =>
  list.filter(x => !other.includes(x))

const Duplicate = (item, n) => {
  const list = []
  for (let i = 0; i < n; i++) list.push(item)
  return list
}

const First = list => list[0]

function Flatten (list, tail = []) {
  let flattened = []
  for (const item of list) {
    flattened = flattened.concat(IsList(item) ? Flatten(item) : item)
  }
  return flattened.concat(tail)
}

const FoldR = (list, initial, fn) =>
  list.reduceRight((acc, x) => fn(x, acc), initial)

const FoldL = (list, initial, fn) =>
  list.reduce((acc, x) => fn(x, acc), initial)

export const GetAndUpdate = (list, index, fn) => {
  const value = At(list, index)
  const result = fn(value)
  if (result === 'pop') {
    return [value, DeleteAt(list, index)]
  }
  return [result[0], ReplaceAt(list, index, result[1])]
}

const InserAt = (list, index, value) => {
  const xs = Clone(list)
  const where = index >= 0 ? index : list.length + 1 + index
  xs.splice(where, 0, value)
  return xs
}

const Last = list => list[list.length - 1]

const ReplaceAt = (list, index, value) => {
  const where = IndexOf(list, index)
  if (!InBound(list, where) || list[where] === value) return list
  const xs = Clone(list)
  xs.splice(where, 1, value)
  return xs
}

const UpdateAt = (list, index, fn) => {
  const where = IndexOf(list, index)
  if (!InBound(list, where)) return list
  const xs = Clone(list)
  xs.splice(where, 1, fn(xs[where]))
  return xs
}

const Wrap = (list) => {
  if (list == null) return []
  if (IsList(list)) return list
  return [list]
}

const Zip = (lists) => {
  const length = lists.reduce(
    (l, x) => l ? Math.min(l, x.length) : x.length,
    null
  )
  const zipped = []
  for (let i = 0; i < length; i++) {
    zipped[i] = lists.map(x => x[i])
  }
  return zipped
}

const Module = Array
const Bindable = BindableFor(Module)

export const at = Bindable(At)
export const append = Bindable(Append)
export const concat = Bindable(Concat)
export const remove = Bindable(Remove)
export const deleteAt = Bindable(DeleteAt)
export const duplicate = Bindable(Duplicate)
export const diffenrence = Bindable(Diffenrence)
export const first = Bindable(First)
export const flatten = Bindable(Flatten)
export const foldr = Bindable(FoldR)
export const foldl = Bindable(FoldL)
export const insertAt = Bindable(InserAt)
export const isList = Bindable(IsList)
export const last = Bindable(Last)
export const replaceAt = Bindable(ReplaceAt)
export const updateAt = Bindable(UpdateAt)
export const wrap = Bindable(Wrap)
export const zip = Bindable(Zip)

Object.assign(Module, {
  at,
  append,
  concat,
  delete: remove,
  deleteAt,
  delete_at: deleteAt,
  diffenrence,
  duplicate,
  first,
  flatten,
  foldr,
  foldl,
  insertAt,
  insert_at: insertAt,
  isList,
  is_list: isList,
  last,
  replaceAt,
  replace_at: replaceAt,
  updateAt,
  update_at: updateAt,
  wrap,
  zip,
})

export default Module
