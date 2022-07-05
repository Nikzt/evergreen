import { store } from '../../../store';
import { toggleTaunt } from './combatSlice';

const taunt = (sourceUnitId: string) => {
    store.dispatch(toggleTaunt(sourceUnitId));
};

export default taunt;
