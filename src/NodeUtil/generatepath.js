let fs = require("fs");
let generatePath =
  "C:\\Users\\86158\\Documents\\project\\RuoYi-Vue\\ruoyi-generator";

const packageTree = (path) => {
  let judgeDirPath = (path) => {
    const readFileSync = fs.readdirSync(path, { encoding: "utf-8" });
    return readFileSync.includes("src");
  };
  if (judgeDirPath(path)) {
    path += "/src/main/java";
    const packagePath = [];
    const readLayer = (nwePath) => {
      const readFileSync = fs.readdirSync(nwePath, { encoding: "utf-8" });
      if (readFileSync.length > 1) {
        return packagePath;
      } else {
        packagePath.push(readFileSync[0]);
        const newPath = nwePath + "/" + readFileSync[0];
        return readLayer(newPath);
      }
    };
    return readLayer(path);
  } else {
    throw "请选择正确的目录!或者在该目录下创建一个src 文件夹";
  }
};

let packageRef = packageTree(generatePath);
console.log(`packageRef:`, packageRef.join("\\"));
