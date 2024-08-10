<template>
  <v-btn v-bind="$attrs"  icon>
    <v-icon style="margin-right: 0px !important">
      <slot></slot>
    </v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  //
});
</script>
