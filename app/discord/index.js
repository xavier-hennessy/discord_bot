// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v10');
import Discord from 'discord.js';

const BOT_TOKEN = "OTg1NjgxNjg0ODYxMTgxOTgy.GCa0ak.QjYisQs9rLb9875sAtZI3GSQe57d7UZtUvxg60";
const PUBLIC_KEY = "943fe053059dfdfa89623de1660480bc74a59ec48d5ba08ada46251ea5de10a3"

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const prefix = "!";

client.on("messageCreate", function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
    }

    else if (command === "sum") {
        const numArgs = args.map(x => parseFloat(x));
        const sum = numArgs.reduce((counter, x) => counter += x);
        message.reply(`The sum of all the arguments you provided is ${sum}!`);
    }
});


client.login(BOT_TOKEN);


// const commands = [
//     {
//         name: 'ping',
//         description: 'Replies with Pong!',
//     },
// ];

// const rest = new REST({ version: '10' }).setToken('token');

// (async () => {
//     try {
//         console.log('Started refreshing application (/) commands.');

//         await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });

//         console.log('Successfully reloaded application (/) commands.');
//     } catch (error) {
//         console.error(error);
//     }
// })();