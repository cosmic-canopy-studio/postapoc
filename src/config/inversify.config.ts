import { Container } from 'inversify';
import { TYPES } from '../constants/types';
import PlayerInput from '../components/playerInput';
import ObjectMovement from '../components/objectMovement';

let container = new Container();
container.bind<ObjectMovement>(TYPES.ObjectMovement).to(ObjectMovement);
container.bind<PlayerInput>(TYPES.PlayerInput).to(PlayerInput);
export default container;
