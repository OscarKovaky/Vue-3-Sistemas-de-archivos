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
  <v-dialog v-model="modals.create" max-width="600px">
    <v-card>
      <v-card-title>Create User</v-card-title>
      <v-form ref="createForm" v-model="isFormValid">
           <v-container>
          <v-row>
            <!-- Username Field -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newUser.username"
                label="Username"
                :rules="[rules.required, value => rules.minLength(value, 3), value => rules.maxLength(value, 20)]"
                required
                clearable
                outlined
                @input="checkFormValidCreate"
              ></v-text-field>
            </v-col>

            <!-- Email Field -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newUser.email"
                label="Email"
                :rules="[rules.required, rules.email]"
                required
                clearable
                outlined
                @input="checkFormValidCreate"
              ></v-text-field>
            </v-col>

            <!-- Role Field -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newUser.role"
                label="Role"
                :rules="[rules.required,rules.onlyLetters, value => rules.maxLength(value, 20)]"
                required
                clearable
                outlined
              ></v-text-field>
            </v-col>

            <!-- Password Field -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newUser.password"
                label="Password"
                :rules="[rules.required, rules.passwordComplexity]"
                required
                clearable
                outlined
                @input="checkFormValidCreate"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="createUser"  :disabled="!isFormValid">Create</v-btn>
        <v-btn @click="modals.create = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal para Actualizar Usuario -->
  <v-dialog v-model="modals.update" max-width="600px">
    <v-card>
      <v-card-title>Update User</v-card-title>
      <v-form ref="updateForm" v-model="isFormValid">
        <v-card-subtitle v-if="selectedUser">
          <v-text-field
          v-model="selectedUser.username"
          label="Username"
          :rules="[rules.required, value => rules.minLength(value, 3), value => rules.maxLength(value, 20)]"
          required
          clearable
          outlined
          @input="checkFormValidUpdate"
          ></v-text-field>
        </v-card-subtitle>
      </v-form> 
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="updateUser"  :disabled="!isFormValid">Update</v-btn>
        <v-btn @click="modals.update = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal para Confirmación de Eliminación -->
  <v-dialog v-model="modals.delete" max-width="500px">
    <v-card>
      <v-card-title>Delete User</v-card-title>
      <v-card-subtitle>Are you sure you want to delete {{ selectedUser?.username }}?</v-card-subtitle>
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
        <v-card-title>Documents for {{ selectedUser?.username }}</v-card-title>
        <v-card-subtitle v-if="selectedUser">
          <!-- Including the treeview component -->
          <TreeView :userId="selectedUser.id ?? 0" :username="selectedUser.username" />

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
import { useUserStore } from '../store/userStore';

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
      newUser: {} as RegisterUserDto,
      headersUsers: [
        { text: 'Username', value: 'username' },
        { text: 'Email', value: 'email' },
        { text: 'Role', value: 'role' },
        { text: 'Actions', value: 'actions' },
      ],
      isFormValid: false,
      rules: {
        required: (value: string) => !!value || 'Este campo es obligatorio.',
        email: (value: string) => {
          const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return pattern.test(value) || 'Ingrese un correo electrónico válido con un dominio válido.';
        },
        minLength: (value: string, length: number) => value.length >= length || `Debe tener al menos ${length} caracteres.`,
        maxLength: (value: string, length: number) => value.length <= length || `Debe tener un máximo de ${length} caracteres.`,
        onlyLetters: (value: string) => {
          const pattern = /^[a-zA-Z]+$/;
          return pattern.test(value) || 'El rol solo debe contener letras.';
        },
        passwordComplexity: (value: string) => {
          const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
          return pattern.test(value) || 'La contraseña debe tener al menos 8 caracteres, incluyendo un número, una letra y un carácter especial.';
        },
      }
    };
  },
  computed: {
    users() {
      const userStore = useUserStore();
      return userStore.users;
    },
    selectedUser() {
      const userStore = useUserStore();
      return userStore.selectedUser;
    }
  },
  methods: {
    checkFormValidCreate() {
      const form = this.$refs.createForm as VForm;
      this.isFormValid = form.validate();
    },
    checkFormValidUpdate() {
      const form = this.$refs.updateForm as VForm;
      this.isFormValid = form.validate();
    },
    async getUsers() {
      const userStore = useUserStore();
       await userStore.fetchUsers();
    },
    async createUser() {
      if (this.isFormValid) {
        const userStore = useUserStore();
        await userStore.createUser(this.newUser);
        this.modals.create = false;
      }
    },
    async confirmDelete() {
      const userStore = useUserStore();
      if (userStore.selectedUser?.id) {
        await userStore.deleteUser(userStore.selectedUser.id);
        this.modals.delete = false;
      }
    },
    async updateUser() {
      if (this.isFormValid) {
        const userStore = useUserStore();
        await userStore.updateUser(userStore.selectedUser!);
        this.modals.update = false;
      }
    },
    openCreateModal() {
      this.newUser = {} as RegisterUserDto; // Reset newUser before opening the modal
      this.modals.create = true;
    },
    openDeleteModal(user: UserDto) {
      const userStore = useUserStore();
      userStore.selectUser(user);
      this.modals.delete = true;
    },
    openUpdateModal(user: UserDto) {
      const userStore = useUserStore();
      userStore.selectUser(user);
      this.modals.update = true;
    },
    openDocumentsModal(user: UserDto) {
      const userStore = useUserStore();
      userStore.selectUser(user);
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
<style scoped>
.password-field {
  max-width: 100%;
}
</style>
