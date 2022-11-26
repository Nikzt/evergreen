import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { initCombatEncounter, setDifficulty } from '../../../combat/state/combatSlice';
import { getStarterEncounter } from '../../encounters';
import { onBeginPlayerTurn } from '../../../combat/state/beginPlayerTurn';
import './gameStartScreen.scss';
import { beginDialog } from '../../../dialog/state/dialogSlice';

const GameStartScreen = () => {
    const dispatch = useAppDispatch();
    const difficulty = useAppSelector((state) => state.combat.difficulty);
    const onBeginCombatClick = () => {
        dispatch(setDifficulty(1));
        const starterEncounter = getStarterEncounter();
        dispatch(initCombatEncounter(starterEncounter));
        if (starterEncounter.dialogId != null) {
            dispatch(beginDialog(starterEncounter.dialogId));
            onBeginPlayerTurn(true);
        } else {
            onBeginPlayerTurn();
        }
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
