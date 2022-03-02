import { findObject, findCollection } from "@/server/DBOP/doc_find.ts";
import { addObject } from "@/server/DBOP/doc_add";

const DBOP = { findObject, findCollection, addObject };
export default DBOP;
