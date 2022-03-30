import combatAbilities from "../../common/combatAbilities";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { store } from "../../store";
import { initCombatEncounter, selectFriendlyUnits } from "../combat/combatSlice";
import HpBar from "../combat/HpBar";
import { getStarterEncounter, randomEncounterGenerator } from "./encounters";
import EnemyController from "./enemyController";

const UnitManagerScreen = () => {
    const dispatch = useAppDispatch();
    const friendlyUnits = useAppSelector(selectFriendlyUnits);

    const onBeginCombatClick = () => {
        const state = store.getState();
        const difficulty = state.combat.difficulty;
        const friendlyUnits = selectFriendlyUnits(state);

        dispatch(initCombatEncounter(randomEncounterGenerator(difficulty, friendlyUnits)));
        EnemyController.initEnemies();
    }

    return <div>
        <p>You have bought yourself some time, but more creatures approach.</p>
        <button onClick={onBeginCombatClick}>Begin Combat</button>

        <h2>Character Info</h2>
        <div className="character-info-container">
            {friendlyUnits.map(u =>
                <div key={u.id} className="character-info">
                    <h3>{u.name}</h3>
                    <HpBar hp={u.hp} maxHp={u.maxHp} isFriendly={true}/>

                    <h3>Stats</h3>
                    <ul>
                        <li>Strength: {u.strength}</li>
                        <li>Armor: {u.armor}</li>
                        <li>Block: {u.block}</li>
                        <li>Weapon Damage: {u.weaponDamage}</li>
                    </ul>

                    <h3>Abilities</h3>
                    <ul>
                        {u.abilityIds.map(aid =>
                            <li>
                                {combatAbilities[aid].name}
                            </li>
                        )}
                    </ul>

                </div>
            )}
        </div>
    </div>
}

export default UnitManagerScreen;