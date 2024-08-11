<template>
  <v-data-table
    :loading="loading"
    :dense="dense"
    :headers="headers"
    :items="items"
  >
    <template v-if="!notop" v-slot:top>
      <v-container fluid class="grey lighten-5 py-3">
        <AddButton
          class="mr-3"
          v-if="$listeners['add']"
          @click="$emit('add')"
        />
        <FindButton
          class="mr-3"
          v-if="$listeners['find']"
          @click="$emit('find')"
        />
        <slot name="headerActions"></slot>
      </v-container>
    </template>

    <template v-for="(slot, name) in $slots" :key="name" v-slot:[name]="slot">
      <slot :name="name" v-bind="slot"></slot>
    </template>

    <template v-slot:[`column.actions`]="{ item }">
      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            text
            v-bind="attrs"
            v-on="on"
            style="margin-right: 10px"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="action in actions"
            :key="action.title"
            @click.prevent="action.handler(item)"
          >
            <v-list-item-icon>
              <v-icon>{{ action.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ action.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <slot name="actions" :item="item"></slot>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ActionCard from "@/components/common/ActionCard.vue";
import AddButton from "@/components/common/AddButton.vue";
import UpdateIconButton from "@/components/common/UpdateIconButton.vue";
import DeleteIconButton from "@/components/common/DeleteIconButton.vue";

interface RowAction {
  icon: string;
  title: string;
  handler: (item: any) => void;
}

export default defineComponent({
  components: {
    ActionCard,
    AddButton,
    UpdateIconButton,
    DeleteIconButton,
  },
  computed: {
    elevation() {
      return this.inset ? "0" : "1";
    },
  },
  mounted() {
    if (this.actions.length > 0) {
      this.headers.unshift({
        title: "", // Use 'title' instead of 'text'
        value: "actions",
        width: "1rem",
      });
    }
  },
  props: {
    dense: {
      type: Boolean,
      default: false,
    },
    notop: {
      type: Boolean,
      default: false,
    },
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
    loading: {
      type: Boolean,
      required: false,
    },
    headers: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    actions: {
      type: Array as PropType<RowAction[]>,
      default: () => [],
    },
    items: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
});
</script>

<style>
.simple-table .v-data-table th span {
  text-transform: capitalize !important;
  color: black;
}

.simple-table .v-data-table tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.06);
}
</style>
