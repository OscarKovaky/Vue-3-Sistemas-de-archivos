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
        <v-card-title>
          {{ newNodeData.isFile ? 'Crear Archivo' : 'Crear Carpeta' }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-if="!newNodeData.isFile"
            v-model="newNodeData.name"
            label="Nombre"
            required
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
          <v-btn @click="addNode">Crear</v-btn>
          <v-btn @click="closeModal">Cancelar</v-btn>
        </v-card-actions>
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
      <v-btn color="red darken-1"  @click="confirmDeleteNode" :disabled="!nodeToDelete">Eliminar</v-btn>
      <v-btn color="grey darken-1" @click="cancelDelete">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { client } from "../services/dispatch-client";
import { TreeNodeDto } from "../services/types";
import { createFullPath } from '@/utils/pathUtils';

export default defineComponent({
  name: 'TreeView',
  props: {
    userId: {
      type: Number as PropType<number>,
      required: true,
    },
    userName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      file: null, 
      treeItems: [] as TreeNodeDto[],
      nodeToDelete: null as TreeNodeDto | null,
      open: [] as number[],
      modals: {
        addNode: false,
        deleteNode: false
      },
      newNodeData: {
        name: '',
        path: '',
        isFile: false,
        parentId: null as number | null,
      },
    };
  },
  mounted() {
    this.fetchUserNodes();
  },
  computed: {
    canCreateFile(): boolean {
      // Verifica si ya hay al menos una carpeta antes de permitir la creación de archivos
      return this.treeItems.some(node => !node.isFile);
    },
  },
  methods: {
    handleFileSelection(event: Event) {
      const target = event.target as HTMLInputElement;
      const file = target.files ? target.files[0] : null;
      if (file) {
        console.log('File selected:', file.name);
        this.newNodeData.path = file.name;  // Solo guarda el nombre del archivo
        this.newNodeData.isFile = true;
      } else {
        this.newNodeData.path = '';
        this.newNodeData.isFile = false;
      }
    },
    generateFullPath(node: TreeNodeDto): string {
      const nodesMap = this.buildNodesMap(this.treeItems);
      return createFullPath(node, this.userName, nodesMap);
    },
    buildNodesMap(nodes: TreeNodeDto[]): Map<number, TreeNodeDto> {
      const map = new Map<number, TreeNodeDto>();
      nodes.forEach(node => {
        map.set(node.id!, node);
        if (node.children && node.children.length > 0) {
          node.children.forEach(child => {
            map.set(child.id!, child);
          });
        }
      });
      return map;
    },
    async fetchUserNodes() {
      try {
        const response = await client.getUserNodes(this.userId);
        this.treeItems = this.transformNodes(response.response);
      } catch (error) {
        console.error('Error fetching user nodes:', error);
      }
    },
    transformNodes(nodes: TreeNodeDto[]): TreeNodeDto[] {
      const map: { [key: number]: TreeNodeDto } = {};
      const roots: TreeNodeDto[] = [];

      // Crear un mapa de nodos
      nodes.forEach(node => {
        map[node.id!] = { ...node, children: [] };
      });

      // Asociar cada nodo con su padre o añadirlo a los nodos raíz
      nodes.forEach(node => {
        if (node.parentId !== null && node.parentId !== undefined) {
            const parentNode = map[node.parentId];
            if (parentNode) {
                parentNode.children.push(map[node.id!]);
            } else {
                console.warn(`No se encontró el nodo padre con ID ${node.parentId} para el nodo ${node.id}`);
            }
        } else {
            roots.push(map[node.id!]);
        }
      });

      return roots;
    },
    openRootNodeModal() {
      this.newNodeData = { name: '', path: '', isFile: false, parentId: null };
      this.modals.addNode = true;
    },
    openChildNodeModal(parentNode: TreeNodeDto) {
      this.newNodeData = { name: '', path: '', isFile: false, parentId: parentNode.id! };
      this.modals.addNode = true;
    },
    async addNode() {
      const newNodeData: TreeNodeDto = {
            name: this.newNodeData.name,
            isFile: this.newNodeData.isFile,
            path: this.newNodeData.path,
            parentId: this.newNodeData.parentId!,
            userId: this.userId,
            children: [],
          };



          // Enviar la solicitud para crear el nodo y recibir el nuevo ID
          const newNodeId = await client.createNode(newNodeData);

          if (newNodeData.isFile && this.file) {
            console.log('File selected:', newNodeData.isFile );
            // Crear el mapa de nodos con los nodos actuales, incluyendo el nuevo nodo
            const nodesMap = this.buildNodesMap([...this.treeItems, newNodeData]);

            // Generar la ruta completa para el nodo recién creado
            const fullPath = createFullPath(newNodeData, this.userName, nodesMap);
            console.log('Ruta completa generada:', fullPath);
             // Si es un archivo, primero subimos el archivo
             const formData = new FormData();
            formData.append('file', this.file); 
            formData.append('path', fullPath);
            await client.postFile("Files/upload",formData);
          }


      
          // Ahora que tenemos el ID, podemos construir el nodo completo
          const newNode: TreeNodeDto = {
            id: newNodeId.response,  // ID asignado por el backend
            ...newNodeData,
            children: [],
          };

          if (newNode.parentId === null) {
            // Si parentId es null, agregarlo como un nodo raíz
            this.treeItems.push(newNode);
          } else {
            // Si tiene un parentId, agregarlo como hijo del nodo correspondiente
            const parentNode = this.findNodeById(newNode.parentId!);
            if (parentNode) {
              parentNode.children.push(newNode);
            } else {
              console.warn(`No se encontró el nodo padre con id ${newNode.parentId}`);
            }
          }

      this.closeModal();
    },
    findNodeById(id: number): TreeNodeDto | undefined {
      const findRecursively = (nodes: TreeNodeDto[]): TreeNodeDto | undefined => {
        for (const node of nodes) {
          if (node.id === id) {
            return node;
          }
          const foundChild = findRecursively(node.children);
          if (foundChild) {
            return foundChild;
          }
        }
        return undefined;
      };
      return findRecursively(this.treeItems);
    },
    async confirmDeleteNode() {
      if (this.nodeToDelete) {
        await this.deleteNode(this.nodeToDelete);
        this.modals.deleteNode = false;
      }
    },
    cancelDelete() {
      this.modals.deleteNode = false;
    },
    async deleteNode(node: TreeNodeDto) {
      if (node.id === undefined) {
            console.error('El ID del nodo es indefinido, no se puede eliminar el nodo.');
            return;
          }

          try {
            // Llama al servicio de backend para eliminar el nodo
            if (node.children && node.children.length > 0) {
              await client.deleteNodeWithChildren(node.id);
            } else {
              await client.deleteNode(node.id);
            }

            // Elimina el nodo en la UI después de la eliminación exitosa en el backend
            const deleteRecursively = (nodes: TreeNodeDto[], nodeId: number): boolean => {
              const index = nodes.findIndex(n => n.id === nodeId);
              if (index !== -1) {
                nodes.splice(index, 1);
                return true;
              }
              return nodes.some(n => deleteRecursively(n.children, nodeId));
            };

            deleteRecursively(this.treeItems, node.id);
          } catch (error) {
            console.error('Error al eliminar el nodo:', error);
          }
    },
    closeModal() {
      this.modals.addNode = false;
    },
    openDeleteConfirmation(node: TreeNodeDto) {
      this.nodeToDelete = node;
      this.modals.deleteNode = true;
    }
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

