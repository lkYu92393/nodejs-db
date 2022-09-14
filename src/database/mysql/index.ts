import mysql from "mysql";

const conn = mysql.createConnection({
    host: "localhost",
    user: "user",
    password: "password"
});