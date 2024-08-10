<template>
  <div style="overflow: visible">
    <v-toolbar flat rounded dense style="overflow: visible">
      <ActionCard
        v-if="icon"
        :iconName="icon"
        :sheetColor="iconColor"
        :circle="inset"
        :size="iconSize"
      />
      <v-toolbar-title>
        <h4
          class="grey--text text--darken-2 font-weight-light"
          style="font-size: 18px"
        >
          {{ title }}
        </h4>
        <slot name="title"></slot>
      </v-toolbar-title>
      <v-toolbar-items>
        <slot name="items"></slot>
      </v-toolbar-items>
    </v-toolbar>
    <v-divider></v-divider>
    <div style="padding-left: 1rem; padding-top: 0.5rem">
      <slot name="extension"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AddButton from "@/components/common/AddButton.vue";
import ActionCard from "./ActionCard.vue";

import { defineComponent, computed, ref, PropType } from 'vue';
import CloseButton from "./CloseButton.vue";
import SubmitAction from "./SubmitAction.vue";
import BaseToolbar from "./BaseToolbar.vue";

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
    inset: {
      type: Boolean,
      default: false,
    },
    iconColor: {
      type: String,
      default: "blue-grey",
    },
    title: {
      type: String,
      required: true,
    },
  },
  components: {
    AddButton,
    ActionCard,
  },
  computed: {
    iconSize() {
      if (!this.inset) {
        return undefined;
      }

      return 60;
    },
  },
});
</script>
