var fs = require("fs");

exports.readJsonFileToObject = (filename, callback) => {
	fs.readFile(filename, "utf8", function readFileCallback (err, data) {
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