var settings = require("../settings.json");

exports.isCommand = (usrMsg) => {
	if (usrMsg !== null){
		usrMsg.trim();
		if (usrMsg[0] === settings.commandPrefix){
			return true;
		}
	}
	return false;
};

exports.commandPrefix = settings.commandPrefix;

exports.extractCmd = (usrMsg) => {
	if (usrMsg !== null){
		usrMsg.trim();
		var splitMsg = usrMsg.split(" ");
		var cmd = splitMsg[0];
		if (exports.isCommand(cmd)){
			cmd = cmd.substring(1);
		}
		return cmd;
	}
};

exports.extractArgs = (usrMsg) => {
	if (usrMsg !== null){
		usrMsg.trim();
		var args = usrMsg.split(" ");
		if (exports.isCommand(args[0])){
			args.shift();
		}
		return args;
	}
};