<template>
  <v-btn
    v-bind="$attrs"
    class="capitalize-text"
    color="success"
  >
    <v-icon left>mdi-plus</v-icon>{{ label }}
  </v-btn>
</template>
<script lang="ts">
import { defineComponent, computed, ref, PropType } from 'vue';


export default defineComponent({
  props: {
    label: {
      type: String
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
