import { Direction } from "grid-engine";

export default interface IMovement {
    move(object: string, direction: Direction): void;
}
