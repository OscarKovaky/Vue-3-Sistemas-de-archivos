<template>
  <v-btn :text="text" v-on="$listeners" class="capitalize-text" v-bind="$attrs">
    <slot>
      {{ label }}
    </slot>
  </v-btn>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    label: {
      type: String,
      default: "Close",
    },
    text: {
      type: Boolean,
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
