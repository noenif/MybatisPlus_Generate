import type { OpenDialogOptions } from "electron";
const fs = require("fs");
const { dialog } = require("electron");

const getPath = (options: OpenDialogOptions) => {
  return dialog.showOpenDialog(options).then((res) => {
    return res;
  });
};

const getPackagePath = (options: OpenDialogOptions) => {
  return dialog.showOpenDialog(options).then((res) => {
    const dir = res.filePaths[0];
    return {
      packagePath: packageTree(dir).join("."),
      projectPath: dir,
    };
  });
};

const packageTree = (path: string) => {
  const judgeDirPath = (path: string) => {
    const readFileSync = fs.readdirSync(path, { encoding: "utf-8" });
    return readFileSync.includes("src");
  };
  if (judgeDirPath(path)) {
    path += "/src/main/java";
    const packagePath: string[] = [];
    const readLayer = (nwePath: string): string[] => {
      const readFileSync = fs.readdirSync(nwePath, { encoding: "utf-8" });
      if (
        readFileSync.length > 1 ||
        (readFileSync.length === 1 && readFileSync[0].includes(".java"))
      ) {
        return packagePath;
      } else {
        packagePath.push(readFileSync[0]);
        const newPath: string = nwePath + "/" + readFileSync[0];
        return readLayer(newPath);
      }
    };
    return readLayer(path);
  } else {
    throw "请选择正确的目录!或者在该目录下创建一个src 文件夹";
  }
};
export default { getPath, getPackagePath };
