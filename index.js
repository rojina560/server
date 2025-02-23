require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5002;

// middleware 
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cdbyl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();
  
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const roomsCollection = client.db('NothBengalHotel').collection('rooms')
    // const productCollection = client.db('NothBengalHotel').collection('count')

    app.get('/rooms',async(req,res)=>{
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log('pagination',page,size);
        const cursor = roomsCollection.find()
        .skip(page * size)
        .limit(size)
        const result = await cursor.toArray()
        res.send(result) 
    })
    app.get('/rooms/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await roomsCollection.findOne(query)
      res.send(result)
    })
    app.get('/roomsCount',async(req,res)=>{
      const count = await roomsCollection.estimatedDocumentCount()
      res.send({count}) 
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('hotel north bengal is running')
})
app.listen(port,() =>{
    console.log(`port is running ${port}`);
})