import item_groups from '@src/config/objects.json';
import { getLogger } from '@src/telemetry/logger';
import { IDrop, IItemGroup } from '@src/config/interfaces';

export class LootTable {
  private readonly itemGroups: IItemGroup;
  private logger = getLogger('entity');

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
        if (roll <= drop.drop_chance) {
          drops.push(drop.id);
        }
      }
    });

    return drops;
  }
}
