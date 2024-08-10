<template>
  <v-snackbar v-model="visible" :color="color" :timeout="timeout" top>
    {{ message }}
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from 'vue';


export default defineComponent({
  name: "AlertMessage",
  props: {
    message: String,
    color: {
      type: String,
      default: "success",
    },
    timeout: {
      type: Number,
      default: 3000,
    },
  },
  data() {
    return {
      visible: true,
    };
  },
});
</script>
