import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://admin:mongo123@discord-bot-test.03khadw.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri,
    {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

async function run() {
    try {
        await client.connect();

        const cxn = await client.db("discord-bot-test").command({ ping: 1 });

        console.log(cxn);
        console.log("Connected successfully to server");

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);