import { map, keys } from "rambda"
import { moduleName, i18n } from "./constants.js"
import { log } from "./log.js"

const settings = {
  "reroll-npc-health": {
    kind: Boolean,
    default: true,
  },
}

let memo = {}
export function getSettings() {
  if (!memo._) {
    for (const key of keys(settings)) {
      memo[key] = window.game.settings.settings.get(
        `${moduleName}.${key}`,
      )?.config
    }
    memo._ = 1
  }
  return memo
}

export function registerSettings() {
  for (const key of keys(settings)) {
    log("registering:", key)
    window.game.settings.register(moduleName, key, {
      name: i18n(`${moduleName}.${key}.name`),
      hint: i18n(`${moduleName}.${key}.hint`),
      scope: "world",
      config: true,
      default: settings[key].default,
      type: settings[key].kind,
    })
  }
}
