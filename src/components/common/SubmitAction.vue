<template>
  <v-btn
    v-bind="$attrs"
    color="primary"
    type="submit"
    class="capitalize-text"
    :disabled="!canSave"
    :loading="loading"
    :form="formId"
  >
    {{ label }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    label: {
      type: String,
      default: "Submit",
    },
    canSave: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    formId: {
      type: String,
      required: false,
      default: "form",
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

