// utils/pathUtils.ts

import { TreeNodeDto } from '@/services/types';

export function createFullPath(node: TreeNodeDto, username: string, nodesMap: Map<number, TreeNodeDto>): string {
  const paths: string[] = [];
  let currentNode: TreeNodeDto | undefined = node;

  // Recorremos desde el nodo actual hacia arriba en la jerarquía
  while (currentNode) {
    paths.unshift(currentNode.name); // Agregamos el nombre del nodo al inicio de la lista de paths
    if (currentNode.parentId) {
      currentNode = nodesMap.get(currentNode.parentId); // Obtenemos el nodo padre
    } else {
      break;
    }
  }

  // Agregamos el nombre del usuario al inicio del path
  paths.unshift(username);

  return paths.join('/'); // Unimos todo para formar la ruta completa
}
