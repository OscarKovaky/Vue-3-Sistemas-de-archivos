<template>
  <v-app>

      <dispatch-root  title="Union Management System" />

  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DispatchRoot from "./DispatchRoot.vue";

export default defineComponent({
  name: 'App',
  components: { DispatchRoot },

  data () {
    return {
      //
    }
  },
})
</script>
