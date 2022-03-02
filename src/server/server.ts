import { Collection } from "mongodb";
import DBOP from "@/server/DBOP/index.ts";

const { MongoClient } = require("mongodb");
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
let operateCollection: Collection | null = null;
// Database Name
const dbName = "punch";

async function connectDataBase() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  operateCollection = db.collection("clock");

  // the following code examples can be pasted here...

  return operateCollection;
}

const operate = async (res: string) => {
  const { searchString, operateName } = res;
  return await DBOP[operateName](searchString);
};

export { operateCollection, connectDataBase, operate };
