<template>
  <a-table v-bind="tableProps" :pagination="pagination">
    <template
      #[column.scopedSlots.customRender]="text, scope, index"
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
  </a-table>
</template>
<script>
export default {
  name: "TableList",
  props: {
    tableProps: {
      type: Object,
      default: () => {},
    },
  },
  created() {},
  computed: {
    pagination() {
      return this.tableProps?.pagination
        ? {
            total: this.total,
            current: this.current,
            showSizeChanger: true,
            size: this.size,
            onShowSizeChange: (current, pageSize) =>
              this.handlePageChange(current, pageSize),
            onChange: (page, pageSize) => this.handlePageChange(page, pageSize),
          }
        : false;
    },
    columnRender() {
      return this.tableProps.columns.filter(
        (item) => item.scopedSlots?.customRender
      );
    },
    total() {
      return this.tableProps?.total || 0;
    },
    current() {
      return this.tableProps?.params?.page || 1;
    },
    size() {
      return this.tableProps?.params?.limit?.toString() || "10";
    },
  },
  data() {
    return {};
  },
  methods: {
    handlePageChange(page, pageSize) {
      this.tableProps.params.page = page;
      this.tableProps.params.limit = Number(pageSize);
    },
  },
  mounted() {},
};
</script>
