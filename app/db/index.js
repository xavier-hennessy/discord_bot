import mongoose from 'mongoose';
const { Schema } = mongoose;

export default class DbClinet {
    constructor(DB_URI) {
        this.DB_URI = DB_URI;
        this.SCHEMA = new Schema({
            address: String,
            label: String,
            follow: Boolean,
        });
        this.MODEL = mongoose.model('Wallet', this.SCHEMA);
        this.connectToDb(DB_URI)
    }

    connectToDb = async (DB_URI) => {
        try {
            const cxn = await mongoose.connect(DB_URI);
            console.log("connect to db! connection has opened:", cxn.connections[0]._hasOpened);
        } catch (error) {
            handleError(error);
        }
    }

    followWallet = async ({ address, label }) => {
        const row = await this.MODEL.findOne({ address: address });
        if (!row) {
            console.log('creating new wallet to follow..')
            const wallet = new Wallet({
                address: address,
                label: label ? label : null,
                follow: true,
            });
            await wallet.save();
            console.log(wallet)
        } else if (row.address === address && row.follow === false) {
            console.log('row exists but not following, updating..')
            await this.MODEL.updateOne({ address: address }, { $set: { follow: true } });
            const row = await this.MODEL.findOne({ address: address });
            console.log(row);
        } else {
            console.log(`row for ${address} already exists and is being followed`);
        }
    }

    unfollowWallet = async (address) => {
        console.log('unfollowing wallet..')
        await this.MODEL.updateOne({ address: address }, { $set: { follow: false } });
        const row = await this.MODEL.findOne({ address: address });
        console.log(row)
    }

    getAllWallets = async () => {
        const wallets = await this.MODEL.find({});
        console.log(wallets)
    }
}

// import { DB_URI } from '../constants.js';

// const db = new DbClinet(DB_URI);

// db.getAllWallets();
