<template>
  <div id="Home"></div>
</template>

<script setup lang="ts">
import generateSQLTable from "@/components/BusinessComponent/generateSQLTable.vue";
import {
  reactive,
  ref,
  defineProps,
  defineEmits,
  defineExpose,
  useSlots,
  useAttrs,
} from "vue";

const props = defineProps({});
const emit = defineEmits([]);
const slots = useSlots();
const attrs = useAttrs();
defineExpose({});
</script>

<style lang="scss"></style>
