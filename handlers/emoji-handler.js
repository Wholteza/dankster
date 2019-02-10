const DiscordOutputFormatter = require("../helpers/discord-output-formatter");
const FileWrapper = require("../helpers/file-wrapper");
const FORBIDDEN_NAMES = ["add", "remove", "list"];
const EMOJI_JSON_NAME = "emojis.json";
const isAllowedToAlter = (user, whitelist) => {
  return whitelist.users.includes(user);
};
const handleError = e => {
  console.log("EMOJI ERROR", e);
};
exports.parse = (args, user, whitelist, emojis, cmdPrefix, callback) => {
  try {
    let action = args && args[0];
    let arguments = args && args.length > 1 && args.slice(1);
    console.log("EMOJI", { action: action, arguments: arguments });
    switch (action) {
    case "add":
      if (!isAllowedToAlter(user, whitelist)) {
        callback("You are not authorized to use this command");
        break;
      }
      if (arguments.length !== 2) {
        callback(
          `Please include both an alias and a url like so: \"${cmdPrefix}emoji add funnycat http://link-to-funny-cat.meow\"`
        );
        break;
      }
      if (FORBIDDEN_NAMES.includes(arguments[0])) {
        callback(`You can not name an emoji any of: ${FORBIDDEN_NAMES}`);
        break;
      }
      if (emojis.emojis.filter(e => e.alias === arguments[0]).length > 0) {
        callback(
          `There is already an emoji with that name, try \"${cmdPrefix}emoji list\" to see them all`
        );
        break;
      }
      try {
        FileWrapper.writeObjectToJsonFile(
          EMOJI_JSON_NAME,
          {
            emojis: [
              ...emojis.emojis,
              { alias: arguments[0], url: arguments[1] }
            ]
          },
          () => {
            FileWrapper.readJsonFileToObject("emojis.json", newEmojis => {
              callback(
                `Emoji \"${arguments[0]}\" was successfully added`,
                newEmojis
              );
            });
          }
        );
      } catch (e) {
        handleError(e);
        callback(
          "Something went wrong while trying to add a new emoji, sorry..."
        );
      }
      break;
    case "remove":
      if (!isAllowedToAlter(user, whitelist)) {
        callback("You are not authorized to use this command");
        break;
      }
      if (arguments.length !== 1) {
        callback(
          "Error removing emoji, supply exactly ONE emoji alias to remove"
        );
        break;
      }
      if (!emojis.emojis.map(e => e.alias).includes(arguments[0])) {
        callback(`There is no emoji \"${arguments[0]}\" to remove`);
        break;
      }
      try {
        FileWrapper.writeObjectToJsonFile(
          EMOJI_JSON_NAME,
          { emojis: emojis.emojis.filter(e => e.alias !== arguments[0]) },
          () => {
            FileWrapper.readJsonFileToObject("emojis.json", newEmojis => {
              callback(`Emoji \"${arguments[0]}\" was removed`, newEmojis);
            });
          }
        );
      } catch (e) {
        handleError(e);
        callback(
          "Something went wrong when trying to remove an emoji, sorry..."
        );
      }
      break;
    case "list":
      callback(
        (emojis &&
            DiscordOutputFormatter.toDiscordList(
              emojis.emojis.map(e => e.alias)
            )) ||
            "You do not have any emojis"
      );
      break;
    default:
      if (action) {
        if (arguments && arguments.length > 0) {
          callback("Please provide only ONE emoji name at a time");
          break;
        }
        if (emojis.emojis.filter(e => e.alias === action).length === 0) {
          let simular =
              (emojis &&
                emojis.emojis &&
                emojis.emojis
                  .map(e => e.alias)
                  .filter(a => a.includes(action))) ||
              [];
          if (simular.length > 0) {
            callback(
              `There is no emoji with name \"${action}\"\r\nDid you mean any of these: ${DiscordOutputFormatter.toDiscordList(
                simular
              )}`
            );
          } else {
            callback(`There is no emoji with name \"${action}\"`);
          }
          break;
        }
        callback(
          `${action}: ${emojis.emojis.filter(e => e.alias === action)[0].url}`
        );
        break;
      }
      callback(`**Manual for ${cmdPrefix}emoji**\r\n
            Usage: \"${cmdPrefix}emoji *add* *[name of emoji]* *[url for emoji]*\"\r\n
            \"${cmdPrefix}emoji *remove* *[name of emoji]*\"\r\n
            \"${cmdPrefix}emoji *list* *[name of emoji]*\"\r\n
            \"${cmdPrefix}emoji *[name of emoji]*\"\r\n
            Available commands: list, add, remove, [name of emoji]`);
      break;
    }
  } catch (e) {
    console.log("EMOJI PARSER ERROR", e);
  }
};
