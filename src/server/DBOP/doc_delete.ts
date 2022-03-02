import { operateCollection } from "@/server/server";
import { Document } from "bson";

// const find = () => {
//   if (operateCollection !== null) {
//     nebulae.find(function (err, items) {
//       items.toArray(function (err, itemArr) {
//         console.log("Before Delete: ");
//         console.log(itemArr);
//         nebulae.remove({ type: "Planetary" }, function (err, results) {
//           console.log("Delete:\n " + results);
//           nebulae.find(function (err, items) {
//             items.toArray(function (err, itemArr) {
//               console.log("After Delete: ");
//               console.log(itemArr);
//               db.close();
//             });
//           });
//         });
//       });
//     });
//   } else {
//     throw new Error("没有选中集合!");
//   }
// };
