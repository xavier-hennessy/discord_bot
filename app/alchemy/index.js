import { createAlchemyWeb3 } from "@alch/alchemy-web3";

import {
    ALL_TRANSACTIONS,
    FILTERED_BY_ADDR,
} from "../constants.js"

export default class AlchemyClient {
    constructor(WS_ADDR) {
        this.OWNER_ADDR = [];
        this.web3 = new createAlchemyWeb3(WS_ADDR);
        this.subs = {};
    }

    subscribeToAllTransactions = async (ch) => {
        try {
            this.sub[ALL_TRANSACTIONS] = await this.web3.eth.subscribe(ALL_TRANSACTIONS);
            console.log("subscribing to all transactions");
            this.subs[ALL_TRANSACTIONS].on("data", (data) => {
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
            if (this.subs[ALL_TRANSACTIONS]) {
                this.subs[ALL_TRANSACTIONS].unsubscribe((success, error) => {
                    if (success) {
                        console.log("unsubscribed from all transactions");
                        ch.send("unsubscribed from all transactions");
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
            console.log(`subscribing to ${w.label ? w.label : w.address}`);
            this.subs[w.address] = this.web3.eth.subscribe(FILTERED_BY_ADDR, { address: w.address })
            this.subs[w.address].on("data", (data) => {
                ch.send(`${data.from === w.address ? w.label : data.from} sent ${this.web3.utils.hexToNumberString(data.value)} to ${data.to === w.address ? w.label : data.to}`);
                console.log(`${w.label ? w.label : w.address} :`, {
                    from: data.from,
                    to: data.to,
                    value: data.value
                });
            })
        } catch (error) {
            console.log("error subscribing to filtered transactions");
            console.error(error);
        }
    }

    unsubscribeFromFilteredTransactions = async (ch, w) => {
        console.log(`unsubscribing from ${w.label ? w.label : w.address}`);
        if (this.subs[w.address]) {
            this.subs[w.address].unsubscribe((succ, err) => {
                // it throws an error here but it still unsubscribes
                // why..?
                if (succ) {
                    console.log(succ)
                    ch.send(`unsubscribed from ${w.label ? w.label : w.address}`);
                } else {
                    console.log(err)
                    console.log(`error unsubscribing from ${w.label ? w.label : w.address}`);
                }
            });
        }
    }
}
