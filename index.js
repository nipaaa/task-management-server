const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { runMain } = require('module');
const app = express()
const port = process.env.PORT || 5000


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svakv.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

try{
    await client.connect();
   const taskCollection = client.db('google-task').collection('task');

   app.get('/task' , async(req, res) => {
    const query = {};
    const cursor = taskCollection.find(query);
    const item = await cursor.toArray();
    res.send(item);
});

app.get('/task/:id' , async(req, res) => {
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const item = await taskCollection.findOne(query);
    res.send(item);
});

    //POST
    app.post('/task', async(req, res) => {
      const task = req.body;
      const addedItem = task;
      const result = await taskCollection.insertOne(addedItem);
      res.send(result);
  });

  //DELETE
  app.delete('/task/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await taskCollection.deleteOne(query);
      res.send(result);
  })
}

finally{

}
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello google task!')
})

app.listen(port, () => {
  console.log(`google task app listening on port ${port}`)
})