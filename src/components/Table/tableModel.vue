<template>
  <a-modal
    v-model="modelProps.visible"
    v-bind="{ ...modelProps }"
    centered
    @ok="() => (modelProps.visible = false)"
  >
    <a-row>
      <table-list :tableProps="tableModelProps" class="tablelist">
        <template
          #[column.scopedSlots.customRender]="{ text, scope, index }"
          v-for="(column, index) in columnRender"
          :key="index"
        >
          <slot
            :name="column.scopedSlots.customRender"
            :text="text"
            :scope="scope"
            :index="index"
          />
        </template>
      </table-list>
    </a-row>
  </a-modal>
</template>
<script>
import TableList from "@/components/aSelfComponent/Table/table.vue";
export default {
  name: "TableModel",
  components: {
    TableList,
  },
  props: {
    tableModelProps: {
      type: Object,
      default: () => {},
    },
    modelProps: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    columnRender() {
      return this.tableModelProps.columns.filter(
        (item) => item.scopedSlots?.customRender
      );
    },
  },
  data() {
    return {
      slots: {},
    };
  },
  mounted() {
    this.slots = this.$slots;
  },
};
</script>
