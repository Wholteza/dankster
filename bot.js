var Discord = require("discord.js");
var randomPuppy = require("random-puppy");
var settings = require("./settings.json");
var reddit = require("./reddit.json");
var whitelist = require("./whitelist.json");
var FileWrapper = require("./helpers/file-wrapper");
var OutputFormatter = require("./helpers/discord-output-formatter");
var CommandHelper = require("./helpers/discord-command-helpers");
var MessageHandlers = require("./handlers/message-handlers");

var client = new Discord.Client();

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
	if (CommandHelper.isCommand(msg.content)) {
		var user = msg.author.tag;
		var cmd = CommandHelper.extractCmd(msg.content);
		var args = CommandHelper.extractArgs(msg.content);
		console.log(cmd);
		console.log(args);

		switch (cmd) {
		// !ping
		case "ping":
			msg.reply("Beep-boop");
			break;

		case "alldead":
			MessageHandlers.allDead((message) => (msg.reply(message)));
			break;

		case "raid":
			MessageHandlers.max((message) => (msg.reply(message)));
			break;

		case "puppy":
			MessageHandlers.puppy((message) => (msg.reply(message)));
			break;

		case "subreddits":
			MessageHandlers.subreddits(args, user, reddit, whitelist, (message) => {
				FileWrapper.readJsonFileToObject("reddit.json", (newReddit) => (reddit = newReddit));
				msg.reply(message);
			});
			break;

		case ("hitme"):
			MessageHandlers.hitme(args, reddit, (message) => (msg.reply(message)));
			break;

		case "whitelist":
			MessageHandlers.whitelist(args, user, whitelist, (message) => {
				FileWrapper.readJsonFileToObject("whitelist.json", (newWhitelist) => (whitelist = newWhitelist));
				msg.reply(message);
			});
			break;
		
		case "help":
			MessageHandlers.help((message) => (msg.reply(message)));
			break;

		default:
			msg.reply("That's not a valid command, type **!help** to see available commands.");
		}
	}
});

client.login(settings.token);
