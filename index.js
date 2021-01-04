const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
const port = 5000

app.use(cors())
app.use(bodyParser.json())


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://<username>:<password>@cluster0.wbtxn.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookings = client.db("dbname").collection("bookings");
  
  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    bookings.insertOne(newBooking)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/bookings', (req, res) => {
    console.log(req.headers.authorization);
    bookings.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)