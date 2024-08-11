<template>
  <v-btn 
    v-bind="$attrs" 
    @click="$emit('click')" 
    icon 
    color="error"
  >
    <v-icon style="margin-right: 0px !important">mdi-delete</v-icon>
  </v-btn>
</template>

<script>
export default {
  emits: ['click'] // Define the events that this component will emit
};
</script>
