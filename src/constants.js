import * as mod from "../module.json"

export const moduleName = mod.id
export const i18n = (key) => game.i18n.localize(key)
