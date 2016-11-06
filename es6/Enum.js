import { BindableFor } from './Utils'
import { ToList as MapToList, IsMap, Merge, MapOf } from './Map'
import { IsList } from './List'

const ToList = (arg) => IsList(arg) ? arg : MapToList(arg)
const CloneList = (list) => [].concat(list)

const Range = (end, start = 0, step = 1) => {
  const list = []
  for (let i = start; i < end; i += step) list.push(i)
  return list
}

const Identity = x => x

const All = (enumerable, fn = Identity) =>
  ToList(enumerable).every((x) => fn(x))

const Any = (enumerable, fn = Identity) =>
  ToList(enumerable).some((x) => fn(x))

const At = (enumerable, index, def = null) => {
  const list = ToList(enumerable)
  const where = index >= 0 ? index : list.length + index
  if (where >= 0 && where < list.length) return list[where]
  return def
}

const Chunk = (enumerable, count, step = count, leftover = null) => {
  const list = ToList(enumerable)

  const hasleftover = leftover != null
  let keep = hasleftover ? 1 : 0

  const chunks =
    Range(list.length, 0, step)
      .map(index => list.filter((_, i) => index <= i && i < index + count))
      .filter(chunk => chunk.length === count || keep-- > 0)

  if (hasleftover && chunks.length) {
    const last = chunks.length - 1
    chunks[last] = chunks[last].concat(leftover).filter((_, i) => i < count)
  }

  return chunks
}

const ChunkBy = (enumerable, fn) => {
  const list = ToList(enumerable)
  if (list.length === 0) return []
  const first = list.shift()
  let value = fn(first)
  let chunk = [first]
  const chunks = []
  list.forEach(x => {
    const newValue = fn(x)
    if (newValue === value) {
      chunk.push(x)
    } else {
      chunks.push(chunk)
      value = newValue
      chunk = [x]
    }
  })
  if (chunk.length) chunks.push(chunk)
  return chunks
}

const Concat = (left, right = null) =>
  right == null
    ? [].concat(...ToList(left))
    : ToList(left).concat(ToList(right))

const Count = (enumerable, fn = null) =>
  fn == null
    ? ToList(enumerable).length
    : ToList(enumerable).filter(x => fn(x)).length

const StrictEqual = (x, y) => x === y

const DedupBy = (enumerable, fn, equal = StrictEqual) => {
  const list = CloneList(ToList(enumerable))
  if (list.length === 0) return []
  const first = list.shift()
  const reducer = ([head, list], x) => {
    const value = fn(x)
    if (!equal(value, head)) list.push(x)
    return [value, list]
  }
  return list.reduce(reducer, [fn(first), [first]])[1]
}

const Dedup = (enumerable, equal = StrictEqual) =>
  DedupBy(enumerable, Identity, equal)

const Drop = (enumerable, n) => {
  const list = CloneList(ToList(enumerable))
  n < 0
    ? list.splice(n, -n)
    : list.splice(0, n)
  return list
}

const DropEvery = (enumerable, nth) => {
  if (nth === 0) return enumerable
  if (nth === 1) return []
  return ToList(enumerable).filter((_, i) => i % nth !== 0)
}

const DropWhile = (enumerable, fn) => {
  const list = ToList(enumerable)
  const index = list.findIndex(x => !fn(x))
  if (index < 0) return []
  const copy = CloneList(list)
  copy.splice(0, index)
  return copy
}

const Into = (enumerable, collactable) => {
  if (IsList(collactable)) {
    return Concat(collactable, ToList(enumerable))
  }
  if (IsMap(collactable)) {
    return Merge(collactable, MapOf(enumerable))
  }
  throw new Error('Into is only implemented for List and Map')
}

const FMap = (enumerable, fn) =>
  ToList(enumerable).map(x => fn(x))

const Each = (enumerable, fn) =>
  ToList(enumerable).forEach(x => fn(x))

const Filter = (enumerable, fn) =>
  ToList(enumerable).filter(x => fn(x))

const Find = (enumerable, fn) =>
  ToList(enumerable).find(x => fn(x))

const Not = (fn) => x => !fn(x)

const Reduce = (enumerable, init, fn = null) =>
  fn == null
    ? ToList(enumerable).reduce((acc, x) => init(x, acc))
    : ToList(enumerable).reduce(((acc, x) => fn(x, acc)), init)

const Reject = (enumerable, fn) =>
  Filter(enumerable, Not(fn))

const Sort = (enumerable, fn = null) => {
  const copy = CloneList(ToList(enumerable))
  if (fn == null) {
    copy.sort()
  } else {
    const comp = (x, y) => fn(x, y) ? -1 : 1
    copy.sort(comp)
  }
  return copy
}

const Zip = (enum1, enum2) => {
  const a = ToList(enum1)
  const b = ToList(enum2)
  const size = Math.min(a.length, b.length)
  return FMap(Range(size), i => [a[i], b[i]])
}

const Module = ToList
const Bindable = BindableFor(Module)

export const at = Bindable(At)
export const all = Bindable(All)
export const any = Bindable(Any)
export const chunk = Bindable(Chunk)
export const chunkBy = Bindable(ChunkBy)
export const concat = Bindable(Concat)
export const count = Bindable(Count)
export const dedup = Bindable(Dedup)
export const dedupBy = Bindable(DedupBy)
export const drop = Bindable(Drop)
export const dropEvery = Bindable(DropEvery)
export const dropWhile = Bindable(DropWhile)
export const each = Bindable(Each)
export const filter = Bindable(Filter)
export const find = Bindable(Find)
export const into = Bindable(Into)
export const map = Bindable(FMap)
export const reduce = Bindable(Reduce)
export const reject = Bindable(Reject)
export const sort = Bindable(Sort)
export const toList = Bindable(ToList)
export const zip = Bindable(Zip)

Object.assign(Module, {
  at,
  all,
  any,
  chunk,
  chunkBy,
  chunk_by: chunkBy,
  concat,
  count,
  dedup,
  dedupBy,
  dedup_by: dedupBy,
  drop,
  dropEvery,
  drop_every: dropEvery,
  dropWhile,
  drop_while: dropWhile,
  each,
  filter,
  find,
  into,
  map,
  reduce,
  reject,
  sort,
  toList,
  to_list: toList,
  zip,
})

export default Module
