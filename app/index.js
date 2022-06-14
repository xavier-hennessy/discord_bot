
import {
    DB_URI,
    PREFIX,
    BOT_TOKEN,
    WS_ADDR,
} from "./constants.js";

import AlchemyClient from "./alchemy/index.js";
import DiscordClient from "./discord/index.js";
import DbClient from "./db/index.js";

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