const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const article = require('./article.json');



// middleware
app.use(cors());
app.use(express.json());


// mongodb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tv3to.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const tourist = client.db("tourismDB");
        const tourismCollection = tourist.collection("spotCollection");

        app.get('/spots', async (req, res) => {
            const cursor = tourismCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tourismCollection.findOne(query);
            res.send(result);
        });

        app.post('/spots', async (req, res) => {
            const data = req.body;
            const result = await tourismCollection.insertOne(data);
            res.send(result);
        });

        app.put('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const gotData = req.body;
            const updatedData = {
                $set: {
                    spotCost: gotData.spotCost,
                    spotCountry: gotData.spotCountry,
                    spotDescription: gotData.spotDescription,
                    spotImage: gotData.spotImage,
                    spotLocation: gotData.spotLocation,
                    spotName: gotData.spotName,
                    spotSeason: gotData.spotSeason,
                    spotTime: gotData.spotTime,
                    spotVisitor: gotData.spotVisitor,
                }
            };
            const result = await tourismCollection.updateOne(filter, updatedData, options);
            res.send(result);
        });


        app.delete('/spots/:id', async (req, res) => {
            const delId = req.params.id;
            const query = { _id: new ObjectId(delId) };
            const result = await tourismCollection.deleteOne(query);
            res.send(result);
        });




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('server running');
});

app.get('/article', (req, res) => {
    res.send(article);
});

app.get('/article/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const serArticle = article.find(got => got.id === id) || {};
    res.send(serArticle);
});



app.listen(port, () => {
    console.log(`assignment-10 server is running on ${port}`);
});
