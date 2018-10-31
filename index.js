const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.content.startsWith(`${process.env.PREFIX}`)) {

		// Race Control notifications
		if (message.content.startsWith(`${process.env.PREFIX}rc`)) {
			const raceControlChannel = client.channels.find(item => item.name === process.env.RACE_CONTROL_CHANNEL_NAME)
			raceControlChannel.send(`@here ${message.author} sent a message: \n\n${message.content}`);
			message.channel.send('Your message has been sent to Race Control. They will reach out to you shortly if needed.');
		}

		// Appeal notifications
		else if (message.content.startsWith(`${process.env.PREFIX}appeal`)) {
			const appealsChannel = client.channels.find(item => item.name === process.env.APPEALS_CHANNEL_NAME)
			appealsChannel.send(`@here ${message.author} sent a message: \n\n${message.content}`);
			message.channel.send('Your appeal has been sent successfully. Race Control will review your appeal ASAP and will contact you with the outcome.');
		}

		// Talk notifications
		else if (message.content.startsWith(`${process.env.PREFIX}talk`)) {
			const waitingroomChannel = client.channels.find(item => item.name === process.env.WAITING_ROOM_CHANNEL_NAME)
			waitingroomChannel.send(`@here ${message.author} needs to talk with Race Control: \n\n${message.content}`);
			message.channel.send('Please make sure you are in the Waiting Room voice channel and Race Control will be with you shortly');
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
				textChannel.send((`@here Race Control sent a message: \n\n${message.content}`))
			}
		}
	}
});

client.login(process.env.TOKEN);
