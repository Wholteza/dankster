exports.toDiscordList = (array) => {
	let list = "";
	array.forEach(element => {
		list = list.concat(`${element}\r\n`);
	});
	return list;
};

exports.wrapInBlock = (msg) => {
	return `\`\`\`${msg}\`\`\``;
};