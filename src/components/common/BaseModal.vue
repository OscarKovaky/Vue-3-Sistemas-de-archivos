<template>
  <v-dialog
    :value="show"
    :fullscreen="fullscreen"
    persistent
    @input="close"
    :max-width="maxWidth"
    scrollable
  >
      <v-form
        :id="title"
        @submit.prevent="submit"
        ref="form"
        style="overflow: auto"
      >
        <v-card-text>
          <slot></slot>
        </v-card-text>
        <v-card-actions>
          <slot name="actions" v-bind="{ form: $refs.form }">
            <v-spacer></v-spacer>
            <CloseButton @click="close" />

            <SubmitAction
              v-if="$listeners['submit']"
              :loading="loading"
              :formId="title"
            />
          </slot>
        </v-card-actions>
      </v-form>
  </v-dialog>
</template>

<script lang="ts">
 import { defineComponent,  PropType }  from 'vue';
import SubmitAction from "../common/SubmitAction.vue";
import CloseButton from "../common/CloseButton.vue";

type ModalSize = "sm" | "md" | "lg";

export default defineComponent({
  components: {
    CloseButton,
    SubmitAction,
  },
  props: {
    fullscreen: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
    },
    title: {
      type: String,
      required: true,
    },
    size: {
      type: String as PropType<ModalSize>,
      default: "md",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
    },
  },
  computed: {
    maxWidth(): string {
      switch (this.size) {
        case "sm":
          return "400";
        case "md":
          return "700";
        case "lg":
          return "1200";
        default:
          return "700";
      }
    },
  },
  methods: {
    close() {
      this.$emit("close", this.$refs.form);
    },
    submit() {
      this.$emit("submit", this.$refs.form);
    },
  },
});
</script>
