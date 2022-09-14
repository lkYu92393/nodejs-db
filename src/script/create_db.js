import { Console } from "console";
import { GetColumns, GetAllData, CreateNewTable, AddDataToTable } from "../database";

CreateNewTable("user", ["email", "name", "password", "createdAt"]).then(() => {
    AddDataToTable("user", ["testUser1@email.com", "nameUser1", "testPW", new Date().valueOf]);
})
.catch((err) => {
    if (err == "Table already exists.") {
        AddDataToTable("user", ["testUser1@email.com", "nameUser1", "testPW", new Date().valueOf]);
    } else {
        Console.log("Table not exists.")
    }
});
