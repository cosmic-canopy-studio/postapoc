import item_groups from '@src/entity/data/objects.json';
import { getLogger } from '@src/telemetry/systems/logger';
import { IDrop, IItemGroup } from '@src/entity/data/interfaces';

export class LootDrops {
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
