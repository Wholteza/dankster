var FileWrapper = require("./helpers/file-wrapper");

try {
  FileWrapper.initSettingsAndStorage();
} catch (e) {
  console.log("INIT ERROR", e);
}
var constants = require("./util/constants");
var Discord = require("discord.js");
var settings = require("./" + constants.getSettingsPath());
var reddit = require("./" + constants.getRedditPath());
var whitelist = require("./" + constants.getWhitelistPath());
var emojis = require("./" + constants.getEmojisPath());
var CommandHelper = require("./helpers/discord-command-helpers");
var MessageHandlers = require("./handlers/message-handlers");
var EmojiHandler = require("./handlers/emoji-handler");

var client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  try {
    if (CommandHelper.isCommand(msg.content)) {
      var user = msg.author.tag;
      var cmd = CommandHelper.extractCmd(msg.content);
      var args = CommandHelper.extractArgs(msg.content);
      // console.log("Command", cmd);
      // console.log("Arguments", args);

      switch (cmd) {
      // !ping
      case "ping":
        msg.reply("Beep-boop");
        break;
      case "a":
      case "alldead":
        MessageHandlers.allDead(message => msg.reply(message));
        break;
      case "r":
      case "raid":
        MessageHandlers.max(message => msg.reply(message));
        break;
      case "p":
      case "puppy":
        MessageHandlers.puppy(message => msg.reply(message));
        break;
      case "s":
      case "subreddits":
        MessageHandlers.subreddits(args, user, reddit, whitelist, message => {
          FileWrapper.readJsonFileToObject(
            constants.getRedditPath(),
            newReddit => (reddit = newReddit)
          );
          msg.reply(message);
        });
        break;
      case "H":
      case "hitme":
        MessageHandlers.hitme(args, reddit, message => msg.reply(message));
        break;
      case "w":
      case "whitelist":
        MessageHandlers.whitelist(args, user, whitelist, message => {
          FileWrapper.readJsonFileToObject(
            constants.getWhitelistPath(),
            newWhitelist => (whitelist = newWhitelist)
          );
          msg.reply(message);
        });
        break;
      case "e":
      case "emoji":
        EmojiHandler.parse(
          args,
          user,
          whitelist,
          emojis,
          settings.commandPrefix,
          (message, newEmojis) => {
            if (newEmojis) {
              emojis = newEmojis;
            }
            msg.reply(message);
          }
        );
        break;
      case "h":
      case "help":
        MessageHandlers.help(message => msg.reply(message));
        break;
      default:
        msg.reply(
          "That's not a valid command, type **!help** to see available commands."
        );
      }
    }
  } catch (e) {
    console.log("MAIN ON MESSAGE ERROR", e);
  }
});

client.login(settings.token);
