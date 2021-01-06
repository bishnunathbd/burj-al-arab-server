const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express()
const port = 5000

app.use(cors())
app.use(bodyParser.json())


var serviceAccount = require("./configs/burj-al-arab-ph-firebase-adminsdk-xp49v-2fc3b80988.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});



const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://<username>:<password>@cluster0.wbtxn.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookings = client.db("<dbname>").collection("bookings");

  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    bookings.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/bookings', (req, res) => {
    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith('Bearer ')) {
      const idToken = bearer.split(' ')[1]
      console.log({ idToken });
      admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
          // const uid = decodedToken.uid;
          const tokenEmail = decodedToken.email;
          const queryEmail = req.query.email;
          console.log(tokenEmail, queryEmail);
          if (tokenEmail === queryEmail) {
            bookings.find({ email: queryEmail })
            .toArray((err, documents) => {
              res.send(documents);
            })
          }
        })
        .catch((error) => {
          // Handle error
        });
    }


  })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)