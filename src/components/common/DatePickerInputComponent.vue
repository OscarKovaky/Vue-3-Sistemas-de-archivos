<template>
  <v-dialog
    v-model="modal"
    ref="dialog"
    :return-value.sync="dateModel"
    width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="dateModel"
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        :required="required"
        :class="{ required }"
        :rules="rules"
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-date-picker :value="dateModel" @input="handleInput">
      <v-spacer></v-spacer>
      <v-btn text @click="modal = false">Cancel</v-btn>
      <v-btn text color="primary" @click="handleDialogOK">OK</v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateStr } from "../../utils/formatDateStr";

export default Vue.extend({
  props: {
    required: {
      type: Boolean,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
    },
    label: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      modal: false,
      dateModel: formatDateStr(this.value),
    };
  },
  watch: {
    dateModel(newValue: string) {
      const date = new Date(newValue);
      // local to utc time conversion
      const utc = new Date(
        Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          date.getUTCHours(),
          date.getUTCMinutes() + date.getTimezoneOffset()
        )
      );

      this.$emit("input", new Date(utc).toUTCString());
    },
  },
  methods: {
    handleInput(v: string) {
      this.dateModel = v;
    },
    handleDialogOK() {
      const dialog = this.$refs.dialog as any;
      dialog?.save(this.dateModel);
    },
  },
});
</script>
