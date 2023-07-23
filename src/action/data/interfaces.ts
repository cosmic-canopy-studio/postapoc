import { ActionEventOptions } from '@src/action/data/events';
import { ActionResult } from '@src/action/data/types';

export interface IAction {
  name: string;

  execute(entity: number): ActionResult;
}

export default class Action implements IAction {
  constructor(
    public name: string,
    public execute: (
      entity: number,
      options?: ActionEventOptions
    ) => ActionResult
  ) {}
}
