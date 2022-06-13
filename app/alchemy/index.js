import { createAlchemyWeb3 } from "@alch/alchemy-web3";

import {
    WS_ADDR,
    OWNER_ADDR
} from "../constants"

const web3 = createAlchemyWeb3(
    WS_ADDR
);


// make subscribe function with good error handling that will returns the client 
// do the same for the unsubscribe function

web3.eth.subscribe("alchemy_filteredNewFullPendingTransactions", { "address": OWNER_ADDR }).on("data", (data) => console.log(data));
