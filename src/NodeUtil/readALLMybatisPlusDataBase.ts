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

const readALLMybatisPlusDataBase = async (data: conDataType) => {
  const { host, user, password, database, ...Paths } = data;
  const conData = {
    host,
    user,
    password,
    database,
  };
  console.log(`data:`, data);

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
      console.log(`所有表名:`, result);

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
    const singleFlag = Object.keys(DataBaseJAVAType).some((key) => {
      return item.Type.includes(key.toLocaleLowerCase());
    });
    if (!singleFlag) console.log(`不符合的类型,请添加:`, item.Type);

    return singleFlag;
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
public class ${upperFirstTableName}Controller {

    @Autowired
    private ${upperFirstTableName}Service   ${tableName}service;

    private static final Logger log = LoggerFactory.getLogger(${upperFirstTableName}Controller.class);
    


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

export { readALLMybatisPlusDataBase };
