import { store } from "../../../store"
import EnemyController from "../../encounterManager/enemyController";
import { beginEnemyTurn } from "./combatSlice"

export const onBeginEnemyTurn = () => { 
    store.dispatch(beginEnemyTurn());
    EnemyController.beginTurn();
}
