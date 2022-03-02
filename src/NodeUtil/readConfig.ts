const fs = require("fs");
type params = {
  ProjectPath?: string;
};

const readConfig = ({ ProjectPath }: params) => {
  console.log(`ProjectPath:`, ProjectPath);

  const readdirSync = fs.readdirSync(ProjectPath, { encoding: "utf-8" });
  console.log(`readdirSync:`, readdirSync);

  return new Promise((resolve, reject) => {
    if (readdirSync.includes("projectConfig")) {
      const projectConfig = fs.readFileSync(ProjectPath + "/projectConfig.js", {
        encoding: "utf-8",
      });
      resolve(projectConfig);
    } else {
      resolve(null);
    }
  });
};
export { readConfig };
