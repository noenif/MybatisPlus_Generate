<template>
  <a-col v-bind="{ ...colProps }">
    <a-form-item v-bind="props">
      <a-row>
        <a-col :span="suffixText ? 18 : 24">
          <component
            :is="component"
            :ref="focusRef.value === prop ? 'focusRef' : null"
            v-model:value="form[prop]"
            v-model:checked="form[prop]"
            v-bind="componentProps"
            v-on="componentMethods"
          >
          </component>
        </a-col>
        <a-col :offset="1" :span="4" v-if="suffixText">
          <span>{{ suffixText }}</span>
        </a-col>
      </a-row>
    </a-form-item>
    <a-col> </a-col>
  </a-col>
</template>

<script>
// 导入所有组件
// 以 "dialog-" 开头,以".vue"结尾
const allComponents = require.context("./custom", false, /^.*\.vue$/);
const resComponents = {};
allComponents.keys().forEach((fileName) => {
  const comp = allComponents(fileName);
  resComponents[fileName.replace(/^\.\/(.*)\.\w+$/, "$1")] = comp.default;
});

export default {
  name: "FormItem",
  inheritAttrs: false,
  components: {
    ...resComponents,
  },
  inject: {
    focusRef: {
      default: () => "",
    },
  },
  props: {
    component: {
      type: String,
      default: "",
    },
    componentProps: {
      type: Object,
      default: () => {},
    },
    componentMethods: {
      type: Object,
      default: () => {},
    },
    show: {
      type: Boolean,
      default: true,
    },
    ifShow: {
      type: Boolean,
      default: true,
    },
    colProps: {
      type: Object,
      default: () => {},
    },
    icon: {
      type: Object,
      default: () => {},
    },
    prop: {
      type: String,
      default: () => "",
    },
    form: {
      type: Object,
      default: () => {},
    },
    suffixText: {
      type: String,
      default: () => "",
    },
  },
  computed: {
    props() {
      const banList = {
        component: true,
        componentProps: true,
        componentMethods: true,
        type: true,
        show: true,
        ifShow: true,
        defaultValue: true,
        colProps: true,
        form: true,
        width: true,
        custom: true,
        propType: true,
      };
      const props = { ...this.$attrs, ...this.$props };
      for (const ban in banList) {
        if (ban in props) {
          delete props[ban];
        }
      }
      return props;
    },
  },
  watch: {
    "focusRef.value"(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          const focusRef = this.$refs?.focusRef;
          if (!focusRef) return;
          const $el = focusRef.$el;
          if (focusRef?.focus) {
            focusRef.focus?.();
          } else if (focusRef?.$refs?.input?.focus) {
            focusRef.$refs.input.focus?.();
          } else {
            $el?.querySelector("input")?.focus?.();
          }
          if (this.focusRef.status) {
            if ($el?.querySelector("input"))
              $el.querySelector("input").style.borderColor = "red";
          }
        });
      }
    },
    "focusRef.status"() {
      this.handleChange();
    },
  },
  methods: {},
};
</script>

<style lang="scss">
.basic-form-page__col.a-form-item {
  display: flex;
  .a-form-item__content {
    flex: 1;
    .a-select {
      width: 100%;
    }
  }
}
</style>
