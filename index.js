const Discord = require('discord.js');
const Canvas = require('canvas');
const { fillTextWithTwemoji } = require('node-canvas-with-twemoji');
const schedule = require('node-schedule');

const client = new Discord.Client();
var losjob;

const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `${fontSize -= 10}px Menlo`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > canvas.width - 250);

	// Return the result to use in the actual canvas
	return context.font;
};

const die = () => {
	client.destroy();
	losjob.cancel();
};

const losowanko = async () => {
		var genso = await client.guilds.fetch('672101553800216577'/*'647798243207544842'/*obrazanie remilii sv*/);
		genso.members.fetch().then(labomems => {console.log(labomems.random())});


		
};

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	losjob = schedule.scheduleJob('44 9 * * *', () => {losowanko();});
});

client.on('message', async msg => {
	console.log(msg.member.displayName+'\t'+msg.content);
	if (msg.content.startsWith('<@!'+client.user.id+'>')) {
		var labomems = await msg.guild.members.fetch();
		var labomem = labomems.random();

		const canvas = Canvas.createCanvas(800, 400);
		const context = canvas.getContext('2d');
		const background = await Canvas.loadImage('fumolove.png');
		context.drawImage(background, 0, 0, canvas.width, canvas.height);
		context.font = applyText(canvas, labomem.displayName);
		
		context.fillStyle = labomem.displayHexColor;
		await fillTextWithTwemoji(context, labomem.displayName, 250, 280);
		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'fumo-love.png');
		msg.channel.send('jajcoez', attachment);
	}
});

process.on('SIGINT', () => {die();});
process.on('SIGUSR1', () => {die();});
process.on('SIGUSR2', () => {die();});

client.login('NjU1MzY2NzYzNzYzOTkwNTQx.XfTD3A.dR0001m0u4liTJRn--d0pIqqnDw');