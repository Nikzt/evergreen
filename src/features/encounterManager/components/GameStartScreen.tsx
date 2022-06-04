import combatAbilities from '../../combat/abilities/combatAbilities';
import { useAppDispatch } from '../../../hooks';
import { initCombatEncounter } from '../../combat/state/combatSlice';
import { getStarterEncounter } from '../encounters';
import EnemyController from '../enemyController';
import './gameStartScreen.scss';

const GameStartScreen = () => {
    const dispatch = useAppDispatch();
    const onBeginCombatClick = () => {
        dispatch(initCombatEncounter(getStarterEncounter()));
        EnemyController.initEnemies();
    };
    return (
        <div className="game-start-screen">
            <p>Your presence has drawn the attention of the creatures in the Evergreen.</p>
            <button onClick={onBeginCombatClick}>Begin Combat</button>
            <h3>Instructions</h3>
            {Object.values(combatAbilities).map(ability => <div className="ability-description-row">
                <img src={ability.icon} />
                <div>{ability.name}: {ability.description}</div>
            </div>
            )}
        </div>
    );
};

export default GameStartScreen;
