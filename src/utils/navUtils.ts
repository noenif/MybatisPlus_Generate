import { sendNode } from "@/utils/PathUtil";

const selectPath = () => {};

const generateSQL = (formData: any = {}) => {
  return new Promise((resolve, reject) => {
    sendNode("generateSQL", "generateSQLResult", { ...formData }).then(
      (res) => {
        resolve(res);
      }
    );
  });
};

const generateALLTable = (formData: any = {}) => {
  return new Promise((resolve, reject) => {
    sendNode("generateALLTable", "generateSQLResult", { ...formData }).then(
      (res) => {
        resolve(res);
      }
    );
  });
};

const generateMybatisPlusSQL = (formData: any = {}) => {
  return new Promise((resolve, reject) => {
    sendNode("generateMybatisPlusSQL", "generateMybatisPlusSQLResult", {
      ...formData,
    }).then((res) => {
      resolve(res);
    });
  });
};

const generateMybatisPlusALLTable = (formData: any = {}) => {
  return new Promise((resolve, reject) => {
    sendNode("generateMybatisPlusALLTable", "generateMybatisPlusSQLResult", {
      ...formData,
    }).then((res) => {
      resolve(res);
    });
  });
};

const handleConfig = (flag: string, formData: any = {}) => {
  if (flag === "Project") {
    return new Promise((resolve, reject) => {
      sendNode("getProject", "ProjectListener", { ...formData }).then((res) => {
        resolve(res);
      });
    });
  }
};

export {
  selectPath,
  handleConfig,
  generateSQL,
  generateALLTable,
  generateMybatisPlusSQL,
  generateMybatisPlusALLTable,
};
