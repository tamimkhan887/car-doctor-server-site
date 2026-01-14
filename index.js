const express = require('express')
const app = express()
var cors = require('cors')
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.json());
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.Db_user}:${process.env.Db_pass}@cluster0.drvlk6y.mongodb.net/?appName=Cluster0`;

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
        // Send a ping to confirm a successful connection
        const serviceCollection = client.db("carDoctor").collection("services");
        const bookingCollection = client.db("carDoctor").collection("booking");
        app.get("/services", async(req,res)=>{
            const result = await serviceCollection.find().toArray();
            res.send(result);
        } )
        app.post("/services", async(req,res)=>{
            const service = req.body
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        } )
        app.get("/services/:id" , async(req,res)=>{
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await serviceCollection.findOne(query)
            res.send(result);
        })
        app.post("/booking" , async(req , res)=>{
            const book = req.body ;
            const result = await bookingCollection.insertOne(book)
            res.send(result)
        })
        app.get("/booking" , async(req , res)=>{
            const result = await bookingCollection.find().toArray();
            res.send(result)
        })
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Car Doctor Server Site')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
