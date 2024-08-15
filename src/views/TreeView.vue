<template>
 <v-container>
    <!-- Botón para agregar una nueva carpeta -->
    <v-btn @click="openRootNodeModal" color="primary">
      <v-icon left>mdi-plus</v-icon>
      Crear Carpeta
    </v-btn>

    <!-- Componente TreeView -->
    <v-treeview
      v-model:open="open"
      :items="treeItems"
      item-key="id"
      item-text="name"
      item-children="children"
      activatable
      open-on-click
    >
      <template v-slot:prepend="{ item }">
        <v-icon v-if="!item.isFile">mdi-folder</v-icon> <!-- Carpeta -->
        <v-icon v-else>mdi-file</v-icon> <!-- Archivo -->
      </template>
      <template v-slot:title="{ item }">
        <span :class="[
            item.isFile ? 'file-node' : 'folder-node', 
            item.parentId ? 'child-node' : 'parent-node'
          ]">
          {{ item.isFile ? item.path : item.name }}  <!-- Mostrar path si es archivo, nombre si es carpeta -->
        </span>
      </template>
     
      <template v-slot:append="{ item }">
          <!-- Botón para agregar una subcarpeta o archivo -->
        <v-btn  v-if="!item.isFile" icon small @click.stop="openChildNodeModal(item)">
          <v-icon>mdi-plus</v-icon>
        </v-btn>

        <!-- Mostrar advertencia si el nodo tiene hijos -->
        <v-icon color="orange" v-if="item.children && item.children.length > 0">mdi-alert</v-icon>

        <!-- Botón para eliminar -->
        <v-btn icon small color="error" @click.stop="openDeleteConfirmation(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>


        <!-- Controlamos si mostrar el icono chevron solo si no es un archivo -->
      <template v-slot:append-icon="{ item }">
        <v-icon v-if="!item.isFile">mdi-chevron-down</v-icon>
      </template>
    </v-treeview>

    <!-- Modal para agregar una carpeta o archivo -->
    <v-dialog v-model="modals.addNode" max-width="500px">
      <v-card>
        <v-form ref="addNodeForm" v-model="isFormValid">
        <v-card-title>
          {{ newNodeData.isFile ? 'Crear Archivo' : 'Crear Carpeta' }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-if="!newNodeData.isFile"
            v-model="newNodeData.name"
            label="Nombre"
            :rules="nameRules"
          ></v-text-field>
          <v-file-input
            v-if="newNodeData.isFile"
            v-model="file"
            label="Subir Archivo"
            prepend-icon="mdi-paperclip"
            show-size
            accept=".pdf,.doc,.docx,.txt"
            @change="handleFileSelection"
          ></v-file-input>
          <v-radio-group v-model="newNodeData.isFile" row>
            <v-radio label="Carpeta" :value="false"></v-radio>
            <v-radio label="Archivo" :value="true" :disabled="!canCreateFile"></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="handleAddNode" :disabled="!isFormValid">Crear</v-btn>
          <v-btn @click="closeModal">Cancelar</v-btn>
        </v-card-actions>
      </v-form>
      </v-card>
    </v-dialog>


    <v-dialog v-model="modals.deleteNode" max-width="500">
  <v-card>
    <v-card-title class="headline">Confirmar Eliminación</v-card-title>
    <v-card-text>
      ¿Estás seguro de que deseas eliminar 
      <strong>{{ nodeToDelete?.name || 'este nodo' }}</strong> 
      {{ nodeToDelete?.children && nodeToDelete.children.length > 0 ? 'y todos sus subnodos' : '' }}?
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" @click="confirmDeleteNode" :disabled="!nodeToDelete">Eliminar</v-btn>
      <v-btn color="grey darken-1" @click="cancelDelete">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { TreeNodeDto } from "../services/types";
import { useTreeStore } from '../store/treeStore';

export default defineComponent({
  name: 'TreeView',
  props: {
    userId: {
      type: Number,
      required: true,
    },
    userName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      modals: {
        addNode: false,
        deleteNode: false,
      },
      newNodeData: {
        name: '',
        path: '',
        isFile: false,
        parentId: null as number | null,
        userId: this.userId,
        children: [] as TreeNodeDto[],
      } as TreeNodeDto,
      isFormValid: false,
      nodeToDelete: null as TreeNodeDto | null,
      file: null as File | null,
      nameRules: [
        (v: string) => !!v || 'El nombre es obligatorio.',
        (v: string) => (v && v.length >= 3) || 'El nombre debe tener al menos 3 caracteres.',
        (v: string) => (v && v.length <= 20) || 'El nombre no puede tener más de 20 caracteres.',
        (v: string) => /^[a-zA-Z\s]+$/.test(v) || 'El nombre solo puede contener letras y espacios.',
      ],
    };
  },
  computed: {
    treeItems() {
      return useTreeStore().treeItems;
    },
    open() {
      return useTreeStore().open;
    },
    canCreateFile() {
      return this.treeItems.some(node => !node.isFile);
    },
  },
  methods: {
    async fetchUserNodes() {
      await useTreeStore().fetchUserNodes(this.userId);
    },
    openRootNodeModal() {
      this.newNodeData = { name: '', path: '', isFile: false, parentId: undefined, userId: this.userId, children: [] };
      this.modals.addNode = true;
    },
    openChildNodeModal(parentNode: TreeNodeDto) {
      this.newNodeData = { name: '', path: '', isFile: false, parentId: parentNode.id!, userId: this.userId, children: [] };
      this.modals.addNode = true;
    },
    async handleAddNode() {
      await useTreeStore().addNode(this.newNodeData, this.file, this.userName);
      this.modals.addNode = false;
    },
    openDeleteConfirmation(node: TreeNodeDto) {
      this.nodeToDelete = node;
      this.modals.deleteNode = true;
    },
    async confirmDeleteNode() {
      const store = useTreeStore();
      if (this.nodeToDelete) {
        await store.deleteNode(this.nodeToDelete);
        this.modals.deleteNode = false;
      }
    },
    cancelDelete() {
      this.modals.deleteNode = false;
    },
    handleFileSelection(event: Event) {
      const target = event.target as HTMLInputElement;
      this.file = target.files ? target.files[0] : null;
    },
    closeModal() {
      this.modals.addNode = false;
      this.modals.deleteNode = false;
    },
  },
  mounted() {
    this.fetchUserNodes();
  },
});
</script>

<style scoped>
.parent-node {
  font-weight: bold;
  color: #333;
}

.child-node {
  color: #555;
  margin-left: 20px;
}

.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-leave-to {
  opacity: 0;
}
</style>

