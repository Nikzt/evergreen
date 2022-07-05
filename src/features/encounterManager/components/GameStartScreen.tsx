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
            <p>Your presence has drawn the attention of the creatures in the Evergreen.</p>
            <button className="menu-button" onClick={onBeginCombatClick}>
                Begin Combat
            </button>
            <h3>Instructions</h3>
            {Object.values(combatAbilities).map((ability) => (
                <div className="ability-description-row" key={ability.id}>
                    <img src={ability.icon} alt="missing ability icon" />
                    <div>
                        {ability.name}: {ability.description}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GameStartScreen;
