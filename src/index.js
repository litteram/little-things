import * as r from "rambda"

import { moduleName, i18n } from "./constants.js"
import { registerSettings, getSettings } from "./settings.js"

import * as componentRerollHealth from "./components/reroll_health.js"
import * as componentTorch from "./components/torch.js"

Hooks.once("init", () => {
  registerSettings()
})

Hooks.once("setup", () => {
  componentRerollHealth.setup()
  componentTorch.setup()
})

Hooks.once("ready", () => {
  const game = window.game

  if (!game.modules.get("lib-wrapper")?.active && game.user.isGM)
    ui.notifications.error(
      `Module ${MODULE} requires the 'libWrapper' module. Please install and activate it.`,
    )
})
