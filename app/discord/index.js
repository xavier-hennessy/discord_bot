import Discord from 'discord.js';

import DbClinet from '../db/index.js';

import {
    BOT_TOKEN,
    PREFIX,
    FOLLOW_WALLET,
    UNFOLLOW_WALLET,
    DB_URI,
    GETALLWALLETS
} from '../constants.js';

export class DiscordClient {
    constructor() {
        this.BOT_TOKEN = BOT_TOKEN;
        this.PREFIX = PREFIX;
        this.client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
        this.dbClient = new DbClinet(DB_URI);
        this.connectToDiscord();
        this.listenForMessages(this.dbClient);
    }

    connectToDiscord = async () => {
        try {
            console.log("connectig to bot...")
            const cxn = await this.client.login(this.BOT_TOKEN);
            console.log("connected! bot_token:", cxn);
        } catch (error) {
            handleError(error);
        }
    }

    listenForMessages = async (db) => {
        console.log("listening for messages...")
        this.client.on("messageCreate", function (message) {
            if (message.author.bot) return;
            if (!message.content.startsWith(PREFIX)) return;

            const commandBody = message.content.slice(PREFIX.length);
            const args = commandBody.split(' ');
            const command = args.shift().toLowerCase();

            switch (command) {
                case FOLLOW_WALLET:
                    message.reply(`ok, following ${args[1] ? args[1] : args[0]}..`)
                    db.followWallet({ address: args[0], label: args[1] });
                    break
                case UNFOLLOW_WALLET:
                    message.reply(`ok, unfollowing ${args[1] ? args[1] : args[0]}..`);
                    db.unfollowWallet({ address: args[0] });
                    break
                case GETALLWALLETS:
                    message.reply(`ok, getting all wallets..`);
                    db.getAllWallets()
                default:
                    break
            }
        });
    }
}

new DiscordClient();
