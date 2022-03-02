<template>
  <div id="design">
    <a-row class="buttonGroup">
      <a-button type="primary"><plus-outlined />新增</a-button>
      <a-button></a-button>
    </a-row>
    <table-list :tableProps="tableProps">
      <template #shan="{ text }">
        <span class="shan">
          {{ text }}
        </span>
      </template>
      <template #remark="{ text }">
        <span class="remark">
          {{ text }}
        </span>
      </template>
    </table-list>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined } from "@ant-design/icons-vue";
import TableList from "@/components/Table/table.vue";
import type Column from "node_modules/ant-design-vue/es/table/Column";
import {
  reactive,
  ref,
  defineProps,
  defineEmits,
  defineExpose,
  useSlots,
  useAttrs,
  computed,
} from "vue";

const props = defineProps({});
const emit = defineEmits([]);
const slots = useSlots();
const attrs = useAttrs();
defineExpose({});
let dataSource = ref([]);
let tableProps = computed(() => {
  return {
    columns: [
      {
        title: "字段名",
        dataIndex: "name",
        type: "string",
        key: "name",
        align: "center",
        scopedSlots: { customRender: "name" },
      },
      {
        title: "字段中文名",
        dataIndex: "commentName",
        key: "commentName",
        align: "center",
        type: "string",
        scopedSlots: { customRender: "commentName" },
      },
      {
        title: "类型",
        dataIndex: "type",
        key: "type",
        align: "center",
        type: "string",
        scopedSlots: { customRender: "type" },
      },
      {
        title: "数据库类型",
        dataIndex: "dataType",
        key: "dataType",
        align: "center",
        type: "string",
        scopedSlots: { customRender: "dataType" },
      },
      {
        title: "说明",
        dataIndex: "comment",
        key: "comment",
        align: "center",
        type: "string",
        scopedSlots: { customRender: "comment" },
      },
      {
        title: "主键",
        dataIndex: "primaryKey",
        key: "primaryKey",
        align: "center",
        type: "string",
        scopedSlots: { customRender: "primaryKey" },
      },
      {
        title: "主键自增",
        dataIndex: "autoIncrement",
        key: "autoIncrement",
        align: "center",
        type: "boolean",
        scopedSlots: { customRender: "autoIncrement" },
      },
      {
        title: "非空",
        dataIndex: "notNull",
        key: "notNull",
        align: "center",
        type: "boolean",
        scopedSlots: { customRender: "notNull" },
      },
      {
        title: "默认值",
        dataIndex: "default",
        key: "default",
        align: "center",
        type: "string",
        scopedSlots: { customRender: "default" },
      },
      {
        title: "操作",
        dataIndex: "Operate",
        key: "Operate",
        align: "center",
        scopedSlots: { customRender: "Operate" },
      },
    ],
    dataSource: dataSource.value,
    bordered: true,
    pagination: false,
    align: "center",
  };
});

interface columnTypeColumn extends Column {
  type: string;
}
let generateInitData = (columns: columnTypeColumn[]) => {
  let tempData = {};
  columns
    .filter((item) => item?.type)
    .forEach((item) => {
      if (item.type) {
        if (item.type === "string") {
          tempData[item.key] = null;
        } else if (item.type === "boolean") {
          tempData[item.key] = false;
        }
      }
    });
  return tempData;
};

//新增
// let addData = () => {
//   let tempDat = generateInitData(columns);
//   dataSource.value.push();
// };
</script>

<style lang="scss">
.buttonGroup {
  margin: 10px;
}
</style>
