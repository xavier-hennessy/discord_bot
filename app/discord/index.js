import Discord from 'discord.js';

import DbClinet from '../db/index.js';
import AlchemyClient from '../alchemy/index.js';

import {
    BOT_TOKEN,
    PREFIX,
    FOLLOW_WALLET,
    UNFOLLOW_WALLET,
    DB_URI,
    GETALLWALLETS,
    WS_ADDR,
    REMOVE_WALLET
} from '../constants.js';

export class DiscordClient {
    constructor() {
        this.BOT_TOKEN = BOT_TOKEN;
        this.PREFIX = PREFIX;
        this.client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
        console.log("wsaddr", WS_ADDR);
        this.dbClient = new DbClinet(DB_URI);
        this.AlchemyClient = new AlchemyClient(WS_ADDR);
        this.connectToDiscord();
        this.listenForMessages(this.dbClient, this.AlchemyClient);
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

    listenForMessages = (db, ws) => {
        console.log("listening for messages...")
        this.client.on("messageCreate", async (message) => {
            if (message.author.bot) return;
            if (!message.content.startsWith(PREFIX)) return;

            const commandBody = message.content.slice(PREFIX.length);
            const args = commandBody.split(' ');
            const command = args.shift().toLowerCase();

            switch (command) {
                case FOLLOW_WALLET:
                    message.reply(`ok, following ${args[1] ? args[1] : args[0]}..`)
                    const follow = await db.followWallet({ address: args[0], label: args[1] });
                    console.log(follow);
                    break
                case UNFOLLOW_WALLET:
                    message.reply(`ok, unfollowing ${args[1] ? args[1] : args[0]}..`);
                    const unfollow = await db.unfollowWallet(args[0]);
                    console.log(unfollow)
                    break
                case REMOVE_WALLET:
                    const remove = await db.removeWallet(args[0]);
                    if (remove !== args[0]) {
                        message.reply(`ok, removed ${args[1] ? args[1] : args[0]} delete count: ${remove.deletedCount}`);
                    } else {
                        message.reply(`wallet ${args[0]} does not exist..`);
                    }
                    console.log(remove)
                    break
                case GETALLWALLETS:
                    message.reply(`ok, getting all wallets..`);
                    const wallets = await db.getAllWallets()
                    ws.subscribeToFilteredTransactions(wallets.filter(w => w.follow === ture));
                    wallets.forEach((w) => {
                        message.reply(`address: ${w.address}, label: ${w.label ? w.label : ''}, following: ${w.follow}`);
                    })
                // console.log("wallets: ", wallets)
                default:
                    break
            }
        });
    }
}

new DiscordClient();
