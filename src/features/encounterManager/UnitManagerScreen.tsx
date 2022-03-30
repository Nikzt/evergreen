import combatAbilities from '../../common/combatAbilities';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { store } from '../../store';
import {
    CombatUnit,
    initCombatEncounter,
    selectAvailableRewards,
    selectFriendlyUnits,
    selectRewardCurrency,
    selectScriptedText,
    updateUnitWithReward,
} from '../combat/combatSlice';
import HpBar from '../combat/HpBar';
import { randomEncounterGenerator } from './encounters';
import EnemyController from './enemyController';
import { Reward } from './rewards';

const UnitManagerScreen = () => {
    const dispatch = useAppDispatch();
    const friendlyUnits = useAppSelector(selectFriendlyUnits);
    const rewardCurrency = useAppSelector(selectRewardCurrency);
    const availableRewards = useAppSelector(selectAvailableRewards);
    const scriptedText = useAppSelector(selectScriptedText);

    const onBeginCombatClick = () => {
        const state = store.getState();
        const difficulty = state.combat.difficulty;
        const friendlyUnits = selectFriendlyUnits(state);

        dispatch(initCombatEncounter(randomEncounterGenerator(difficulty, friendlyUnits)));
        EnemyController.initEnemies();
    };

    const onRewardClick = (unit: CombatUnit, reward: Reward) => {
        dispatch(
            updateUnitWithReward({
                unitId: unit.id,
                reward,
            }),
        );
    };

    return (
        <div className="unit-manager-screen">
            <h1>Victory!</h1>
            <p>You have bought yourself some time, but more creatures approach.</p>

            <hr></hr>
            <p>{scriptedText}</p>
            <hr></hr>

            <h2>Upgrade Characters</h2>
            <h3>Gold: {rewardCurrency}</h3>
            <div className="character-info-container">
                {friendlyUnits.map((u) => (
                    <div key={u.id} className="character-info">
                        <h3>{u.name}</h3>
                        <HpBar hp={u.hp} maxHp={u.maxHp} isFriendly={true} />

                        <h3>Stats</h3>
                        <ul>
                            <li>Strength: {u.strength}</li>
                            <li>Armor: {u.armor}</li>
                            <li>Block: {u.block}</li>
                            <li>Weapon Damage: {u.weaponDamage}</li>
                        </ul>

                        <h3>Abilities</h3>
                        <ul>
                            {u.abilityIds.map((aid) => (
                                <li key={aid}>{combatAbilities[aid].name}</li>
                            ))}
                        </ul>

                        <div className="rewards-container">
                            <h3>Upgrades</h3>
                            {availableRewards.map((r) => (
                                <label key={r.type}>
                                    <button disabled={r.cost > rewardCurrency} onClick={() => onRewardClick(u, r)}>
                                        {r.label}
                                    </button>
                                    {r.cost}G
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={onBeginCombatClick}>Begin Combat</button>
        </div>
    );
};

export default UnitManagerScreen;
