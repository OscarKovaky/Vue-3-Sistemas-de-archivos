// src/stores/userStore.ts
import { defineStore } from 'pinia';
import { UserDto, RegisterUserDto } from '../services/types';
import { client } from '../services/dispatch-client';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    users: [] as UserDto[],
    selectedUser: null as UserDto | null,
  }),
  actions: {
    async fetchUsers() {
      try {
        const res = await client.getUsers();
        this.users = res.response;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async createUser(newUser: RegisterUserDto) {
      try {
        await client.addUser(newUser);
        await this.fetchUsers();
      } catch (error) {
        console.error('Error creating user:', error);
      }
    },
    async deleteUser(userId: number) {
      try {
        await client.deleteUser(userId);
        await this.fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    },
    async updateUser(updatedUser: UserDto) {
      try {
        await client.updateUser(updatedUser);
        await this.fetchUsers();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    },
    selectUser(user: UserDto) {
      this.selectedUser = user;
    },
  },
});
