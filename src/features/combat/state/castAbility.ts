import combatAbilities, { CombatAbility } from "../../../common/combatAbilities";
import { timeout } from "../../../common/timeout";
import { store } from "../../../store";
import { CombatAction } from "./combatModels";
import { updateUnit } from "./combatSlice";


const castTickCallback = (unitId: string) =>  (currTime: number, castTime: number) => {
    const castProgress = Math.ceil((currTime / castTime) * 100);
    store.dispatch(
        updateUnit({
            id: unitId,
            changes: {
                castProgress,
            },
        }),
    );
};

const castAbility = async (combatAction: CombatAction) => {
    const ability = combatAbilities[combatAction.abilityId];

    if (ability.castTimeInSec > 0) {
        // start casting ability
        store.dispatch(
            updateUnit({
                id: combatAction.sourceUnitId,
                changes: {
                    isCasting: true,
                    castingAbility: ability.id,
                    targetUnitId: combatAction.targetUnitId,
                },
            }),
        );

        await timeout(castTickCallback(combatAction.sourceUnitId), ability.castTimeInSec * 1000);
        return;
    }
    return;
}

export default castAbility;