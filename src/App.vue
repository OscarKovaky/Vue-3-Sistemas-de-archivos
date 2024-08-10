<template>
   <v-app>
      <dispatch-root title="Union Management System" />
   </v-app>
</template>

<script lang="ts">
import DispatchRoot from "./DispatchRoot.vue";
import { defineComponent, computed, ref, PropType } from 'vue';
export default defineComponent({
  components: { DispatchRoot },
  name: 'App'

}); 
</script>
