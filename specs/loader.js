import 'babel-polyfill'

const testsContext = require.context('.', true, /Spec$/)
testsContext.keys().forEach(testsContext)
