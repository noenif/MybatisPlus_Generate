<template>
  <a-button
    class="singleButton"
    v-if="isExist"
    :type="buttonItemProps.type ? buttonItemProps.type : 'default'"
    @click="
      buttonItemProps.buttonMethod
        ? buttonItemProps.buttonMethod(buttonItemProps, other, $event)
        : null
    "
  >
    {{ buttonItemProps.name ? buttonItemProps.name : null }}
  </a-button>
</template>

<script>
export default {
  name: "SingleButton",
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    buttonItemProps: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  methods: {},
  computed: {
    isExist() {
      return JSON.stringify(this.buttonItemProps) !== "{}";
    },
    other() {
      return { formData: this.formData };
    },
  },
};
</script>

<style scoped></style>
