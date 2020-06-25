const express = require("express");
const router = new express.Router()

const { MongoClient,ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'Assignment-Indegene'
var authorsCollection,bookCollection

 MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(databaseName);
        authorsCollection = database.collection('authors');
        bookCollection = database.collection('books');
        console.log("Connected to `" + databaseName + "`!");
    });


router.get('/task1_getAuthorByAwardCount/:count', (req,res) => {
  authorsCollection.aggregate([{
      $project: {
         name: 1,
         numberOfAwards: { $cond: { if: { $isArray: "$awards" }, then: { $size: "$awards" }, else: "NA"} }
      }
   },
   {$match: {numberOfAwards: {$gte: parseInt(req.params.count)}}}
  ]).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});


router.get('/task2_getAuthorByYearAwardRecieived/:year', (req,res) => {
  authorsCollection.find(
   { awards: { $elemMatch: { year: { $gte: parseInt(req.params.year) } } } }
    ).toArray((error, result) => {
        if(error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

router.get('/task3_getProfit', (req,res) => {
  	bookCollection.aggregate([{
      $group : { 
          "_id" : "$AuthorName",
          "totalBookSold": { $sum: "$NoOfBookSold" },
          "totalProfit" : { 
              $sum : { 
                  $multiply : ["$price", '$NoOfBookSold']
              }
          }
      }
  }]).toArray((error, result) => {
          if(error) {
              return res.status(500).send(error);
          }
          res.send(result);
      });
});


router.get('/task4_authorByDOB/:dob/:totalbookPrice', (req,res) => {
      collection.aggregate([
    
     { $group: { _id: "$AuthorName", "totalBookPrice" :{"$sum" : "$price"} } },
     {$project: {$and : [{$gte: req.params.dob},{$gte: parseInt(req.params.totalbookPrice)}]}}
     
  ]).toArray()
    .then(items => {
      console.log(`Successfully found ${items.length} documents.`)

    })
    .catch(err => console.error(`Failed to find documents: ${err}`))
    res.send(items)
})



module.exports = router


