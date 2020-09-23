const Discord = require('discord.js');
const bot = new Discord.Client();
const { MessageEmbed } = require("discord.js");

const token = 'ENTER YOUR OWN TOKEN';

const PREFIX = '!';

const usedCommandRecently = new Set();

var servers = {};

const ytdl = require("ytdl-core");

bot.on('ready', () => {
    console.log('This bot is online!');
    bot.user.setActivity('Eating tacos', {type: 'Playing'}).catch(console.error);
})

// Userinfo

bot.on('message', message => {
    let msg = message.content.toUpperCase();
    const prefix = '!'; 
 
    if (message.author.bot) return; 
    if (message.channel.type === 'dm') return; 
 
 
    //Userinfo command
    if (msg.startsWith(prefix + 'WHOIS')) {
        let memberToFind = message.mentions.members.first(); 
 
        if (!memberToFind) { 
            return message.channel.send('You must mention a member for this command'); 
        }
 
        let embed = new Discord.RichEmbed()
            .setAuthor(memberToFind.user.tag, memberToFind.user.avatarURL) 
            .addField('Account Created', memberToFind.user.createdAt, true) 
            .addField('Joined this Server', message.guild.members.find('id', memberToFind.id).joinedAt, true)
            .addField('User ID', memberToFind.id, true) 
            .setColor(0xffffff) 
            .setFooter('Searched User') 
            .setTimestamp() 
 
        message.channel.send(embed); 
    }
});

// kick

bot.on('message', message=> {
    
    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'kick':
            if(!args[1]) message.channel.send('You need to specify a person!')

            const user = message.mentions.users.first();

            if(user) {
                const member = message.guild.member(user);

                if(member){
                    member.kick('You were kicked from this server').then(() => {
                        message.reply(`Sucessfully kicked ${user.tag}`);
                    }).catch(err =>{
                        message.reply('Unable to kick the member');
                        console.log(err);
                    });
                } else{
                    message.reply("That user isnt\'t in this server")
                }
            } else {
                message.reply('that user isn\'t in the guild')
            }
        break;
    }


});

// ban

bot.on('message', message=> {
    
    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'ban':
            if(!args[1]) message.channel.send('You need to specify a person!')

            const user = message.mentions.users.first();

            if(user) {
                const member = message.guild.member(user);

                if(member){
                    member.ban('You were banned from this server').then(() => {
                        message.reply(`Sucessfully banned ${user.tag}`);
                    }).catch(err =>{
                        message.reply('Unable to ban the member');
                        console.log(err);
                    });
                } else{
                    message.reply("That user isnt\'t in this server")
                }
            } else {
                message.reply('that user isn\'t in the guild')
            }
        break;
    }


});

bot.on('message', message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'play':

            function play(connection, message){
                var server = servers[message.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }
                });

            }
        
        
        
            if(!args[1]){
                message.channel.send("You need to provide a link!");
                return;
            }

            if(!message.member.voiceChannel){
                message.channel.send("You must be in a voice channel!");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
                play(connection, message);
            })




        break;

        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            message.channel.send("Skipping the song")
        break;

        case 'stop':
            var server = servers[message.guild.id];
            if(message.guild.voiceConnection){
                for(var i = server.queue.length -1; i >=0; i--){
                    server.queue.splice(i, 1);
                }

                server.dispatcher.end()
                console.log('stopped the queue')
            }

            if(message.guild.connection) message.guild.voiceConnection();
        break;

    }




});

bot.login(token);