import fsExtra from "fs-extra";
import moment from "moment";
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

const generateMybatisPlusSQL = async (data: conDataType) => {
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
    const createTableSql = fs.readFileSync(SQLPath, { encoding: "utf-8" });
    con.query(createTableSql, function (err: any, result: any) {
      if (err) {
        // eslint-disable-next-line no-empty
        if (err.toString().includes("already exists")) {
        } else {
          throw err;
        }
      }
      const tableName = _.camelCase(readTableName(createTableSql));
      const descTable = `desc ${tableName};`;
      con.query(descTable, function (err: any, result: any) {
        if (err) throw err;
        generateJavaType(result, tableName, Paths);
      });
    });
  });
};

//生成不同的文件
const generateJavaType = (result: any, tableName: string, Paths: any) => {
  console.log(`开始生成mybatisPlus 单文件!`);

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
    generateController({ result, tableName, ...Paths });
    generateService({ result, tableName, ...Paths });
    fs.writeFileSync(Paths.outputDir + "/config.js", JSON.stringify(Paths));
  } else {
    console.log(`result:`, result);
  }
};

//读取表名
const readTableName = (createTableQuery: string) => {
  const createStatement = createTableQuery.split("\n").find((item) => {
    return item.toLocaleLowerCase().includes("create table");
  });
  if (createStatement) {
    const split = createStatement.replace("\r", "").split(" ");
    return split[split.length - 1];
  } else {
    throw "没有表名";
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
  const upperFirstTableName = _.upperFirst(tableName);
  let pojo = `package ${packagePath}.${entityName};

import java.util.Date;

public class ${upperFirstTableName} {

`;
  const variableArray: string[] = [];
  const getArray: string[] = [];
  const setArray: string[] = [];
  result.forEach((item: any) => {
    const b1 = Object.keys(DataBaseJAVAType).find((key) => {
      return item.Type.includes(key.toLocaleLowerCase());
    });
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
  const upperFirstTableName = _.upperFirst(tableName);
  const mapper = `package ${packagePath}.${daoLayer};

  
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import ${packagePath}.${entityName}.${upperFirstTableName};

public interface ${upperFirstTableName}${_.upperFirst(
    daoLayer
  )} extends BaseMapper<${upperFirstTableName}> {
}
`;

  writeData(daoDir, tableName, daoLayer, "java", mapper);
};

// 生成mapper 层
const generateMapper = ({ result, tableName, packagePath, mapperDir }) => {
  const upperFirstTableName = _.upperFirst(tableName);
  const mapper = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="${packagePath}.mapper.${upperFirstTableName}Mapper">

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
  const upperFirstTableName = _.upperFirst(tableName);
  const serviceImpl = `package ${packagePath}.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import ${packagePath}.${entityName}.${upperFirstTableName};
import  ${packagePath}.${daoLayer}.${upperFirstTableName}${_.upperFirst(
    daoLayer
  )};
import ${packagePath}.service.${upperFirstTableName}Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;




@Service
public class ${_.upperFirst(
    tableName
  )}ServiceImpl extends ServiceImpl<${upperFirstTableName}Mapper, ${upperFirstTableName}>  implements ${upperFirstTableName}Service {

    private static final Logger LOG = LoggerFactory.getLogger(${upperFirstTableName}Service.class);

    @Autowired
    private ${upperFirstTableName}${_.upperFirst(
    daoLayer
  )} ${tableName}${_.upperFirst(daoLayer)};
     
    @Autowired
    private ${upperFirstTableName}Service  ${tableName}service;

}
`;
  const serviceInterface = `package ${packagePath}.service;
import com.baomidou.mybatisplus.extension.service.IService;
import ${packagePath}.${entityName}.${upperFirstTableName};
import java.util.List;


public interface ${_.upperFirst(
    tableName
  )}Service extends  IService<${upperFirstTableName}>{
  
}
`;

  writeData(serviceDir, tableName, "Service", "java", serviceInterface);
  writeData(
    serviceDir + "\\impl",
    tableName,
    "ServiceImpl",
    "java",
    serviceImpl
  );
};

//生成controller层
const generateController = ({
  result,
  tableName,
  packagePath,
  controllerDir,
  entityName,
}) => {
  const upperFirstTableName = _.upperFirst(tableName);
  const controller = `package ${packagePath}.controller;

/**
 * ${upperFirstTableName}Controller
 *
 * @author 勇敢的心
 * @since ${moment().format("YYYY-MM-DD HH:mm:ss")}
 */
import ${packagePath}.${entityName}.${upperFirstTableName};
import ${packagePath}.service.${upperFirstTableName}Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;


@RestController
@Slf4j
@Payload
public class ${upperFirstTableName}Controller extends BaseController<${upperFirstTableName}Service,${upperFirstTableName}> {

}
`;
  writeData(controllerDir, tableName, "controller", "java", controller);
};

const writeData = (path, tableName, layer, extend, data) => {
  const upperFirstTableName = _.upperFirst(tableName);
  fsExtra.outputFile(
    path + `/${upperFirstTableName}${_.upperFirst(layer)}.${extend}`,
    data
  );
  console.log(
    `生成文件 : `,
    path + `/${upperFirstTableName}${_.upperFirst(layer)}.${extend}`
  );
};
export { generateMybatisPlusSQL };
