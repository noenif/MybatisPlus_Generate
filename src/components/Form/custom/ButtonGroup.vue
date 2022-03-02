<template>
  <a-row v-bind="rowProps">
    <single-button
      :formData="formData"
      v-for="(buttonItem, index) in buttonProps"
      :buttonItemProps="buttonItem"
      :key="index"
    >
    </single-button>
  </a-row>
</template>

<script>
import singleButton from "@/components/Form/custom/singleButton";
export default {
  name: "ButtonGroup",
  props: {
    buttonProps: {
      type: Object,
      default: () => {},
    },
    rowProps: {
      type: Object,
      default: () => {},
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    singleButton,
  },
  data() {
    return {};
  },
};
</script>

<style>
.singleButton {
  margin-right: 10px;
}
</style>
