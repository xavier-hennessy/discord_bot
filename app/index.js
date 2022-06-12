const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = "mongodb+srv://admin:mongo123@discord-bot-test.03khadw.mongodb.net/?retryWrites=true&w=majority";

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const client = new MongoClient(uri,
    {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     console.log(collection);
//     // perform actions on the collection object
//     client.close();
// });

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