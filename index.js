const { Client, Collection } = require("discord.js");
const discord = require("discord.js");
const config = require("./config.json")
const bot = new Client({disableEveryone: true});
const { GiveawaysManager } = require("discord-giveaways");
const Commando = require('discord.js-commando')
const mongoose = require('./database/mongoose');
const command = require('./command')




const manager = new GiveawaysManager(bot, {
    storage: './giveaways.json',
    updateCountdownEvery: 10000,
    hasGuildMembersIntent: false,
    default: {
        botsCanWin: false,
        exemptPermissions: ['MANAGE_MESSAGES', 'ADMINISTRATOR'],
        embedColor: '#FF0000',
        reaction: '<a:desigiveaway:836295202619785317>'
    }
});



bot.commands = new Collection();
bot.aliases = new Collection();

["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
})

bot.giveawaysManager = new GiveawaysManager(bot, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        exemptPermissions: [ ],
        embedColor: "#4287f5",
        reaction: "<a:desigiveaway:836295202619785317>"
    }
});
bot.on("ready", async () => {
    console.log(`${bot.user.username} is ready for action!`);
    bot.user.setActivity(`Hosting Giveaways!`, {type:'WATCHING'});
    bot.user.setActivity(`desixredbot.tk | $help |  ${bot.guilds.cache.size} servers and ${bot.guilds.cache.size} members. `, {type:'WATCHING'});
    bot.user.setActivity(`${bot.guilds.cache.size} guilds!`, {type:'WATCHING'});
 

});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    var msg = message.content.toLowerCase();
    bot.emit('checkMessage', message);
    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if(cmd.length === 0) return;
    let command = bot.commands.get(cmd);
    if (!command) command = bot.commands.get(bot.aliases.get(cmd));
    
    if (command)
        command.run(bot, message, args)

        module.exports.bot = bot;

});


bot.on('messageDelete', message => {
	console.log(`A message by ${message.author.tag} was deleted, but we don't know by who yet.`);
});

command(bot), '$servers', (message) => {
    client.guilds.cache.forEach((guild) => {
        message.channel.send(
            `${guild.name} has a total of ${guild.memberCount} members.`
        )
    })
    
}

  
mongoose.init();
bot.login (config.token);