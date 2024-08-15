// src/stores/treeStore.ts
import { defineStore } from 'pinia';
import { client } from "../services/dispatch-client";
import { TreeNodeDto } from "../services/types";
import { createFullPath } from '@/utils/pathUtils';

export const useTreeStore = defineStore('treeStore', {
  state: () => ({
    treeItems: [] as TreeNodeDto[],
    open: [] as number[],  
  }),
  actions: {
    setTreeItems(items: TreeNodeDto[]) {
      this.treeItems = items;
    },
    async fetchUserNodes(userId: number) {
      try {
        const response = await client.getUserNodes(userId);
        this.treeItems = this.transformNodes(response.response);
      } catch (error) {
        console.error('Error fetching user nodes:', error);
      }
    },
    transformNodes(nodes: TreeNodeDto[]): TreeNodeDto[] {
      const map: { [key: number]: TreeNodeDto } = {};
      const roots: TreeNodeDto[] = [];

      nodes.forEach(node => {
        map[node.id!] = { ...node, children: [] };
      });

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
    generateFullPath(node: TreeNodeDto, userName: string): string {
      const nodesMap = this.buildNodesMap(this.treeItems);
      return createFullPath(node, userName, nodesMap);
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
    async addNode(newNodeData: TreeNodeDto, file: File | null, userName: string) {
      const newNodeId = await client.createNode(newNodeData);

      if (newNodeData.isFile && file) {
        const nodesMap = this.buildNodesMap([...this.treeItems, newNodeData]);
        const fullPath = createFullPath(newNodeData, userName, nodesMap);
        const formData = new FormData();
        formData.append('file', file); 
        formData.append('path', fullPath);
        await client.postFile("Files/upload", formData);
      }

      const newNode: TreeNodeDto = {
        id: newNodeId.response,
        ...newNodeData,
        children: [],
      };

      if (newNode.parentId === null) {
        this.treeItems.push(newNode);
      } else {
        const parentNode = this.findNodeById(newNode.parentId!);
        if (parentNode) {
          parentNode.children.push(newNode);
        } else {
          console.warn(`No se encontró el nodo padre con id ${newNode.parentId}`);
        }
      }
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
    async deleteNode(node: TreeNodeDto) {
      if (node.id === undefined) {
        console.error('El ID del nodo es indefinido, no se puede eliminar el nodo.');
        return;
      }

      try {
        if (node.children && node.children.length > 0) {
          await client.deleteNodeWithChildren(node.id);
        } else {
          await client.deleteNode(node.id);
        }

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
    }
  },
});
