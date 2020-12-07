const admin = require("firebase-admin");
const serviceAccount = require("../ServiceAccount.json");
const express= require("express");

const router= express.Router();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

router.get("/quotes/:id", async (req,res) => {
    try{
        const quote= await db.collection('quotes').doc(req.params.id).get();
        if(!quote){
            return res.status(404).json({message:"user not found"});
        }
        return res.status(200).json(quote.data());
    }catch(error){
        return res.status(500).send(error);
    }
});

module.exports = router;