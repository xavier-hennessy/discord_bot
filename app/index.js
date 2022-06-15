
import {
    DB_URI,
    PREFIX,
    BOT_TOKEN,
    WS_ADDR,
} from "./constants.js";

import AlchemyClient from "./alchemy/index.js";
import DiscordClient from "./discord/index.js";
import DbClient from "./db/index.js";

// TODO:
// add a logger class for cleaner logging o
// figure out how to decode values from transactions properly 
// why does unsubscribe throw that error 
// better way to set up classes? 
// figure out which of the args is an address and handle incorrect inputs better 


export default class App {
    constructor() {
        this.discordClient = new DiscordClient(BOT_TOKEN, PREFIX);
        this.alchemyClient = new AlchemyClient(WS_ADDR);
        this.dbClient = new DbClient(DB_URI);
        this.init();
    }

    init() {
        this.discordClient.init(this.dbClient, this.alchemyClient);
    }
}

new App();