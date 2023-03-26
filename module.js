function keys(x){
  return Object.keys(x)
}

var id = "little-things";

const moduleName = id;
const i18n = (key) => game.i18n.localize(key);

const log = (function () {
  var context = moduleName + " | ";
  return Function.prototype.bind.call(console.log, console, context)
})();

((function () {
  var context = moduleName + " | ";
  return Function.prototype.bind.call(console.warn, console, context)
}))();

((function () {
  var context = moduleName + " | ";
  return Function.prototype.bind.call(console.error, console, context)
}))();

const settings = {
  "reroll-npc-health": {
    kind: Boolean,
    default: true,
  },
};

let memo = {};
function getSettings() {
  if (!memo._) {
    for (const key of keys(settings)) {
      memo[key] = window.game.settings.settings.get(
        `${moduleName}.${key}`,
      )?.config;
    }
    memo._ = 1;
  }
  return memo
}

function registerSettings() {
  for (const key of keys(settings)) {
    log("registering:", key);
    window.game.settings.register(moduleName, key, {
      name: i18n(`${moduleName}.${key}.name`),
      hint: i18n(`${moduleName}.${key}.hint`),
      scope: "world",
      config: true,
      default: settings[key].default,
      type: settings[key].kind,
    });
  }
}

function register() {
  const settings = getSettings();

  log(settings);
  if (settings["reroll-npc-health"]) {
    Hooks.on("createToken", onEvent);
  }
}

async function onEvent(token, _options, userId) {
  log(token, _options, userId);

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

  const actor = token.actor;
  const formula = getProperty(actor, "system.attributes.hp.formula");
  if (!formula) {
    return getProperty(actor, "system.attributes.hp.max") || 0
  }

  const roll = new Roll(formula);
  const hp = await roll.evaluate({ async: true })?.total;

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
  });

  await roll.toMessage(
    {
      flavor: `${actor.name} rolls for HP!`,
    },
    {
      rollMode: "gmroll", // or 'roll'
      speaker: ChatMessage.getSpeaker({ actor }),
    },
  );
}

Hooks.once("init", () => {
  registerSettings();
});

Hooks.once("setup", () => {
  register();
});

Hooks.once("ready", () => {
  const game = window.game;

  if (!game.modules.get("lib-wrapper")?.active && game.user.isGM)
    ui.notifications.error(
      `Module ${MODULE} requires the 'libWrapper' module. Please install and activate it.`,
    );
});
//# sourceMappingURL=module.js.map
