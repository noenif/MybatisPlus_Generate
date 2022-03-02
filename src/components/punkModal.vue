<template>
  <a-modal
    v-model:visible="visible"
    title="任务完成"
    @ok="props.handleOK"
    okText="确认"
    cancelText="取消"
  >
    <slot />
  </a-modal>
</template>

<script setup>
import {
  reactive,
  ref,
  defineProps,
  defineEmits,
  defineExpose,
  useSlots,
  useAttrs,
  watch,
} from "vue";
import _default from "ant-design-vue/es/color-picker";
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: Boolean,
  handleOK: () => {
    // emit("update:modelValue", value.value, Props.index);
  },
});
let visible = ref(false);
watch([() => props.modelValue], () => {
  visible.value = props.modelValue;
});
watch([() => visible.value], () => {
  emit("update:modelValue", visible.value);
});
const slots = useSlots();
const attrs = useAttrs();
defineExpose({});
</script>

<style scoped></style>
