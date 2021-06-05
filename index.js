const Discord = require('discord.js');
const Canvas = require('canvas');
const { fillTextWithTwemoji } = require('node-canvas-with-twemoji');
const schedule = require('node-schedule');
const gis = require('g-i-s');

const client = new Discord.Client();
var losjob;
const die = () => {
	client.destroy();
	losjob.cancel();
};

var lastres;
function imgSrchResults(err, res) {
	if (err) {
	  console.log(err);
	}
	else {
	  lastres=res;
	}
  }

const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');
	let fontSize = 30;
	do {
		context.font = `${fontSize -= 5}px Menlo`;
	} while (context.measureText(text).width > canvas.width - 250);
	return context.font;
};

const losowanko = async () => {
	var genso = await client.guilds.fetch('647798243207544842'/*obrazanie remilii sv*/);
	var labomems = await genso.members.fetch();
	for (let i=0;i<3;i++){
		var labomem = labomems.random();
		console.log('love to : '+labomem.displayName);
		const canvas = Canvas.createCanvas(800, 400);
		const context = canvas.getContext('2d');
		const background = await Canvas.loadImage('fumolove.png');
		context.drawImage(background, 0, 0, canvas.width, canvas.height);
		context.font = applyText(canvas, labomem.displayName);
		context.fillStyle = labomem.displayHexColor;

		gis('fumo', async (err,res) => {
			if (err) {
				console.log(err);
			  }
			  else {
				const fumo1 = await Canvas.loadImage(res[Math.floor(Math.random() * res.length)].url);
				const fumo2 = await Canvas.loadImage(res[Math.floor(Math.random() * res.length)].url);
				context.drawImage(fumo1, 0, 0, 200, canvas.height);
				context.drawImage(fumo2, 500, 0, canvas.width, canvas.height);


				await fillTextWithTwemoji(context, labomem.displayName, 250, 280);
				const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'fumo-love.png');
				var dmchannel = await labomem.createDM();
				dmchannel.send(attachment).catch(err => {if (err) console.err(err)});
			  }
		});
	}
};

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}.`);
	losjob = schedule.scheduleJob('0 4 * * *', () => {losowanko();});
});

client.on('message', async msg => {
	console.log(msg.author.username+'\t'+msg.content);
	if (msg.content.startsWith('<@'+client.user.id+'>') || msg.content.startsWith('<@!'+client.user.id+'>')) {
		//losowanko();
		// var labomems = await msg.guild.members.fetch();
		// var labomem = labomems.random();

		const canvas = Canvas.createCanvas(800, 400);
		const context = canvas.getContext('2d');
		const background = await Canvas.loadImage('fumolove.png');
		context.drawImage(background, 0, 0, canvas.width, canvas.height);
		context.font = applyText(canvas, msg.member.displayName);
		context.fillStyle = msg.member.displayHexColor;
		gis('fumo', async (err,res) => {
			if (err) {
				console.log(err);
			} else {
				const fumo1 = await Canvas.loadImage(res[Math.floor(Math.random() * res.length)].url);
				const fumo2 = await Canvas.loadImage(res[Math.floor(Math.random() * res.length)].url);
				context.drawImage(fumo1, 0, 0, 290, canvas.height);
				context.drawImage(fumo2, 440, 0, 360, canvas.height);

				await fillTextWithTwemoji(context, msg.member.displayName, 250, 280);
				const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'fumo-love.png');
				msg.channel.send(attachment);
			  }
		});
	}
});

process.on('SIGINT', () => {die();});
process.on('SIGUSR1', () => {die();});
process.on('SIGUSR2', () => {die();});

client.login('NjU1MzY2NzYzNzYzOTkwNTQx.XfTD3A.dR0001m0u4liTJRn--d0pIqqnDw');
