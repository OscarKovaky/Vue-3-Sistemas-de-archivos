<template>
  <v-navigation-drawer :value="show" :color="sidebarColor" dark app width="260">
    <v-list nav>
      <v-list-item v-if="!topDrawer">
        <v-list-item-content>
          <v-list-item-title>
            <strong> Test Union </strong>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list-item :to="{ name: 'home' }" exact link>
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- Más elementos aquí -->
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';

export default defineComponent({
  props: {
    topDrawer: {
      type: Object as PropType<any>,
      required: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const sidebarColor = ref("secondary");
    const groupActiveClass = computed(() => "secondary lighten-1 white--text");
    const itemActiveClass = computed(() => "primary white--text");

    return {
      sidebarColor,
      groupActiveClass,
      itemActiveClass,
    };
  },
});
</script>

