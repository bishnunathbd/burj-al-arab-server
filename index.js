const express = require('express')
const app = express()
const port = 5000


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://<username>:<password>@cluster0.wbtxn.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("dbname").collection("bookings");
  console.log('db connected successfully...');
  client.close();
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)