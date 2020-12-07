const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require('./routes');

app.use(bodyParser.json());
app.use(routes);


app.get("/",(req,res) => {
    return res.json({message:"go to /quotes"});
});


app.listen(3000, () => {
    console.log("go to http://localhost:3000");
});
