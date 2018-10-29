const Discord = require('discord.js');
const client = new Discord.Client();
const webhookId = process.env.WEBHOOK_ID;
const webhookToken = process.env.WEBHOOK_TOKEN;
const raceControlTextChannel = new Discord.WebhookClient(webhookId, webhookToken);

client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.content.startsWith(`${process.env.PREFIX}rc`)) {
		raceControlTextChannel.send(`@here ${message.author} sent a message: \`\`\`${message.content}\`\`\``);
		message.channel.send('Your message has been sent to Race Control. They will reach out to you shortly if needed.');
	}
});

client.login(process.env.TOKEN);
