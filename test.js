const Discord = require('discord.js')

const webhookClient = new Discord.WebhookClient('692545408580321360', 'D56luMPv_GWHkOhFeaBpmVW40MCWPrzmEl4DOW2zmbM031SZon4YcOZe170eGwZVBg9p');

const client = new Discord.Client();

const embed = new Discord.MessageEmbed()
	.setTitle('Some Title')
	.setColor('#0099ff');

client.once('ready', async () => {
	const channel = client.channels.cache.get('692545408580321360');
	try {
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.first();

		await webhook.send('Webhook test', {
			username: 'some-username',
			avatarURL: 'https://i.imgur.com/wSTFkRM.png',
			embeds: [embed],
		});
	} catch (error) {
		console.error('Error trying to send: ', error);
	}
});

client.login("D56luMPv_GWHkOhFeaBpmVW40MCWPrzmEl4DOW2zmbM031SZon4YcOZe170eGwZVBg9p");