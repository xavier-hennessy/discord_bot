require('dotenv').config()

export const DB_URI = process.env.DB_URI
export const BOT_TOKEN = process.env.BOT_TOKEN
export const WS_ADDR = process.env.WS_ADDR
export const PREFIX = "!";
export const FOLLOW_WALLET = "followwallet";
export const UNFOLLOW_WALLET = "unfollowwallet";
export const GETALLWALLETS = "getall";
export const REMOVE_WALLET = "remove";
export const FOLLOW_ALL = "followall";
export const FILTERED_BY_ADDR = "alchemy_filteredNewFullPendingTransactions";
export const ALL_TRANSACTIONS = "alchemy_newFullPendingTransactions";