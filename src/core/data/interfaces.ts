export interface ControlMapping {
  [type: string]: Record<string, string>;
}

export interface IHandler {
  initialize(): void;
}

export interface IUpdatableHandler extends IHandler {
  update(): void;
}
