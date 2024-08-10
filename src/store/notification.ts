import Vue from "vue";

export interface NotificationState {
  message: string;
  color: string;
  show: boolean;
}

import { reactive } from 'vue';

const state = reactive<NotificationState>({
  message: "",
  color: "",
  show: false,
});

const notification = {
  state,
  show(message: string = "Success", color: string = "success") {
    state.message = message;
    state.color = color;
    state.show = true;
  },
  hide() {
    state.show = false;
  },
};

export default notification;
