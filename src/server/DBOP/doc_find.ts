import { Document } from "bson";
import { operateCollection } from "@/server/server";

const findCollection = (data: Document) => {
  return new Promise((resolve, reject) => {
    if (operateCollection !== null) {
      operateCollection.find(data).toArray((err, result) => {
        resolve(result);
      });
    } else {
      reject("没有选中集合!");
    }
  });
};
const findObject = (data: Document) => {
  if (operateCollection !== null) {
    operateCollection.findOne({ type: "planetary" }, function (err, item) {
      console.log("Found One: ");
      console.log(item);
    });
  } else {
    throw new Error("没有选中集合!");
  }
};

export { findObject, findCollection };
