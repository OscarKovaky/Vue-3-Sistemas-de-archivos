<template>
  <v-dialog :value="show" @input="cancel" persistent max-width="400" scrollable>
    <MaterialCard
      icon="mdi-delete"
      :title="title"
      :color="$vuetify.theme.currentTheme.error"
    >
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
    </MaterialCard>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import CloseButton from "@/components/common/CloseButton.vue";
import ActionCard from "@/components/common/ActionCard.vue";
import components from "pbas-vue-components";

export default Vue.extend({
  components: {
    MaterialCard: components.MaterialCard,
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
