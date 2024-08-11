<template>
  <v-btn
    :text="text"
    v-bind="$attrs"
    class="capitalize-text"
    v-on="$listeners"
  >
    <slot>{{ label }}</slot>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    label: {
      type: String,
      default: "Close",
    },
    text: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
});
</script>

<style scoped>
.capitalize-text {
  font-weight: bold;
  text-transform: capitalize;
}
</style>

