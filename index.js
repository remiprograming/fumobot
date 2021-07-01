const Discord = require('discord.js');
const Canvas = require('canvas');
const { fillTextWithTwemoji } = require('node-canvas-with-twemoji');
const schedule = require('node-schedule');
const gis = require('g-i-s');
const Danbooru = require('danbooru');

const client = new Discord.Client();
let booru = new Danbooru('https://safebooru.donmai.us/');
var losjob;
const die = () => {
	client.destroy();
	losjob.cancel();
};

const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');
	let fontSize = 30;
	do {
		context.font = `${fontSize -= 5}px Menlo`;
	} while (context.measureText(text).width > canvas.width);
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

		gis('fumo touhou', async (err,res) => {
			if (err) {
				console.log(err);
			  }
			  else {
				const fumo1 = await Canvas.loadImage(res[Math.floor(Math.random() * res.length)].url);
				const fumo2 = await Canvas.loadImage(res[Math.floor(Math.random() * res.length)].url);
				context.drawImage(fumo1, 0, 0, 400, 400);
				context.drawImage(fumo2, 400, 0, 400, 400);

				await fillTextWithTwemoji(context, msg.member.displayName+"<3",0,350);
				const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'fumo-love.png');
				var dmchannel = await labomem.createDM();
				dmchannel.send(attachment).catch(err => {if (err) console.err(err)});
			  }
		});
	}
};

// const sAndSendBack = async gril => {
// 	console.log("he said:"+gril);
// 	gis(gril, async (err,res) => {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			msg.channel.send(res[Math.floor(Math.random() * (res.length>5 ? 5 : res.length))].url);
// 		  }
// 	});
// }

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
		//const background = await Canvas.loadImage('fumolove.png');
		//context.drawImage(background, 0, 0, canvas.width, canvas.height);
		context.font = applyText(canvas, msg.member.displayName);
		context.fillStyle = msg.member.displayHexColor;
		gis('fumo touhou', async (err,res) => {
			if (err) {
				console.log(err);
			} else {
				const fumo1 = await Canvas.loadImage(res[Math.floor(Math.random() * res.length)].url);
				const fumo2 = await Canvas.loadImage(res[Math.floor(Math.random() * res.length)].url);
				context.drawImage(fumo1, 0, 0, 400, 400);
				context.drawImage(fumo2, 400, 0, 400, 400);

				await fillTextWithTwemoji(context, msg.member.displayName+"<3",0,350);
				const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'fumo-love.png');
				msg.channel.send(res[Math.floor(Math.random() * res.length)].url);
			  }
		});
	}else if (/*msg.author.id=="786279913073541181" &&*/ msg.content.startsWith("Dzisiejszą Touhou dziewczynką jest:")){
		let gril = msg.content.substring(36);
		if (gril.startsWith("**") && gril.endsWith("**")/*msg.author.id=="786279913073541181"*/){
			gril=gril.toLowerCase().substring(2,gril.length-2);
			let gsplit = gril.split(' ');
			gril=gril.replace(" ","_")+" 1girl"
			console.log("searching:"+gril);
			let posts = await booru.posts({
				limit: 1,
				page: 1,
				tags: gril,
				random: true
			});
			if (typeof posts[0] === "undefined"){
				if (gsplit.length==2){
					gril=gsplit[1]+"_"+gsplit[0]+" 1girl";
					console.log("searching:"+gril);
					let posts = await booru.posts({
						limit: 1,
						page: 1,
						tags: gril,
						random: true
					});
					if (typeof posts[0] === "undefined"){
						msg.react("648261196339871765");
					} else {
						msg.channel.send(posts[0].file_url);
					}
				} else {
					msg.react("648261196339871765");
				}
			} else {
				msg.channel.send(posts[0].file_url);
			}
		} else{
			msg.channel.send(posts[0].file_url);
		}
		
	}
});

process.on('SIGINT', () => {die();});
process.on('SIGUSR1', () => {die();});
process.on('SIGUSR2', () => {die();});

client.login('NjU1MzY2NzYzNzYzOTkwNTQx.XfTD3A.dR0001m0u4liTJRn--d0pIqqnDw');
