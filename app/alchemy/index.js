import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { TeamMemberMembershipState, ThreadAutoArchiveDuration } from "discord-api-types/v10";

import DbClinet from '../db/index.js';

import {
    OWNER_ADDR,
    ALL_TRANSACTIONS,
    FILTERED_BY_ADDR,
} from "../constants.js"

export default class AlchemyClient {
    constructor(WS_ADDR) {
        this.OWNER_ADDR = [];
        // this.web3 = this.connectToAlchemy(WS_ADDR);
        this.web3 = new createAlchemyWeb3(WS_ADDR);
        this.sub = null;
    }

    connectToAlchemy = async (WS_ADDR) => {
        try {
            console.log("connecting to alchemy...")
            const web3 = new createAlchemyWeb3(WS_ADDR);
            console.log(web3._provider.ws.url, "connected!");
            return web3;
        } catch (error) {
            console.error(error);
        }
    }

    subscribeToAllTransactions = async (ch) => {
        try {
            this.sub === null ? this.sub = await this.web3.eth.subscribe(ALL_TRANSACTIONS) : this.sub;
            console.log("subscribing to all transactions");
            this.sub.on("data", (data) => {
                // console.log(`${data.from} sent ${data.value} to ${data.from}`);
                ch.send(`${data.from} sent ${data.value} to ${data.from}`);
            })
        } catch (error) {
            console.log("error subscribing to all transactions");
            console.error(error);
        }
    }

    unsubscribeFromAllTransactions = async (ch) => {
        try {
            console.log("unsubscribing from all transactions");
            console.log(this.sub);
            if (this.sub) {
                this.sub.unsubscribe((success, error) => {
                    if (success) {
                        console.log("unsubscribed from all transactions");
                    } else {
                        console.log("error unsubscribing from all transactions");
                        console.error(error);
                    }
                });
            } else {
                console.log("no subscription to unsubscribe from");
            }
        } catch (error) {
            console.log("error unsubscribing from all transactions");
            console.error(error);
        }
    }

    subscribeToFilteredTransactions = async (ch, w) => {
        try {
            console.log("subscribing to filtered transactions");
            this.web3.eth.subscribe(FILTERED_BY_ADDR, { address: w.address })
                .on("data", (data) => {
                    ch.send(`${data.from === w.address ? w.label : data.from} sent ${data.value} to ${data.to === w.address ? w.label : data.to}`);
                    console.log(`${w.label ? w.label : w.address} :`, data);
                })
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
