const fs = require("fs");
const path = require("path");

const Result = (result: boolean, msg: string) => { return { RESULT: result, MSG: msg }};
const GetData = (tableName: string, field: string) => new Promise((resolve, reject) => {
        fs.readFile(`./src/database/${tableName}.json`, "utf-8", (fsErr: any, data: any) => {
            if (fsErr) {
                reject("Error opening the file.");
            }
            if (!data) {
                reject("Blank data.");
            } else {
                try {
                    let result = JSON.parse(data)[field];
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            }
        })
    });
const GetColumns = (tableName: string) => GetData(tableName, "columns");
const GetAllData = (tableName: string) => GetData(tableName, "data");

const CreateNewTable = (tableName: string, columns: string[]) => {
    return new Promise((resolve, reject) => {
        const inputData = {
            columns: columns,
            data: []
        };
        const inputDataString = JSON.stringify(inputData);
        try {
            fs.access(`./src/database/${tableName}.json`, (fsErr: any) => {
                if (fsErr) {
                    if (fsErr.message.indexOf("no such") > -1) {
                        fs.writeFile(`./src/database/${tableName}.json`, new Uint8Array(Buffer.from(inputDataString)), (fsErr: any, data: any) => {
                            if (fsErr) {
                                reject("Error creating table.");
                            }
                            resolve("OK");
                        })
                    } else {
                        reject(fsErr.message);
                    }
                } else {
                    reject("Table already exists.");
                }
            });            
        } catch (e) {
            reject("Table already exists.");
        }
    })
}

const AddDataToTable = (tableName: string, columns: string[], data: string[]) => {
    return new Promise(async (resolve, reject) => {
        if (columns.length != Object.keys(data).length) {
            reject("Data length is not matching to column length.")
        }
        const currentData = <Object[]>await GetAllData(tableName);
        const newData: {[key: string]: string} = {};
        columns.forEach((col, index) => {
            newData[col] = data[index];
        })
        currentData.push(newData);
        const inputData = {
            columns: columns,
            data: currentData,
        }
        const inputDataString = JSON.stringify(inputData);
        try {
            fs.access(`./src/database/${tableName}.json`, (fsErr: any) => {
                if (fsErr) {
                        reject(fsErr.message);
                } else {
                    fs.writeFile(`./src/database/${tableName}.json`, new Uint8Array(Buffer.from(inputDataString)), (fsErr: any, data: any) => {
                        if (fsErr) {
                            reject("Error creating table.");
                        }
                        resolve("OK");
                    })
                }
            });            
        } catch (e) {
            reject("Table already exists.");
        }
    })
}

const TestFunc = async () => {
    let data = JSON.parse("{}");
    console.log(1);
    // GetAllData("test").then(data => console.log(data));
    // try {
    //     data = await GetAllData("test");
    // } catch (e) {
    //     data = JSON.parse("{}");
    //     console.log(e);
    // }
    // console.log(2);
    // GetAllData("test").then(data => {console.log(data)}).catch(e => console.log(e));
    // console.log(3);
    // CreateNewTable("newTable", ["col1", "col2"]).then(i => console.log(i));
    // AddDataToTable("newTable", ["col1", "col2"], ["test1", "test2"]);
}


TestFunc();