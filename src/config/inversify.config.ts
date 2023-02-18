import { Container } from 'inversify';
import { TYPES } from '../constants/types';
import PlayerInput from '../components/playerInput';
import GridEngineController from '../components/gridEngineController';
import ObjectMovement from '../components/objectMovement';

let container = new Container();
container.bind<ObjectMovement>(TYPES.ObjectMovement).to(ObjectMovement);
container.bind<PlayerInput>(TYPES.PlayerInput).to(PlayerInput);
//container.bind(PlayerInput).toSelf();
container.bind<GridEngineController>(TYPES.GridEngineController).to(GridEngineController).inSingletonScope();
container.onActivation(TYPES.GridEngineController, (context: interfaces.Context, gridEngineController: GridEngineController): GridEngineController => {
    console.log('controller instance activation!');
    return gridEngineController;
});
export default container;
