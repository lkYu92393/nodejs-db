import express from 'express';
import router from "../src/controllers/authController";
import bodyParser from "body-parser";

const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", router);

app.get("/", (req, res) => {
    res.send("OVER");
})

app.listen(port, (req, res) => {
    console.log(`Listening on port: ${port}`);
})