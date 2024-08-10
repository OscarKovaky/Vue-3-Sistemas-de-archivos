<template>
  <vuetify-money
    :style="cssstyle"
    v-bind="$attrs"
    v-on="$listeners"
    v-model="innerValue"
    :valueWhenIsEmpty="valueWhenIsEmpty"
    :options="moneyOptions"
    :name="randomName"
    :id="randomName"
    :autocomplete="randomName"
    dark
    @keypress="onKeyPress"
    @keyup="onKeyPress"
    @keydown="onKeyPress"
  >
    <slot name="clear"></slot>
  </vuetify-money>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    fixedId: String,
    value: {
      type: [String, Number],
      default: () => "",
    },
    valueWhenIsEmpty: {
      type: String,
      default: () => "",
    },
    prefix: {
      type: String,
      default: () => "$",
    },
    cssstyle: {
      type: String,
      default: () => "",
    },
    isNegative: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      innerValue: null,
      randomName: "",
      moneyOptions: {
        locale: "en-CA",
        prefix: "$",
        suffix: "",
        length: 15,
        precision: 2,
      },
    };
  },
  watch: {
    value: {
      handler(v) {
        this.innerValue = v;
      },
      immediate: true,
    },
    innerValue: {
      async handler(v) {
        this.$emit("update:value", v);
        this.$emit("change", v);
      },
    },
    fixedId: {
      handler(v) {
        if (v === null || v === undefined) {
          this.randomName = v;
        } else {
          this.randomName = this.getRandomName();
        }
      },
      immediate: true,
    },
    prefix: {
      handler(v) {
        this.moneyOptions.prefix = v;
        if (this.isNegative === true) {
          this.moneyOptions.prefix += "-";
        }
      },
      immediate: true,
    },
    isNegative: {
      handler(v) {
        this.moneyOptions.prefix = this.prefix;
        if (this.isNegative === true) {
          this.moneyOptions.prefix += "-";
        }
      },
      immediate: true,
    },
  },
  mounted() {
    if (this.fixedId === null || this.fixedId === undefined) {
      this.randomName = this.getRandomName();
    } else {
      this.randomName = this.fixedId;
    }
    this.moneyOptions.prefix = this.prefix;
  },
  methods: {
    getRandomName() {
      return Math.random().toString();
    },
    onKeyPress(evt) {
      console.log("key press", evt.keyCode, evt.target.value);
      return false;
    },
  },
});
</script>
