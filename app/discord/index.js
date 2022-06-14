import Discord from 'discord.js';

import {
    FOLLOW_WALLET,
    UNFOLLOW_WALLET,
    FOLLOW_ALL,
    GETALLWALLETS,
    REMOVE_WALLET
} from '../constants.js';

export default class DiscordClient {
    constructor(BOT_TOKEN, PREFIX) {
        this.BOT_TOKEN = BOT_TOKEN;
        this.PREFIX = PREFIX;
        this.client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
        this.channel = null;
    }

    init(dbClient, alchemyClient) {
        this.connectToDiscord();
        this.listenForMessages(dbClient, alchemyClient);
    }

    connectToDiscord = async () => {
        try {
            console.log("connnecting to bot...")
            const cxn = await this.client.login(this.BOT_TOKEN);
            console.log("connected! bot_token:", cxn);
        } catch (err) {
            handleError(err);
        }
    }

    listenForMessages = (db, ws) => {
        console.log("listening for messages...")
        this.client.on("messageCreate", async (message) => {
            this.channel = await this.client.channels.fetch(message.channelId);

            if (message.author.bot) return;
            if (!message.content.startsWith(this.PREFIX)) return;

            const commandBody = message.content.slice(this.PREFIX.length);
            const args = commandBody.split(' ');
            const command = args.shift().toLowerCase();

            console.log(command)
            console.log(args)

            // if (args.length < 0) {
            //     message.reply("no agrs. please use !followwallet <address> <label>");
            // }

            switch (command) {
                case FOLLOW_WALLET:
                    message.reply(`ok, following ${args[1] ? args[1] : args[0]}..`)
                    const follow = await db.followWallet({ address: args[0], label: args[1] });
                    ws.subscribeToFilteredTransactions(this.channel, follow);
                    console.log(follow);
                    break
                case UNFOLLOW_WALLET:
                    message.reply(`ok, unfollowing ${args[1] ? args[1] : args[0]}..`);
                    const unfollow = await db.unfollowWallet(args[0]);
                    console.log(unfollow)
                    break
                case REMOVE_WALLET:
                    const remove = await db.removeWallet(args[0]);
                    ws.unsubscribeFromAllTransactions();
                    if (remove !== args[0]) {
                        message.reply(`ok, removed ${args[1] ? args[1] : args[0]} delete count: ${remove.deletedCount}`);
                    } else {
                        message.reply(`wallet ${args[0]} does not exist..`);
                    }
                    console.log(remove)
                    break
                case GETALLWALLETS:
                    const wallets = await db.getAllWallets()
                    message.reply(`ok, found ${wallets.length} wallets..`);
                    wallets.forEach((w) => {
                        message.reply(`address: ${w.address}, label: ${w.label ? w.label : ''}, following: ${w.follow}`);
                    })

                    break
                case FOLLOW_ALL:
                    message.reply(`ok, following all transactions...`);
                    ws.subscribeToAllTransactions(this.channel)
                    break
                case REMOVE_ALL:
                    message.reply(`ok, following all transactions...`);
                    console.log("in here")
                    ws.unsubscribeToAllTransactions(this.channel)
                    break
                default:
                    break
            }
        });
    }
}

// new DiscordClient();
