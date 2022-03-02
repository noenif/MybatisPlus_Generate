<template>
  <Modal
    v-bind="modelProps"
    v-model:visibleFlag="visibleFlag"
    id="generateSQLTable"
    :bodyStyle="{ 'overflow-y': 'scroll', height: '640px' }"
  >
    <formComponent
      ref="formRef"
      :formData="formData"
      :schemas="schemas"
      v-bind="{ ...formCustom }"
      :componentCustom="componentCustom"
    ></formComponent>
  </Modal>

  <p @click="visibleFlag = true"><appstore-outlined />Mybatis 生成表</p>
</template>

<script setup lang="ts">
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons-vue";
import Modal from "@/components/Model/Modal.vue";
import formComponent from "@/components/Form";
import {
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  reactive,
  ref,
  useAttrs,
  useSlots,
  watch,
} from "vue";
import { sendNode } from "@/utils/PathUtil";
import { generateALLTable, generateSQL } from "@/utils/navUtils";

const props = defineProps({});
const emit = defineEmits([]);
const slots = useSlots();
const attrs = useAttrs();
defineExpose({});
const formRef = ref();
type FormItem = {
  mapperPath?: string;
};
let formData = ref<FormItem>({
  host: "localhost",
  user: "root",
  password: "941314",
  entityName: "domain",
  daoLayer: "mapper",
  isServiceImpl: false,
  serviceSeparate: true,
  mappers: false,
});
let visibleFlag = ref(false);

let modelProps = ref({
  title: "项目持久层配置",
  visibleFlag,
  formData,
  handleConfirm: async () => {
    let data = formData.value;
    formRef.value.$refs.elForm
      .validate()
      .then((res) => {
        if (formData.value.type === "single") {
          generateSQL(data).then((res) => {
            if (res === null || res === "null") {
              //创建新的配置
            } else {
              //读取配置
            }
          });
        } else {
          generateALLTable(data).then((res) => {
            if (res === null || res === "null") {
              //创建新的配置
            } else {
              //读取配置
            }
          });
        }
      })
      .catch((e) => {
        console.log(`e:`, e);
      });
  },
});

let generateDir = () => {
  let packagePath = formData.value.packagePath
    ? formData.value.packagePath
    : "";
  let path = formData.value.outputDir ? formData.value.outputDir : "";
  formData.value.entityDir =
    path +
    "\\src\\main\\java\\" +
    packagePath.replaceAll(".", "\\") +
    `\\${formData.value.entityName}`;
  formData.value.mapperDir = path + "\\src\\main\\resources" + "\\mapper";
  formData.value.daoDir =
    path +
    "\\src\\main\\java\\" +
    packagePath.replaceAll(".", "\\") +
    `\\${formData.value.daoLayer}`;
  formData.value.serviceDir =
    path +
    "\\src\\main\\java\\" +
    packagePath.replaceAll(".", "\\") +
    "\\service";
};
let formCustom = ref({
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
});
let componentCustom = ref({
  ButtonProps: {
    display: false,
    rowProps: {
      type: "flex",
      justify: "center",
    },
    ButtonGroupProps: {
      confirm: {
        name: "查询",
        type: "primary",
        style: {
          width: "120px",
        },
        display: true,
        buttonMethod: (type, other, e) => {},
      },
    },
  },
});

watch(
  [
    () => formData.value.packagePath,
    () => formData.value.outputDir,
    () => formData.value.daoLayer,
    () => formData.value.entityName,
  ],
  () => {
    generateDir();
  }
);

let condition = computed(() => formData.value.type === "single");

let schemas = ref([
  {
    prop: "type",
    label: "选择生成项目的表",
    propType: "string",
    component: "a-radio-group",
    colProps: {
      span: 22,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {
      placeholder: "请选择实体目录名称",
      options: ["single", "all"],
    },
    componentMethods: {},
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "entityName",
    label: "实体目录名称",
    propType: "string",
    component: "a-radio-group",
    colProps: {
      span: 22,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {
      placeholder: "请选择实体目录名称",
      options: ["entity", "domain", "pojo"],
      defaultValue: "entity",
    },
    componentMethods: {},
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "daoLayer",
    label: "数据库操作层",
    propType: "string",
    component: "a-radio-group",
    colProps: {
      span: 22,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {
      placeholder: "请选择实体目录名称",
      options: ["mapper", "dao"],
      defaultValue: "mapper",
    },
    componentMethods: {},
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "serviceSeparate",
    label: "服务层接口和实现分离",
    propType: "boolean",
    component: "a-checkbox",
    colProps: {
      span: 10,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {
      placeholder: "请选择实体目录名称",
    },
    labelCol: { span: 20 },
    wrapperCol: { span: 4 },
    componentMethods: {},
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "isServiceImpl",
    label: "服务层是否有单独的实现文件夹",
    propType: "boolean",
    component: "a-checkbox",
    colProps: {
      span: 14,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {
      placeholder: "请选择实体目录名称",
    },
    componentMethods: {},
    labelCol: { span: 20 },
    wrapperCol: { span: 4 },
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "mappers",
    label: "是否需要集成通用Mapper",
    propType: "boolean",
    component: "a-checkbox",
    colProps: {
      span: 12,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {
      placeholder: "请选择是否需要集成通用Mapper",
    },
    labelCol: { span: 20 },
    wrapperCol: { span: 4 },
    componentMethods: {},
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "SQLPath",
    label: "SQL路径",
    propType: "string",
    component: "a-input-search",
    existCondition: condition,
    colProps: {
      span: 22,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {
      placeholder: "请选择SQL路径",
      enterButton: "选择文件",
    },
    componentMethods: {
      search: (e: Event) => {
        sendNode("getPath", "PathListener", {
          filters: [{ name: "Mysql", extensions: ["sql"] }],
        }).then((res) => {
          formData.value.SQLPath = res.filePaths[0];
        });
      },
    },
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "outputDir",
    label: "文件输出总路径",
    propType: "string",
    component: "a-input-search",
    colProps: {
      span: 22,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {
      placeholder: "请选择文件输出路径",
      enterButton: "选择目录",
    },
    componentMethods: {
      search: (e: Event) => {
        sendNode("getPackagePath", "PathListener", {
          properties: ["openDirectory"],
        }).then((res) => {
          formData.value.outputDir = res.projectPath;
          formData.value.packagePath = res.packagePath;
          generateDir();
        });
      },
    },
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "packagePath",
    label: "包路径",
    propType: "string",
    component: "a-input",
    colProps: {
      span: 22,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {
      disabled: true,
      placeholder: "请输入包路径",
    },
    componentMethods: {},
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "daoDir",
    label: "Dao文件输出目录",
    propType: "string",
    component: "a-input-search",
    colProps: {
      span: 22,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {
      placeholder: "请选择文件输出路径",
      enterButton: "选择目录",
    },
    componentMethods: {
      search: (e: Event) => {
        sendNode("getPath", "PathListener", {
          properties: ["openDirectory"],
        }).then((res) => {
          console.log(`res:`, res);
          formData.value.daoDir = res.filePaths[0];
        });
      },
    },
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "mapperDir",
    label: "mapper文件输出路径",
    propType: "string",
    component: "a-input-search",
    colProps: {
      span: 22,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {
      placeholder: "请选择mapper文件输出路径",
      enterButton: "选择目录",
    },
    componentMethods: {
      search: (e: Event) => {
        sendNode("getPath", "PathListener", {
          properties: ["openDirectory"],
        }).then((res) => {
          console.log(`res:`, res);
          formData.value.mapperDir = res.filePaths[0];
        });
      },
    },
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "entityDir",
    label: "entity文件输出路径",
    propType: "string",
    component: "a-input-search",
    colProps: {
      span: 22,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {
      placeholder: "请选择文件输出路径",
      enterButton: "选择目录",
    },
    componentMethods: {
      search: (e: Event) => {
        sendNode("getPath", "PathListener", {
          properties: ["openDirectory"],
        }).then((res) => {
          console.log(`res:`, res);
          formData.value.entityDir = res.filePaths[0];
        });
      },
    },
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "serviceDir",
    label: "service文件输出路径",
    propType: "string",
    component: "a-input-search",
    colProps: {
      span: 22,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {
      placeholder: "请选择文件路径",
      enterButton: "选择目录",
    },
    componentMethods: {
      search: (e: Event) => {
        sendNode("getPath", "PathListener", {
          properties: ["openDirectory"],
        }).then((res) => {
          console.log(`res:`, res);
          formData.value.serviceDir = res.filePaths[0];
        });
      },
    },
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "host",
    label: "主机",
    propType: "string",
    component: "a-input",
    colProps: {
      span: 22,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {},
    componentMethods: {},
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "user",
    label: "数据库用户",
    propType: "string",
    component: "a-input",
    colProps: {
      span: 22,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {},
    componentMethods: {},
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "password",
    label: "数据库密码",
    propType: "string",
    component: "a-input",
    colProps: {
      span: 22,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {},
    componentMethods: {},
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
  {
    prop: "database",
    label: "数据库",
    propType: "string",
    component: "a-input",
    colProps: {
      span: 22,
    },
    rules: [{ required: true, message: "请输入字段" }],
    componentProps: {},
    componentMethods: {},
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
]);
</script>

<style lang="scss"></style>
