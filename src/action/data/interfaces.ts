export interface ActionResult {
  message: string;
}

export interface IAction {
  name: string;

  execute(entity: number): ActionResult;
}

export default class Action implements IAction {
  constructor(
    public name: string,
    public execute: (entity: number) => ActionResult
  ) {}
}
