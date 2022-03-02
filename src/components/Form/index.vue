<template>
  <a-form
    ref="elForm"
    size="medium"
    :model="formData"
    :rules="rules"
    v-bind="props"
  >
    <a-row>
      <template v-for="(schema, index) in schemasMap" :key="index">
        <form-item
          :form="formData"
          v-bind="schema"
          v-if="schema.existCondition !== false"
        />
      </template>
    </a-row>
    <a-row
      v-if="componentCustom && componentCustom.ButtonProps.display !== false"
    >
      <slot :buttonProps="componentCustom.ButtonProps">
        <ButtonGroup
          :buttonProps="componentCustom.ButtonProps.ButtonGroupProps"
          :rowProps="componentCustom.ButtonProps.rowProps"
          :formData="formData"
        >
        </ButtonGroup>
      </slot>
    </a-row>
    <slot />
  </a-form>
</template>

<script>
import FormItem from "./FormItem";
import ButtonGroup from "@/components/Form/custom/ButtonGroup.vue";
export default {
  emits: ["update:formData"],
  name: "FormComponent",
  components: {
    FormItem,
    ButtonGroup,
  },
  inheritAttrs: false,
  props: {
    schemas: {
      type: Array,
      default: function () {
        return [];
      },
    },
    componentCustom: {
      type: Object,
      default: () => null,
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      rules: {},
      typeEnumeration: {
        array: "array",
        number: "number",
        string: "string",
        boolean: "boolean",
      },
    };
  },
  computed: {
    formDataValue: {
      get() {
        return this.formData;
      },
      set(newValue) {
        this.$emit("update:formData", newValue);
      },
    },
    schemasMap() {
      return (
        this.schemas?.map?.((schema) => {
          let prefix = "";
          // 保证驼峰式和短线连接都可以正常使用
          if (
            !schema?.custom &&
            !schema?.component?.startsWith("A") &&
            !schema?.component?.startsWith("a-")
          ) {
            prefix =
              schema?.component?.substring(0, 1) ===
              schema?.component?.substring(0, 1)?.toUpperCase()
                ? "A"
                : "a-";
          }
          schema.component = prefix + schema.component;
          return schema;
        }) || []
      );
    },
    props() {
      const banList = {
        schemas: true,
        resetOnSubmit: true,
        afterSubmit: true,
        ifButtonShow: true,
      };
      const props = { ...this.$attrs, ...this.$props };
      for (const ban in banList) {
        if (ban in props) {
          delete props[ban];
        }
      }
      props.rules = props.rules
        ? { ...this.rules, ...props.rules }
        : { ...this.rules };
      return props;
    },
  },
  created() {
    this.generateFormData();
  },
  methods: {
    generateFormData() {
      const formData = {};
      const rules = {};
      this.schemas.forEach((schema) => {
        formData[schema.prop] =
          "defaultValue" in schema
            ? schema.defaultValue
            : this.ObjectType(schema.propType);
        if (!rules[schema.prop]) {
          rules[schema.prop] = [];
          if (schema.required) {
            rules[schema.prop].push({
              required: true,
              message: `${
                schema.component === "SelectOption" ? "请选择" : "请输入"
              }${schema.label}`,
            });
          }
        }
      });
      this.formDataValue = formData;
      this.rules = rules;
    },
    ObjectType(type) {
      if (this.typeEnumeration[type]) {
        switch (type) {
          case "string":
            return "";
          case "number":
            return null;
          case "boolean":
            return false;
          case "array":
          default:
            return [];
        }
      } else {
        throw new Error("请设置正常的数据类型!array,number,string");
      }
    },
    submitForm() {
      this.$refs.elForm.validate((valid) => {
        if (valid) {
          this?.afterSubmit?.({ ...this.formDataValue });
          if (this.resetOnSubmit) {
            console.log("resetOnSubmit");
            this.resetForm();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.elForm.resetFields();
    },
  },
};
</script>
<style scoped>
.a-form >>> .a-form-item__content {
  margin-left: 0 !important;
}
</style>
