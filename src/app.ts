const express = require('express');
const app = express.app();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("OVER");
})

app.listen(port, (err, res) => {
    console.log(`Listening on port: ${port}`);
})