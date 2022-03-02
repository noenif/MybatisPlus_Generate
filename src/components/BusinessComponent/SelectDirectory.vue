<template>
  <div id="SelectDirectory"></div>
</template>

<script setup lang="ts">
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
