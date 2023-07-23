const entityNames = new Map<number, string>();

export function setEntityName(entityId: number, name: string) {
  entityNames.set(entityId, name);
}

export function getEntityName(entityId: number) {
  const name = entityNames.get(entityId);
  if (!name) {
    throw new Error(`Entity ${entityId} has no name`);
  }
  return name;
}

export function removeEntityName(entityId: number) {
  entityNames.delete(entityId);
}

export function getEntityNameWithID(entityId: number) {
  return `${getEntityName(entityId)} (${entityId})`;
}
