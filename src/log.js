import { moduleName } from "./constants.js"

export const log = (function () {
  var context = moduleName + " | "
  return Function.prototype.bind.call(console.log, console, context)
})()

export const warn = (function () {
  var context = moduleName + " | "
  return Function.prototype.bind.call(console.warn, console, context)
})()

export const err = (function () {
  var context = moduleName + " | "
  return Function.prototype.bind.call(console.error, console, context)
})()
