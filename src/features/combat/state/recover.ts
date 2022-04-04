import { timeout } from "../../../common/timeout";
import { store } from '../../../store';
import { updateUnit } from "./combatSlice";

// recovery time after using ability
const recoveryTickCallback = (unitId: string) => (currTime: number, recoveryTime: number) => {
    const recoveryProgress = Math.ceil((currTime / recoveryTime) * 100);
    store.dispatch(
        updateUnit({
            id: unitId,
            changes: {
                recoveryProgress,
            },
        }),
    );
};

const recover = async (unitId: string, recoveryTimeInSec: number) => {
    store.dispatch(updateUnit({
        id: unitId,
        changes: {
            isRecovering: true
        }
    }))
    await timeout(recoveryTickCallback(unitId), recoveryTimeInSec * 1000);
    store.dispatch(updateUnit({
        id: unitId,
        changes: {
            isRecovering: false,
            recoveryProgress: 0
        }
    }))
}

export default recover;