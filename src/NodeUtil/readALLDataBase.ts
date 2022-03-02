import fsExtra from "fs-extra";
import { DataBaseJAVAType } from "@/NodeUtil/mysqlType";

const fs = require("fs");
const _ = require("lodash");
const mysql = require("mysql");
const path = require("path");

type connectType = {
  host: string;
  user: string;
  password: string;
  database: string;
};

type conDataType = {
  host: string;
  user: string;
  password: string;
  database: string;
  SQLPath: string;
  outputDir: string;
  [key: string]: string;
};

const readALLDataBase = async (data: conDataType) => {
  const { host, user, password, database, ...Paths } = data;
  const conData = {
    host,
    user,
    password,
    database,
  };
  operateMysql(conData, data.SQLPath, Paths);
};

const operateMysql = (conData: connectType, SQLPath: string, Paths: any) => {
  const con = mysql.createConnection(conData);
  con.connect(function (err: any) {
    if (err) {
      if (
        err.includes(
          "Client does not support authentication protocol requested by server"
        )
      ) {
        throw "清晰修改Mysql8.0密码等级";
      } else {
        throw err;
      }
    }
    const getAllTable = `select table_name from information_schema.tables where table_schema='${conData.database}' and table_type='BASE TABLE';`;
    con.query(getAllTable, function (err: any, result: any) {
      if (err) throw err;
      result.forEach((item) => {
        const tableName = item.TABLE_NAME;
        const descTable = `desc ${tableName};`;
        con.query(descTable, function (tableeErr: any, tableFields: any) {
          if (tableeErr) throw tableeErr;
          generateJavaType(tableFields, tableName, Paths);
        });
      });
    });
  });
};

//生成不同的文件
const generateJavaType = (result: any, tableName: string, Paths: any) => {
  //检测是否可以生成
  const every = result.every((item: any) => {
    return Object.keys(DataBaseJAVAType).some((key) => {
      return item.Type.includes(key.toLocaleLowerCase());
    });
  });
  if (every) {
    // 生成pojo
    generatePojo({ result, tableName, ...Paths });
    generateDAO({ result, tableName, ...Paths });
    generateMapper({ result, tableName, ...Paths });
    generateService({ result, tableName, ...Paths });
    fs.writeFileSync(Paths.outputDir + "/config.js", JSON.stringify(Paths));
  }
};
//读取包路径

//生成pojo
const generatePojo = ({
  result,
  tableName,
  entityDir,
  packagePath,
  entityName,
}) => {
  let pojo = `package ${packagePath}.${entityName};

public class ${_.upperFirst(tableName)} {

`;
  const variableArray: string[] = [];
  const getArray: string[] = [];
  const setArray: string[] = [];
  result.forEach((item: any) => {
    const b1 = Object.keys(DataBaseJAVAType).find((key) => {
      return item.Type.includes(key.toLocaleLowerCase());
    });
    // console.log(`item:`, item);
    const type = DataBaseJAVAType[b1];
    const Field = _.camelCase(item.Field);
    variableArray.push(`   private ${type} ${Field};`);
    getArray.push(
      `   public ${type} get${_.upperFirst(Field)}() {
        return ${Field};
    }`
    );
    setArray.push(
      `   public void set${_.upperFirst(Field)}(${type} ${Field}) {
        this.${Field} = ${Field};
    }`
    );
  });

  const content = {
    variableArray,
    getArray,
    setArray,
  };
  pojo +=
    Object.values(content)
      .flatMap((item) => item)
      .join("\n\n") + `\n}`;
  writeData(entityDir, tableName, "", "java", pojo);
};

//生成 dao层
const generateDAO = ({
  result,
  tableName,
  packagePath,
  daoDir,
  daoLayer,
  entityName,
  mappers,
}) => {
  const mapper = `package ${packagePath}.${daoLayer};

import ${packagePath}.${entityName}.${_.upperFirst(tableName)};
${
  mappers
    ? `import ${packagePath}.my.${daoLayer}.${_.upperFirst(daoLayer)};`
    : ""
}

public interface ${_.upperFirst(tableName)}${_.upperFirst(daoLayer)} ${
    mappers ? ` extends My${daoLayer}<${_.upperFirst(tableName)}>` : ""
  } {
}
`;

  writeData(daoDir, tableName, daoLayer, "java", mapper);
};

// 生成mapper 层
const generateMapper = ({ result, tableName, packagePath, mapperDir }) => {
  const mapper = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="${packagePath}.mapper.${_.upperFirst(tableName)}Mapper">

</mapper>
`;
  writeData(mapperDir, tableName, "Mapper", "xml", mapper);
};

// 生成service 层
const generateService = ({
  result,
  tableName,
  packagePath,
  serviceDir,
  isServiceImpl,
  serviceSeparate,
  entityName,
  daoLayer,
  mappers,
}) => {
  const serviceImpl = `${
    isServiceImpl
      ? `package ${packagePath}.service.impl;`
      : `package ${packagePath}.service;`
  }
  
import ${packagePath}.${entityName}.${_.upperFirst(tableName)};
import  ${packagePath}.${daoLayer}.${_.upperFirst(tableName)}${_.upperFirst(
    daoLayer
  )};
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;




@Service
public class ${_.upperFirst(tableName)}ServiceImpl implements ${_.upperFirst(
    tableName
  )}Service {

    private static final Logger LOG = LoggerFactory.getLogger(${_.upperFirst(
      tableName
    )}Service.class);

    @Resource
    private ${_.upperFirst(tableName)}${_.upperFirst(
    daoLayer
  )} ${tableName}${_.upperFirst(daoLayer)};

}
`;
  const serviceInterface = `package ${packagePath}.service;

import ${packagePath}.${entityName}.${_.upperFirst(tableName)};
import java.util.List;


public interface ${_.upperFirst(tableName)}Service {
  
}
`;
  //服务层接口和实现分离
  if (isServiceImpl) {
    writeData(serviceDir, tableName, "Service", "java", serviceInterface);
    writeData(
      serviceDir + "\\impl",
      tableName,
      "ServiceImpl",
      "java",
      serviceImpl
    );
  } else {
    //服务层是否有单独的实现文件夹
    if (serviceSeparate) {
      writeData(serviceDir, tableName, "Service", "java", serviceInterface);
      writeData(serviceDir, tableName, "ServiceImpl", "java", serviceImpl);
    } else {
      writeData(serviceDir, tableName, "Service", "java", serviceImpl);
    }
  }
};

const writeData = (path, tableName, layer, extend, data) => {
  const fileName = `${_.upperFirst(tableName)}${_.upperFirst(layer)}.${extend}`;
  console.log(`生成了文件!${fileName}`);

  fsExtra.outputFile(path + "/" + fileName, data);
};
export { readALLDataBase };
