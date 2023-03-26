import { chain, assocPath } from "rambda"
import { getSettings } from "../settings.js"
import { log } from "../log.js"

export function setup() {
  const settings = getSettings()

  if (settings["reroll-npc-health"]) {
    Hooks.on("createToken", onEvent)
  }
}

async function onEvent(token, _options, userId) {
  log(token, _options, userId)

  // Only for the owner
  if (game.userId !== userId) {
    return
  }

  // no token
  if (!token) {
    return
  }
  // actor doesn't exists
  if (!token.actor) {
    return
  }
  // token is not hostile
  if (token.disposition > -1) {
    return
  }

  // token is a player
  if (token.actor.hasPlayerOwner) {
    return
  }

  const actor = token.actor
  const formula = getProperty(actor, "system.attributes.hp.formula")
  if (!formula) {
    // The system doesn't have an HP formula
    return
  }

  const roll = new Roll(formula)
  const hp = await roll.evaluate({ async: true })?.total

  token.update({
    actorData: {
      data: {
        attributes: {
          hp: {
            value: hp,
            max: hp,
          },
        },
      },
    },
  })

  await roll.toMessage(
    {
      flavor: `${actor.name} rolls for HP!`,
    },
    {
      rollMode: "gmroll", // or 'roll'
      speaker: ChatMessage.getSpeaker({ actor }),
    },
  )
}
