// Part: src/inversify.config.ts

// src/inversify.config.ts
import { Container } from 'inversify';
import { ITimeSystem } from '@src/interfaces';
import { TIME_SYSTEM } from '@src/constants';
import { TimeSystem } from '@src/ecs/systems/TimeSystem';

const container = new Container();

container.bind<ITimeSystem>(TIME_SYSTEM).to(TimeSystem).inSingletonScope();

export default container;
