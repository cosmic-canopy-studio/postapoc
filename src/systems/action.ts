import { Actor, Interactable } from '../entities';
import { log } from '../utilities';

export enum Actions {
    attack = 'attack',
    moveUp = 'moveUp',
    moveLeft = 'moveLeft',
    moveDown = 'moveDown',
    moveRight = 'moveRight'
}

export enum Directions {
    up = 'up',
    left = 'left',
    down = 'down',
    right = 'right'
}

export class Action {
    static performAction(action: Actions, actor: Actor) {
        switch (action) {
            case Actions.attack:
                this.attack(actor);
                break;
            case Actions.moveUp:
                this.move(actor, Directions.up);
                break;
            case Actions.moveDown:
                this.move(actor, Directions.down);
                break;
            case Actions.moveLeft:
                this.move(actor, Directions.left);
                break;
            case Actions.moveRight:
                this.move(actor, Directions.right);
                break;
        }
    }

    static resetAction(action: Actions, controlledActor: Actor) {
        switch (action) {
            case Actions.attack:
                break;
            case Actions.moveUp:
            case Actions.moveDown:
            case Actions.moveLeft:
            case Actions.moveRight:
                controlledActor.sprite?.setDrag(200, 200);
        }
    }

    static takeDamage(interactable: Interactable, damage = 1) {
        interactable.health -= damage;
        log.info(
            `${interactable.id} took ${damage} damage, health is now ${interactable.health}`
        );
    }

    static attack(attacker: Actor) {
        const focusInteractable = attacker.getFocus();
        if (focusInteractable) {
            this.takeDamage(focusInteractable, attacker.getDamage());
            attacker.sprite?.play(`action-${attacker.getDirection()}`);
            if (focusInteractable.health <= 0) {
                attacker.clearCurrentFocus();
            }
        } else {
            log.debug(`${attacker.id} has no focus to attack`);
        }
    }

    static move(interactable: Interactable, direction: Directions) {
        if (interactable.sprite) {
            const normalizedVelocity = this.calcVelocity(direction);
            interactable.sprite.setVelocity(
                normalizedVelocity.x * interactable.getSpeed(),
                normalizedVelocity.y * interactable.getSpeed()
            );
            interactable.setDirection(direction);
            if (interactable instanceof Actor) {
                interactable.sprite.play(`walk-${direction}`, true);
                interactable.sprite.setDrag(0, 0);
                if (interactable.clearCurrentFocus) {
                    interactable.clearCurrentFocus();
                }
            }
        }
    }

    static calcVelocity(direction: string) {
        const velocity = new Phaser.Math.Vector2(0, 0);
        switch (direction) {
            case 'up':
                velocity.y -= 1;
                break;
            case 'down':
                velocity.y += 1;
                break;
            case 'left':
                velocity.x -= 1;
                break;
            case 'right':
                velocity.x += 1;
                break;
        }
        return velocity.normalize();
    }

    static stop(interactable: Interactable) {
        if (interactable.sprite) {
            interactable.sprite.setVelocity(0, 0);
            interactable.sprite.play(
                `idle-${interactable.getDirection()}`,
                true
            );
        }
    }
}
