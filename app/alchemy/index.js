import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { ThreadAutoArchiveDuration } from "discord-api-types/v10";

import DbClinet from '../db/index.js';

import {
    OWNER_ADDR,
    FILTERED_BY_OWNER,
    ALL_TRANSACTIONS,
} from "../constants.js"

export default class AlchemyClient {
    constructor(WS_ADDR) {
        this.OWNER_ADDR = [];
        this.web3 = createAlchemyWeb3(WS_ADDR);
        // this.subscribeToAllTransactions();
        // this.subscribeToFilteredTransactions()
    }

    subscribeToAllTransactions = async () => {
        try {
            console.log("subscribing to all transactions");
            this.web3.eth.subscribe(ALL_TRANSACTIONS)
                .on("data", (data) => {
                    console.log(data);
                })
        } catch (error) {
            console.log("error subscribing to all transactions");
            console.error(error);
        }
    }

    subscribeToFilteredTransactions = async (wallets) => {
        try {
            console.log("wallets: ", wallets)
            // console.log("subscribing to filtered transactions");
            // this.web3.eth.subscribe(FILTERED_BY_OWNER, { owner: this.OWNER_ADDR })
            //     .on("data", (data) => {
            //         console.log(data);
            //     })
        } catch (error) {
            console.log("error subscribing to filtered transactions");
            console.error(error);
        }
    }
}

// make subscribe function with good error handling that will returns the client 
// do the same for the unsubscribe function

// web3.eth.subscribe(TRANSACTION_FLTRD_BY_OWNER, { "address": OWNER_ADDR }).on("data", (data) => console.log(data));


const sample = {
    blockHash: null,
    blockNumber: null,
    from: '0xd3401c07b8fe1bc11dfe943dd36a0b56a5f7839b',
    gas: '0xc350',
    gasPrice: '0x306dc4200',
    hash: '0xa074feb3bfe3dacded1cf3cca66aa05082ce5d0085a236b00ca385b614d68143',
    input: '0x',
    nonce: '0x1',
    to: '0xa4e5961b58dbe487639929643dcb1dc3848daf5e',
    transactionIndex: null,
    value: '0x41aebcf09b800',
    type: '0x0',
    v: '0x26',
    r: '0xb4db38b62afc1d2c668ba070c53e0734612ac90df96744187271f454ca5ff929',
    s: '0x49fcb81646d3667cbb3420eb07f0ff135d72c19bb4c43747d5a719b722cef8a6'
}
