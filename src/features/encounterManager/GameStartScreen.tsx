import { useAppDispatch } from "../../hooks";
import { initCombatEncounter } from "../combat/combatSlice";
import { getStarterEncounter, randomEncounterGenerator } from "./encounters";
import EnemyController from "./enemyController";


const GameStartScreen = () => {
    const dispatch = useAppDispatch();
    const onBeginCombatClick = () => {
        dispatch(initCombatEncounter(getStarterEncounter()));
        EnemyController.initEnemies();
    }
    return <div className="game-start-screen">
        <p>Your work has drawn the attention of the creatures in the Evergreen.</p>
        <button onClick={onBeginCombatClick}>Begin Combat</button>
    </div>
}

export default GameStartScreen;