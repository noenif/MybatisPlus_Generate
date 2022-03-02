<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal">
    <a-menu-item key="mail" @click="visibleFlag = true">
      <template #icon>
        <FolderOpenOutlined />
      </template>
      选择项目
    </a-menu-item>
    <a-menu-item key="mybatis">
      <!--      mybatis表生成-->
      <generateSQLTable> </generateSQLTable>
    </a-menu-item>
    <a-menu-item key="mybatisPlus">
      <!--      mybatis表生成-->
      <mybatisPlus> </mybatisPlus>
    </a-menu-item>
    <a-menu-item key="design" @click.prevent="router.push({ path: '/design' })">
      数据库设计
      <template #icon>
        <EditOutlined />
      </template>
    </a-menu-item>
  </a-menu>
  <Modal v-bind="modelProps" v-model:visibleFlag="visibleFlag">
    <form-component
      ref="form"
      :formData="formData"
      :schemas="schemas"
      v-bind="{ ...formCustom }"
      :componentCustom="componentCustom"
    ></form-component>
  </Modal>
</template>
<script lang="ts" setup>
import { defineExpose, ref } from "vue";
import designDataBase from "@/views/designDataBase/designDataBase.vue";
import mybatisPlus from "@/components/BusinessComponent/mybatisPlus.vue";
import generateSQLTable from "@/components/BusinessComponent/generateSQLTable.vue";
import formComponent from "@/components/Form/index.vue";
import Modal from "@/components/Model/Modal.vue";
import { useRouter } from "vue-router";
let router = useRouter();
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  EditOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons-vue";

import { sendNode } from "@/utils/PathUtil";
import { handleConfig } from "@/utils/navUtils";

let visibleFlag = ref(false);
let item = ref("");
defineExpose({});
type FormItem = {
  [key: string]: string;
};

let formData = ref<FormItem>({});
let modelProps = ref({
  title: "选择项目文件",
  visibleFlag,
  item,
  formData,
  handleConfirm: async () => {
    handleConfig(item.value, formData.value).then((res) => {
      if (res === null || res === "null") {
        //创建新的配置
      } else {
        //读取配置
      }
    });
  },
});

const current = ref<string[]>([]);

let formCustom = ref({
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
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
let schemas = ref([
  {
    prop: "ProjectPath",
    label: "项目路径",
    propType: "string",
    component: "a-input-search",
    colProps: {
      span: 22,
    },
    componentProps: {
      placeholder: "请选择选择项目",
      enterButton: "选择目录",
    },
    componentMethods: {
      search: (e: Event) => {
        sendNode("getPath", "PathListener", ["openDirectory"]).then((res) => {
          console.log(`res:`, res);
          formData.value.ProjectPath = res.filePaths[0];
          item.value = "Project";
        });
      },
    },
    icon: {
      name: "suffixIcon",
      type: "smile",
    },
  },
]);
</script>
