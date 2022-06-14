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
        this.web3 = new createAlchemyWeb3(WS_ADDR);
        this.sub = null;
    }

    subscribeToAllTransactions = async (ch) => {
        try {
            this.sub === null ? this.sub = await this.web3.eth.subscribe(ALL_TRANSACTIONS) : this.sub;
            console.log("subscribing to all transactions");
            this.sub.on("data", (data) => {
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
                    ch.send(`${data.from === w.address ? w.label : data.from} sent ${this.web3.utils.hexToUtf8(data.value)} to ${data.to === w.address ? w.label : data.to}`);
                    console.log(`${w.label ? w.label : w.address} :`, data);
                })
        } catch (error) {
            console.log("error subscribing to filtered transactions");
            console.error(error);
        }
    }
}
