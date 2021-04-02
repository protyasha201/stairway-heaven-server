const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.ywip5.mongodb.net/stairwayHeaven?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("stairwayHeaven").collection("products");
  const ordersCollection = client.db("stairwayHeaven").collection("orders");

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    productsCollection.insertOne(newProduct)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.post('/addOrders', (req, res) => {
    const orderedProduct = req.body;
    ordersCollection.insertOne(orderedProduct)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/product/:id', (req, res) => {
    productsCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  app.get('/orders', (req, res) => {
    ordersCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.delete('/delete/:id', (req,res) => {
    productsCollection.deleteOne({_id: ObjectID(req.params.id)})
    .then(result => {
      // console.log(result);
    })
  })

  console.log("connected to database")
  // client.close();
});

app.listen(port)