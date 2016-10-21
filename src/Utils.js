
export function BindableFor (Module = {}) {
  return function (fn) {
    return function (...args) {
      if (this !== Module) {
        return fn(this, ...args)
      }
      if (args.length < fn.length) {
        return subject => fn(subject, ...args)
      }
      return fn(...args)
    }
  }
}

