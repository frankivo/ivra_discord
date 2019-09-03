const Discord = require('discord.js');
const client = new Discord.Client();

function sendProtestToRaceControl(author, channel, carsInvolved, timeStamp, reason) {
	const raceControlChannel = client.channels.find(item => item.name === process.env.RACE_CONTROL_CHANNEL_NAME)
	const richEmbedMessage = new Discord.RichEmbed();
	richEmbedMessage
		.setColor("#0000FF")
		.setTitle("New protest")
		.setDescription(`${author} submitted a protest in #${channel}`)
		.addField("Cars involved", carsInvolved, true)
		.addField("Timestamp", timeStamp, true)
		.addField("Description", reason)
		.addBlankField()
		.setTimestamp();

	raceControlChannel.send(`@here: new protest from #${channel}`, richEmbedMessage);
}

function sendTowToRaceControl(message, author, channel, carsInvolved) {
	const towChannel = client.channels.find(item => item.name === process.env.TOW_CHANNEL_NAME)
	const richEmbedMessage = new Discord.RichEmbed();
	richEmbedMessage
		.setColor("#ff0000")
		.setTitle("New Tow Request")
		.setDescription(`${author} is requesting tow #${channel}`)
		.addField("Car involved", carsInvolved, true)
		.addBlankField()
		.setTimestamp();
	towChannel.send(`@here: new tow request from #${channel}`, richEmbedMessage);
	message.reply('Tow successfully requested.  Please wait for RC confirmation before you tow back to the pits');

}

function sendBFToRaceControl(message, author, channel, carsInvolved) {
	const raceControlChannel = client.channels.find(item => item.name === process.env.RACE_CONTROL_CHANNEL_NAME)
	const richEmbedMessage = new Discord.RichEmbed();
	richEmbedMessage
		.setColor("#00FF00")
		.setTitle("New Black Flag Clear Request")
		.setDescription(`${author} is requesting a cleared black flag #${channel}`)
		.addField("Car involved", carsInvolved, true)
		.addBlankField()
		.setTimestamp();
	raceControlChannel.send(`@here: new black flag clear request from #${channel}`, richEmbedMessage);
	message.reply('Clear successfully requested');

}

function confirmProtestSubmitted(message, carsInvolved, timeStamp, reason) {
	const protestConfirmation = new Discord.RichEmbed();
	protestConfirmation
		.setColor("#E56A02")
		.setTitle("Protest successfully submitted")
		.setDescription(`Thank you ${message.author}, your protest is successfully submitted. Please check the protest sheet for the status of your protest.  Thank you to Neil Hekkens and NEO for allowing us to us the protest portion of the Race Control Bot.`)
		.addBlankField()
		.addField("Protest details", "Below you can find the information you submitted:")
		.addField("Cars involved", carsInvolved, true)
		.addField("Timestamp", timeStamp, true)
		.addField("Description", reason)
		.setTimestamp();

	message.reply(protestConfirmation);
}

function returnErrorMessage(message) {
	message.channel.send("Something went wrong. Please try again or contact RC manually.");
}

function initiateTow(message) {
	let initiator = message.author;
	let channel = message.channel.name;
	let carsInvolved = undefined;

	message.channel
		.send("Please answer the following questions: \n Which car number is requesting tow?")
		.then(() => {
			const filter = m => message.author.id === m.author.id;

			message.channel
				.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
				.then(collected => {
					carInvolved = collected.first().content;
					sendTowToRaceControl(message, initiator, channel, carInvolved);
				})
				.catch(collected => returnErrorMessage(message));
		})
}

function initiateBF(message) {
	let initiator = message.author;
	let channel = message.channel.name;
	let carsInvolved = undefined;

	message.channel
		.send("Please answer the following questions: \n Which car number is requesting a cleared black flag?")
		.then(() => {
			const filter = m => message.author.id === m.author.id;

			message.channel
				.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
				.then(collected => {
					carInvolved = collected.first().content;
					sendBFToRaceControl(message, initiator, channel, carInvolved);
				})
				.catch(collected => returnErrorMessage(message));
		})
}

function initiateProtest(message) {
	let initiator = message.author;
	let channel = message.channel.name;
	let carsInvolved = undefined;
	let timeStamp = undefined;
	let reason = undefined;

	message.channel
		.send("Please answer the following questions: \n What is your car number and number(s) of the other car(s) involved??")
		.then(() => {
			const filter = m => message.author.id === m.author.id;

			message.channel
				.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
				.then(collected => {
					carsInvolved = collected.first().content;

					message.channel
						.send("What is the iRacing Time Stamp (HR:MM:SS)")
						.then(() => {
							const filter = m => message.author.id === m.author.id;

							message.channel
								.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
								.then(collected => {
									timeStamp = collected.first().content;

									message.channel
										.send("Please provide a short description of the incident:")
										.then(() => {
											const filter = m => message.author.id === m.author.id;

											message.channel
												.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
												.then(collected => {
													reason = collected.first().content;
													sendProtestToRaceControl(initiator, channel, carsInvolved, timeStamp, reason);
													confirmProtestSubmitted(message, carsInvolved, timeStamp, reason);
												})
												.catch(collected => returnErrorMessage(message));
										})
								})
								.catch(collected => returnErrorMessage(message));
						})
				})
				.catch(collected => returnErrorMessage(message));
		});
}


client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.content.startsWith(`${process.env.PREFIX}`)) {

		if (message.content.startsWith(`${process.env.PREFIX}help`)) {
			message.channel.send(`Here is a list of commands for you to use:
\t\`!rc [message]\` - Use if you need to talk with Race Control.
\t\`!help\` - Use to bring up a list of commands.
\t\`!sheet\` - Use to bring up the Race Control Decision Sheet link.
\t\`!protest\` - Use to log a new protest.
\t\`!clear\` - Use to request a cleared black flag.
\t\`!tow\` - Use to request a tow.`);
		}

		// Race Control notifications
		else if (message.content.startsWith(`${process.env.PREFIX}rc`)) {
			const raceControlChannel = client.channels.find(item => item.name === process.env.RACE_CONTROL_CHANNEL_NAME)
			raceControlChannel.send(`@here ${message.author} sent a message: \n\n${message.content}`);
			message.channel.send('Your message has been sent to Race Control. They will reach out to you shortly if needed.');
		}

		// Sheet notifications
		else if (message.content.startsWith(`${process.env.PREFIX}sheet`)) {
			message.channel.send('https://docs.google.com/spreadsheets/d/1OukaYFKTPTvYaM7NhGhTvHcPcjc7gt38T0AGBUSsoVs/edit?usp=sharing');
		}

		// Protest
		else if (message.content.startsWith(`${process.env.PREFIX}protest`)) {
			initiateProtest(message)
		}

		// Protest
		else if (message.content.startsWith(`${process.env.PREFIX}tow`)) {
			initiateTow(message)
		}

		// BLack Flag clear
		else if (message.content.startsWith(`${process.env.PREFIX}clear`)) {
			initiateBF(message)
		}

		// Team text notifications by car number(e.g !289)
		else if (message.member.roles.find("name", process.env.RC_ROLE_NAME)) {
			const carNumber = message.content.match(/\d+/)[0];
			const voiceChannel = client.channels.find(item => item.name.match(/\d+/) && item.name.match(/\d+/)[0] === carNumber);

			if (voiceChannel === null) {
				message.channel.send(`No text channel found for car #${carNumber}`);
			} else {
				const categoryId = voiceChannel.parentID;
				const textChannel = client.channels.find(item => item.parentID === categoryId && item.name === 'text');
				textChannel.send((`Race Control sent a message: \n\n${message.content}`))
			}
		}
	}
});

client.login(process.env.TOKEN);
