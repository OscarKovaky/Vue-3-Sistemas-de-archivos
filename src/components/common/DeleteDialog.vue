<template>
  <v-dialog :value="show" @input="cancel" persistent max-width="400" scrollable>

      <v-card-text>
        {{ text }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <CloseButton @click="cancel" label="Cancel" />
        <v-btn
          :loading="loading"
          color="error"
          class="capitalize-text"
          @click="confirm"
          >Delete</v-btn
        >
      </v-card-actions>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CloseButton from "./CloseButton.vue";
import ActionCard from "./ActionCard.vue";


export default defineComponent({
  components: {
    CloseButton,
    ActionCard,
  },
  props: {
    show: Boolean,
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Are you sure?",
    },
    text: {
      type: String,
      default: "This action cannot be undone",
    },
  },
  methods: {
    confirm() {
      this.$emit("confirm");
    },
    cancel() {
      this.$emit("cancel");
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
