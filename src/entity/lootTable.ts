// Part: src/core/systems/lootTable.ts
// Code Reference:
// Documentation:

import item_groups from '@src/config/item_groups.json';
import { getLogger } from '@src/telemetry/logger';
import { IDrop, IItemGroup } from '@src/config/interfaces';

export class LootTable {
  private itemGroups: IItemGroup;
  private logger = getLogger('lootTable');

  constructor() {
    this.itemGroups = item_groups as IItemGroup;
  }

  generateDrops(groupName: string): string[] {
    const group = this.itemGroups[groupName];
    if (!group) {
      this.logger.warn(`No item group found for ${groupName}`);
      return [];
    }

    const drops: string[] = [];
    group.forEach((drop: IDrop) => {
      for (let i = 0; i < drop.count; i++) {
        const roll = Math.random() * 100;
        if (roll <= drop.weight) {
          drops.push(drop.id);
        }
      }
    });

    return drops;
  }
}
