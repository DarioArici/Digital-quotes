const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./../serviceAccount.json");
const routes = express.Router();

 admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
 });

const db = admin.firestore();

//ID Generator

const quotes = [];


async function updateQuotes() {
    quotes.length = 0;
    const list = await db.collection('quotes').get();
    list.forEach(doc => quotes.push(doc.data()));
}


//PATCH 

routes.patch("/quotes/:id", async (req, res) => {

    try {
        //aggiorno la lista

        if(!req.body.quote && !req.body.author) {
            return res.status(400).json({message: "You have to pass a author or/and a quote"});
        }

        const q = await db.collection('quotes').doc(req.params.id).get();

        if(!q.data()){
            return res.status(404).json({message: "Quote not found"});
            
        }

        if(req.body.author && req.body.quote){
            db.collection('quotes').doc(req.params.id).set({author: req.body.author, quote: req.body.quote}, {merge: true});
            return res.json({massage: "Updated"});    

        }
        
        if(req.body.author) {
        db.collection('quotes').doc(req.params.id).set({author: req.body.author}, {merge: true});
        return res.json({massage: "Updated"});
        }

        if(req.body.quote) {
        db.collection('quotes').doc(req.params.id).set({quote: req.body.quote}, {merge: true});
        return res.json({massage: "Updated"});
        }

        // errore
        const quote = quotes.find(val => val.id === Number(req.params.id));
        quote.author = req.body.author;
        return res.json({massage: "Updated"});
    } 
    catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = routes;