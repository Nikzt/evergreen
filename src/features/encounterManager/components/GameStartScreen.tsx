import combatAbilities from '../../combat/abilities/combatAbilities';
import { useAppDispatch } from '../../../hooks';
import { beginPlayerTurn, initCombatEncounter } from '../../combat/state/combatSlice';
import { getStarterEncounter } from '../encounters';
import './gameStartScreen.scss';

const GameStartScreen = () => {
    const dispatch = useAppDispatch();
    const onBeginCombatClick = () => {
        dispatch(initCombatEncounter(getStarterEncounter()));
        dispatch(beginPlayerTurn());
    };
    return (
        <div className="game-start-screen">
            <h1 className="game-title">EVERGREEN</h1>
            <button className="menu-button" onClick={onBeginCombatClick}>
                Begin Combat
            </button>
        </div>
    );
};

export default GameStartScreen;
