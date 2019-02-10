var randomPuppy = require("random-puppy");
var FileWrapper = require("../helpers/file-wrapper");
var OutputFormatter = require("../helpers/discord-output-formatter");
const constants = require("../util/constants");

exports.max = callback => {
  var day = new Date().getDay();
  var days = {
    1: "Måndag",
    2: "Tisdag",
    3: "Onsdag",
    4: "Torsdag",
    5: "Fredag",
    6: "Lördag",
    7: "Söndag"
  };
  var today = days[day];
  var raiding = "";
  switch (day) {
  case 3 || 6:
    raiding = "raidar klockan 20.00";
    break;
  default:
    raiding = "raidar inte";
  }
  callback(`Idag är det ${today}, så max ${raiding}.`);
};

exports.allDead = callback => {
  callback("https://www.youtube.com/watch?v=ZjPSBr2IpJM");
};

exports.puppy = callback => {
  randomPuppy().then(url => callback(url));
};

exports.hitme = (args, reddit, callback) => {
  var multiplyer = 1;
  if (args[0] != null && args[0] <= 5) {
    multiplyer = args[0];
  }
  for (let i = 0; i < multiplyer; i++) {
    var randomSubreddit =
      reddit.subreddits[Math.floor(Math.random() * reddit.subreddits.length)];
    randomPuppy(randomSubreddit).then(url => {
      callback(url);
    });
  }
};

exports.subreddits = (args, user, reddit, whitelist, callback) => {
  if (args !== null) {
    if (whitelist.users.includes(user)) {
      let argcmd = args.shift();
      if (argcmd === "add") {
        if (args.length === 0) {
          callback(
            'You tried to add subreddits but didn\'t define any after the "add".'
          );
          return;
        }
        let message = "Added these subreddits to the list: ";
        for (let i = 0; i < args.length; i++) {
          if (args[i] !== null && args[i] !== " ") {
            reddit.subreddits = reddit.subreddits.concat(args[i]);
            message = message.concat(args[i] + " ");
          }
        }
        FileWrapper.writeObjectToJsonFile(
          constants.getRedditPath(),
          reddit,
          () => {
            FileWrapper.readJsonFileToObject(
              constants.getRedditPath(),
              newReddit => (reddit = newReddit)
            );
          }
        );
        callback(message);
        return;
      }
      if (argcmd === "remove") {
        if (args.length === 0) {
          callback(
            'You tried to remove subreddits but didn\'t define any after the "remove".'
          );
          return;
        }
        let subreddits = [];
        for (let i = 0; i < reddit.subreddits.length; i++) {
          for (let j = 0; j < args.length; j++) {
            if (reddit.subreddits[i] === args[j]) {
              subreddits.push(reddit.subreddits[i]);
              reddit.subreddits.splice(i, 1);
            }
          }
        }
        FileWrapper.writeObjectToJsonFile(
          constants.getRedditPath(),
          reddit,
          () => {
            FileWrapper.readJsonFileToObject(
              constants.getRedditPath(),
              newReddit => (reddit = newReddit)
            );
          }
        );
        if (subreddits.length === 0) {
          callback("Subreddit(s) not removed, no such subreddit(s) in list.");
          return;
        }
        callback(
          `These subreddits were removed: \r\n${OutputFormatter.wrapInBlock(
            OutputFormatter.toDiscordList(subreddits)
          )}`
        );
        return;
      }
      if (argcmd === "list") {
        callback(
          `These subreddits are in the list: \r\n${OutputFormatter.wrapInBlock(
            OutputFormatter.toDiscordList(reddit.subreddits)
          )}`
        );
        return;
      }
    } else {
      callback("You don't have the permissions to use this command.");
      return;
    }
  }
  callback(
    '**Manual for !subreddits**\r\nUsage: "!subreddits *[command]* *[subreddit 1]* *[subreddit 2]..*"\r\n    Available commands: list, add, remove'
  );
};

exports.whitelist = (args, user, whitelist, callback) => {
  if (whitelist.users.includes(user)) {
    if (args !== null) {
      if (args[0] === "add") {
        args.shift();
        if (args.length !== 0) {
          var users = [];
          for (let i = 0; i < args.length; i++) {
            whitelist.users.push(args[i]);
            users.push(args[i]);
          }
          FileWrapper.writeObjectToJsonFile(
            constants.getWhitelistPath(),
            whitelist,
            () => {
              FileWrapper.readJsonFileToObject(
                constants.getWhitelistPath(),
                newWhitelist => (whitelist = newWhitelist)
              );
            }
          );
          callback(`Added these users to the whitelist: ${users}`);
          return;
        }
      }
      if (args[0] === "remove") {
        args.shift();
        let usersFormatted = "";
        for (let i = 0; i < whitelist.users.length; i++) {
          for (let j = 0; j < args.length; j++) {
            if (whitelist.users[i] === args[j] && i !== 0) {
              usersFormatted = usersFormatted.concat(
                `    ${whitelist.users[i]}\r\n`
              );
              whitelist.users.splice(i, 1);
            }
          }
        }
        let json = JSON.stringify(whitelist);
        FileWrapper.writeObjectToJsonFile(
          constants.getWhitelistPath(),
          whitelist,
          () => {
            FileWrapper.readJsonFileToObject(
              constants.getWhitelistPath(),
              newWhitelist => (whitelist = newWhitelist)
            );
          }
        );
        callback(
          `These users were removed from the whitelist: \`\`\`${usersFormatted}\`\`\``
        );
        return;
      }
      if (args[0] === "list") {
        let usersFormatted = "";
        for (let i = 0; i < whitelist.users.length; i++) {
          usersFormatted = usersFormatted.concat(
            `    ${whitelist.users[i]}\r\n`
          );
        }
        callback(
          `These users are whitelisted:\r\n \`\`\`${usersFormatted}\`\`\``
        );
        return;
      }
    }
    callback(
      '**Manual for !whitelist**\r\nUsage: "!whitelist *[command]* *[user1]* *[user2]..*"\r\n    Available command: **list**, **add**, **remove**'
    );
    return;
  }
  callback("You don't have the permissions to use this command.");
};

exports.help = callback => {
  var help = {
    title:
      "Hi, i'm a bot created by some wierd fella.\r\n My possible commands are:",
    commands: [
      {
        command: "**!help (!h)**",
        description: "Display this help dialog"
      },
      {
        command: "**!raid (!r)**",
        description: "See if Max is raiding in WoW"
      },
      {
        command: "**!puppy (!p)**",
        description: "Fetch a random puppy image"
      },
      {
        command: "**!hitme (!H)**",
        description:
          "Fetch a random image from a random subreddit listed with the command !subreddits"
      },
      {
        command: "**!subreddits (!s)**",
        description: "Manage subreddits"
      },
      {
        command: "**!whitelist (!w)**",
        description: "Manage whitelist"
      },
      {
        command: "**!alldead (!a)**",
        description: "Post link to epic beyond the summit intro"
      },
      {
        command: "**!emoji (!e)**",
        description: "post, add remove or list emojis"
      }
    ]
  };

  function composeHelpMessage() {
    let message = "";
    let lineEnding = "\r\n";
    let indent = "    ";
    let separator = ": ";

    message = message.concat(help.title + lineEnding);
    var commands = "";

    for (let i = 0; i < help.commands.length; i++) {
      commands = commands.concat(
        indent +
          help.commands[i].command +
          separator +
          help.commands[i].description +
          lineEnding
      );
    }
    return message + commands;
  }

  callback(composeHelpMessage());
};
