import combatAbilities from '../../combat/abilities/combatAbilities';
import { useAppDispatch } from '../../../hooks';
import { beginPlayerTurn, initCombatEncounter } from '../../combat/state/combatSlice';
import { getStarterEncounter } from '../encounters';
import './gameStartScreen.scss';
import { onBeginPlayerTurn } from '../../combat/state/beginPlayerTurn';

const GameStartScreen = () => {
    const dispatch = useAppDispatch();
    const onBeginCombatClick = () => {
        dispatch(initCombatEncounter(getStarterEncounter()));
        onBeginPlayerTurn();
    };
    return (
        <div className="game-start-screen">
            <h1 className="game-title">EVERGREEN</h1>
            <button className="menu-button" onClick={onBeginCombatClick}>
                Begin Combat
            </button>
            <div className="about-section">
                <p>A game by Bence Linder</p>
                <p><a href="https://github.com/nikzt/evergreen">GitHub</a></p>

            </div>
        </div>
    );
};

export default GameStartScreen;
