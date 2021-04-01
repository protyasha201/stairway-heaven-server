const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('bson');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://stairwayShop:StairwayHeaven201@cluster0.ywip5.mongodb.net/stairwayHeaven?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("stairwayHeaven").collection("products");

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    productsCollection.insertOne(newProduct)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })
  app.get('/products', (req,res) => {
    productsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/product/:id', (req,res) => {
    productsCollection.find({_id: ObjectID(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
    // client.close();
});


app.listen(port)