import { operateCollection } from "@/server/server";
import { Document } from "bson";
const addObject = (data: Document) => {
  return new Promise((resolve, reject) => {
    if (operateCollection !== null) {
      operateCollection.insertOne(data, {}, function (err, result) {
        if (!err) {
          resolve(result);
        }
        reject(err);
      });
    } else {
      reject("没有选中集合!");
    }
  });
};

export { addObject };
