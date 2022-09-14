import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const Result = (result: boolean, msg: string) => { return { RESULT: result, MSG: msg }};
const GetData = (tableName: string, field: string) => new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/${tableName}.json`, "utf-8", (fsErr: any, data: any) => {
            if (fsErr) {
                if (fsErr.code === "ENOENT") {
                    reject("No such database.");
                } else {
                    reject("Error opening the file.");
                }
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

export const GetColumns = (tableName: string) => <Promise<string[]>>GetData(tableName, "columns");
export const GetAllData = (tableName: string) => <Promise<Object[]>>GetData(tableName, "data");
export const CreateNewTable = (tableName: string, columns: string[]) => {
    return new Promise<string>((resolve, reject) => {
        const inputData = {
            columns: columns,
            data: []
        };
        const inputDataString = JSON.stringify(inputData);
        try {
            fs.access(`${__dirname}/${tableName}.json`, (fsErr: any) => {
                if (fsErr) {
                    if (fsErr.message.indexOf("no such") > -1) {
                        fs.writeFile(`${__dirname}/${tableName}.json`, new Uint8Array(Buffer.from(inputDataString)), (fsErr: any) => {
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
export const AddDataToTable = (tableName: string, data: string[]) => {
    return new Promise(async (resolve, reject) => {
        const columns: string[] = await GetColumns(tableName);
        if (columns.length != Object.keys(data).length) {
            reject("Data length is not matching to column length.")
        }
        const currentData: Object[] = await GetAllData(tableName);
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
            fs.access(`${__dirname}/${tableName}.json`, (fsErr: any) => {
                if (fsErr) {
                        reject(fsErr.message);
                } else {
                    fs.writeFile(`${__dirname}/${tableName}.json`, new Uint8Array(Buffer.from(inputDataString)), (fsErr: any) => {
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