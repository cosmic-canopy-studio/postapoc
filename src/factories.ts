// Part: src/factories.ts

// src/factories.ts
import { Scene } from 'phaser';
import { TimeController } from '@src/phaser/systems/TimeController';
import { Emitter } from 'mitt';

export function createTimeControllerFactory(emitter: Emitter) {
  return (scene: Scene): TimeController => {
    return new TimeController(scene, emitter);
  };
}
