<template>
  <a-modal
    width="800px"
    :title="attrs.title || '请取名'"
    v-model:visible="visible"
    ok-text="确认"
    cancel-text="取消"
    @ok="handleConfirm"
    @cancel="hideModal"
  >
    <slot></slot>
  </a-modal>
</template>
<script lang="ts" setup>
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import {
  ref,
  createVNode,
  useSlots,
  useAttrs,
  defineProps,
  watch,
  defineEmits,
} from "vue";
import { Modal } from "ant-design-vue";
import { handleConfig } from "@/utils/navUtils";
const attrs: any = useAttrs();
const visible = ref<boolean>(false);
const props = defineProps({
  visibleFlag: Boolean,
});
const emit = defineEmits(["update:visibleFlag"]);

watch(
  () => props.visibleFlag,
  () => {
    visible.value = props.visibleFlag;
  }
);

const handleConfirm = () => {
  attrs.handleConfirm().then((res) => {
    emit("update:visibleFlag", false);
  });
};

const hideModal = () => {
  emit("update:visibleFlag", false);
};
</script>
<style lang="scss">
:deep(.ant-modal-title) {
  font-weight: 700 !important;
  padding: 10px !important;
}
</style>
