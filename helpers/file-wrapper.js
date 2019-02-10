const fs = require("fs");
const constants = require("../util/constants");

exports.readJsonFileToObject = (filename, callback) => {
  fs.readFile(filename, "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      callback(JSON.parse(data));
    }
  });
};

exports.writeObjectToJsonFile = (filename, object, callback) => {
  let json = JSON.stringify(object);
  fs.writeFile(filename, json, "utf8", callback);
};

exports.writeObjectToJsonFileSync = (filename, object) => {
  let json = JSON.stringify(object);
  fs.writeFileSync(filename, json, "utf8");
};

exports.initSettingsAndStorage = () => {
  if (!fs.existsSync(constants.getWhitelistPath())) {
    console.log(
      "Generating whitelist storage file, you should open it and add your discord tag, otherwise you will not be able to do anything..."
    );
    this.writeObjectToJsonFileSync(constants.getWhitelistPath(), {
      users: ["your-tag-here#1234"]
    });
  }
  if (!fs.existsSync(constants.getRedditPath())) {
    console.log("Generating subreddit storage file...");
    this.writeObjectToJsonFileSync(constants.getRedditPath(), {
      subreddits: []
    });
  }
  if (!fs.existsSync(constants.getEmojisPath())) {
    console.log("Generating emojis storage file...");
    this.writeObjectToJsonFileSync(constants.getEmojisPath(), { emojis: [] });
  }
  if (!fs.existsSync(constants.getSettingsPath())) {
    console.log(
      "settings.json does not exist, i will create the file for you but you must add your bot secret key manually to continue..."
    );
    this.writeObjectToJsonFileSync(constants.getSettingsPath(), {
      token: "your-discord-bot-secret-token-here",
      commandPrefix: "!"
    });
    process.exit();
  }
};
