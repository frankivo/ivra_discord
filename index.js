const Discord = require('discord.js');
const client = new Discord.Client();
const webhookId = process.env.WEBHOOK_ID;
const webhookToken = process.env.WEBHOOK_TOKEN;
const raceControlTextChannel = new Discord.WebhookClient(webhookId, webhookToken);

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.content.startsWith(`${process.env.PREFIX}`)) {

		// Race Control notifications
		if (message.content.startsWith(`${process.env.PREFIX}rc`)) {
			raceControlTextChannel.send(`@here ${message.author} sent a message: \n\n${message.content}`);
			message.channel.send('Your message has been sent to Race Control. They will reach out to you shortly if needed.');
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
