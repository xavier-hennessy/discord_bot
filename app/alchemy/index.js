// alchemy-token-api/alchemy-web3-script.js
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

// Replace with your Alchemy api key:
const apiKey = "WC8EPbmzP0As2c3pZPRj1KkqQnkSbZV_";

const websocketAddr = "wss://eth-mainnet.alchemyapi.io/v2/WC8EPbmzP0As2c3pZPRj1KkqQnkSbZV_";

// Initialize an alchemy-web3 instance:
const web3 = createAlchemyWeb3(
    websocketAddr
);

const ownerAddr = "0x40a729e6C3240BBbedF8Aa72F0955Fe6F6618be4";

// web3.eth.subscribe("alchemy_newFullPendingTransactions").on("data", (data) => console.log(data));

web3.eth.subscribe("alchemy_filteredNewFullPendingTransactions", { "address": ownerAddr }).on("data", (data) => console.log(data));


// // The wallet address / token we want to query for:
// const balances = await web3.alchemy.getTokenBalances(ownerAddr, ["0x607f4c5bb672230e8672085532f7e901544a7375"])

// // The token address we want to query for metadata:
// const metadata = await web3.alchemy.getTokenMetadata("0x607f4c5bb672230e8672085532f7e901544a7375")

// console.log("BALANCES->");
// console.log(balances);
// console.log("TOKEN METADATA->");
// console.log(metadata);
