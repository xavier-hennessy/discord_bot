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
        try {
            const row = await this.MODEL.findOne({ address: address });
            if (!row) {
                console.log('creating new wallet to follow..')
                const wallet = new this.MODEL({
                    address: address,
                    label: label ? label : null,
                    follow: true,
                });
                await wallet.save();
                return wallet;
            } else if (row.address === address && row.follow === false) {
                console.log('row exists but not following, updating..')
                await this.MODEL.updateOne({ address: address }, { $set: { follow: true } });
                const row = await this.MODEL.findOne({ address: address });
                return row;
            } else {
                console.log(`row for ${address} already exists and is being followed`);
                return row;
            }
        } catch (error) {
            console.log('error following wallet..')
            console.error(error);
        }
    }

    unfollowWallet = async (id) => {
        try {
            console.log('unfollowing wallet..')
            const row = await this.MODEL.findOne({ address: id });
            if (!row) {
                await this.MODEL.updateOne({ label: id }, { $set: { follow: false } });
                return await this.MODEL.findOne({ label: id });
            } else {
                await this.MODEL.updateOne({ address: id }, { $set: { follow: false } });
                return await this.MODEL.findOne({ address: id });
            }
        } catch (error) {
            console.log('error unfollowing wallet..')
            console.error(error);
        }
    }

    removeWallet = async (id) => {
        try {
            console.log('removing wallet..')
            const addr = await this.MODEL.findOne({ address: id });
            if (!addr) {
                const lab = await this.MODEL.findOne({ label: id });
                if (!lab) {
                    console.log(`row for ${id} does not exist`);
                    return id
                } else {
                    return await this.MODEL.deleteOne({ label: id });
                }
            } else {
                return await this.MODEL.deleteOne({ address: id });
            }
        } catch (error) {
            console.log('error removing wallet..')
            console.error(error);
        }
    }

    getAllWallets = async () => {
        try {
            const wallets = await this.MODEL.find({});
            return wallets
        } catch (error) {
            console.log('error getting all wallets..')
            console.error(error);
        }
    }
}

// import { DB_URI } from '../constants.js';

// const db = new DbClinet(DB_URI);

// db.getAllWallets();
