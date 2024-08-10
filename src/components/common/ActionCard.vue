<template>
  <v-sheet
    :color="sheetColor"
    :height="60"
    :width="60"
    elevation="5"
    rounded
    class="d-flex justify-center align-center mr-5 mb-5"
  >
    <v-icon color="white" :size="32">{{ iconName }}</v-icon>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from 'vue';


export default defineComponent({
  props: {
    size: {
      type: Number,
      default: 84,
    },
    sheetColor: {
      type: String,
      required: true,
    },
    iconName: {
      type: String,
      required: true,
    },
    circle: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    iconSize() {
      let size: number = this.size;
      return size / 1.614;
    },
  },
});
</script>
