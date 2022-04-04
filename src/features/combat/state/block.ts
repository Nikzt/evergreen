import { timeout, wait } from '../../../common/timeout';
import { store } from '../../../store';
import {  selectCanUseAnyAbilities, selectUnit } from './combatSelectors';
import { updateUnit } from './combatSlice';
import recover from './recover';

const getUnit = (sourceUnitId: string) => {
    const state = store.getState();
    const unit = selectUnit(sourceUnitId)(state);
    return unit;
}

export const block = async (sourceUnitId: string) => {
    const state = store.getState();
    const unit = selectUnit(sourceUnitId)(state);
    if (!unit || !selectCanUseAnyAbilities(sourceUnitId)(state)) return;

    store.dispatch(
        updateUnit({
            id: sourceUnitId,
            changes: {
                isBlocking: true,
                isBlockSuccessful: false
            },
        }),
    );

    const blockTickCallback = (currTime: number, blockTime: number) => {
        const blockingProgress = Math.ceil((currTime / blockTime) * 100);
        store.dispatch(
            updateUnit({
                id: sourceUnitId,
                changes: {
                    blockingProgress,
                },
            }),
        );
    };

    console.log("begin blocking");
    await timeout(blockTickCallback, unit.blockDuration * 1000);
    store.dispatch(
        updateUnit({
            id: sourceUnitId,
            changes: {
                isBlocking: false,
                blockingProgress: 0,
            },
        }),
    );

    console.log("done blocking");
    const unitAfterBlock = getUnit(sourceUnitId);

    // Only enter recovery if unit didn't block anything
    if (unitAfterBlock?.isBlockSuccessful) {
        await wait(2000);
        store.dispatch(updateUnit({id: sourceUnitId, changes: {isRevengeEnabled: false}}))
    }
    else {
        recover(sourceUnitId, 2);
    }

};
