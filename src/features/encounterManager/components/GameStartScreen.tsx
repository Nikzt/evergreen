import combatAbilities from '../../combat/abilities/combatAbilities';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { beginPlayerTurn, initCombatEncounter, setDifficulty } from '../../combat/state/combatSlice';
import { getStarterEncounter } from '../encounters';
import './gameStartScreen.scss';
import { onBeginPlayerTurn } from '../../combat/state/beginPlayerTurn';

const GameStartScreen = () => {
    const dispatch = useAppDispatch();
    const difficulty = useAppSelector((state) => state.combat.difficulty);
    const onBeginCombatClick = () => {
        dispatch(setDifficulty(1));
        dispatch(initCombatEncounter(getStarterEncounter()));
        onBeginPlayerTurn();
    };
    return (
        <div className="game-start-screen">
            <h1 className="game-title">EVERGREEN</h1>
            {difficulty > 1 && <p className="enemy-wave-counter">You defeated {difficulty} waves of enemies.</p>}
            <button className="menu-button" onClick={onBeginCombatClick}>
                Begin Combat
            </button>
            <div className="about-section">
                <p>A game by Bence Linder</p>
                <p>
                    <a href="https://github.com/nikzt/evergreen">GitHub</a>
                </p>
            </div>
        </div>
    );
};

export default GameStartScreen;
