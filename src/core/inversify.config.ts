// Part: src/core/inversify.config.ts

// Part: src/inversify.config.ts

import { Container } from 'inversify';
import { ITimeSystem } from '@src/utils/interfaces';
import { TIME_SYSTEM } from '@src/utils/constants';
import { TimeSystem } from '@src/ecs/systems/timeSystem';

const container = new Container();

container.bind<ITimeSystem>(TIME_SYSTEM).to(TimeSystem).inSingletonScope();

export default container;
