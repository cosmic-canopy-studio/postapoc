const entityNames = new Map<number, string>();

export function setEntityName(entityId: number, name: string) {
  entityNames.set(entityId, name);
}

// Function to get the friendly name of an entity
export function getEntityName(entityId: number) {
  return entityNames.get(entityId);
}

export function removeEntityName(entityId: number) {
  entityNames.delete(entityId);
}

export function getEntityNameWithID(entityId: number) {
  return `${getEntityName(entityId)} (${entityId})`;
}
