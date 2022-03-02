<template>
  <span class="text">{{ value }}</span>
</template>

<script>
export default {
  name: "ASpan",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  components: {
    TextStyle() {},
  },
};
</script>

<style scoped>
.text {
  color: #40a9ff;
}
</style>
