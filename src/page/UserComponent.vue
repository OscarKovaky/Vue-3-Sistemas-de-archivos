<template>
 <v-container>
   <!-- Header Toolbar -->
   <v-toolbar flat color="primary">
      <v-toolbar-title class="white--text">Users</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- Button to Open Create Modal -->
      <v-btn @click="openCreateModal" color="white" class="ml-2">
        <v-icon left>mdi-plus</v-icon>
        Add User
      </v-btn>

      <v-btn @click="downloadExcelFile" color="white" class="ml-2">
        <v-icon left>mdi-download</v-icon>
        Download Excel
        <v-progress-circular 
          v-if="loading" 
          indeterminate 
          color="white" 
          size="24">
        </v-progress-circular>
      </v-btn>
    </v-toolbar>

    <!-- Data Table -->
    <v-data-table
      :headers="headersUsers"
      :items="users"
      item-key="id"
      >
        <template v-slot:item="{ item }">
    
          <tr class="hoverable">
            <td>{{ item.username }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.role }}</td>
            <td class="text-right">
              <v-btn @click="openUpdateModal(item)" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn @click="openDeleteModal(item)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn @click="openDocumentsModal(item)" icon>
                <v-icon>mdi-folder</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>


      <!-- Modal para Crear Usuario -->
  <v-dialog v-model="modals.create" max-width="500px">
    <v-card>
      <v-card-title>Create User</v-card-title>
      <v-card-subtitle>
        <v-text-field v-model="newUser.username" label="Username"></v-text-field>
      </v-card-subtitle>
      <v-card-subtitle>
        <v-text-field v-model="newUser.email" label="Email"></v-text-field>
      </v-card-subtitle>
      <v-card-subtitle>
        <v-text-field v-model="newUser.role" label="Role"></v-text-field>
      </v-card-subtitle>
      <v-card-subtitle>
        <v-text-field v-model="newUser.password" label="Password"></v-text-field>
      </v-card-subtitle>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="createUser" color="primary">Create</v-btn>
        <v-btn @click="modals.create = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal para Actualizar Usuario -->
  <v-dialog v-model="modals.update" max-width="500px">
    <v-card>
      <v-card-title>Update User</v-card-title>
      <v-card-subtitle v-if="selected">
        <v-text-field v-model="selected.username" label="Username"></v-text-field>
      </v-card-subtitle>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="updateUser" color="primary">Update</v-btn>
        <v-btn @click="modals.update = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal para Confirmación de Eliminación -->
  <v-dialog v-model="modals.delete" max-width="500px">
    <v-card>
      <v-card-title>Delete User</v-card-title>
      <v-card-subtitle>Are you sure you want to delete {{ selected?.username }}?</v-card-subtitle>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="confirmDelete" color="error">Delete</v-btn>
        <v-btn @click="modals.delete = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

   <!-- Modal para Documentos -->
   <v-dialog v-model="modals.documents" max-width="800px">
      <v-card>
        <v-card-title>Documents for {{ selected?.username }}</v-card-title>
        <v-card-subtitle v-if="selected">
          <!-- Including the treeview component -->
          <TreeView :userId="selected.id ?? 0" :username="selected.username" />

        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="modals.documents = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

 </v-container>
  


</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import DeleteDialog from "../components/common/DeleteDialog.vue";
import DeleteIconButton from "../components/common/DeleteIconButton.vue";
import UpdateIconButton from "../components/common/UpdateIconButton.vue";
import AddButton from "../components/common/AddButton.vue";
import { RegisterUserDto, UserDto, VForm } from "../services/types";
import { client } from "../services/dispatch-client";
import TreeView from '@/views/TreeView.vue';


export default defineComponent({
  name: "UserComponent",
  components: {
    DeleteDialog,
    UpdateIconButton,
    DeleteIconButton,
    AddButton,
    TreeView
  },
  data() {
    return {
      modals: {
        create: false,
        delete: false,
        update: false,
        documents: false,
      },
      loading: false,
      selected: null as UserDto | null,
      users: [] as UserDto[],
      newUser: {} as RegisterUserDto,
      headersUsers: [
        { text: 'Username', value: 'username' },
        { text: 'Email', value: 'email' },
        { text: 'Role', value: 'role' },
        { text: 'Actions', value: 'actions' },
      ],
    };
  },
  methods: {
    async getUsers() {
      const res = await client.getUsers();
      this.users = res.response;
    },
    async createUser() {
      await client.addUser(this.newUser);
      await this.getUsers();
      this.modals.create = false;
    },
    async confirmDelete() {
      if (this.selected?.id) {
        await client.deleteUser(this.selected.id);
        await this.getUsers();
        this.modals.delete = false;
      }
    },
    async updateUser(user: UserDto) {
      await client.updateUser(user);
      await this.getUsers();
      this.modals.update = false;
    },
    openCreateModal() {
      this.newUser = {} as RegisterUserDto; // Reset newUser before opening the modal
      this.modals.create = true;
    },
    openDeleteModal(user: UserDto) {
      this.selected = user;
      this.modals.delete = true;
    },
    openUpdateModal(user: UserDto) {
      this.selected = user;
      this.modals.update = true;
    },
    openDocumentsModal(user: UserDto) {
      this.selected = user;
      this.modals.documents = true;
    },
    async downloadExcelFile() {
      try {
        // Realiza la solicitud al servidor para descargar el archivo Excel
        const blob = await client.getFile('/files/export-users');
        
        // Crear una URL para el blob y preparar la descarga del archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Usuarios.xlsx'); // Nombre del archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Limpiar después de la descarga
      } catch (error) {
        console.error('Error al descargar el archivo:', error);
      }
    }
  },
  mounted() {
    this.getUsers();
  },
});
</script>
