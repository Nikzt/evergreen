import { timeout } from '../../../common/timeout';
import { store } from '../../../store';
import { selectUnit } from './combatSelectors';
import { updateUnit } from './combatSlice';

export const block = async (sourceUnitId: string) => {
    const state = store.getState();
    const unit = selectUnit(sourceUnitId)(state);
    if (!unit) return;

    store.dispatch(
        updateUnit({
            id: sourceUnitId,
            changes: {
                isBlocking: true,
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

    console.log(unit.blockDuration);
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
    console.log('block false ?');
};
