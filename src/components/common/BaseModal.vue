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

        
          </slot>
        </v-card-actions>
      </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from 'vue';
import CloseButton from "./CloseButton.vue";
import SubmitAction from "./SubmitAction.vue";
import BaseToolbar from "./BaseToolbar.vue";

export default defineComponent({
  components: {
    CloseButton,
    SubmitAction,
    BaseToolbar,
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
      type: String ,
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
