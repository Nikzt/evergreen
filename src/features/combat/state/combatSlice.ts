import { createSlice, PayloadAction, Update } from '@reduxjs/toolkit';
import combatAbilities, { CombatAbility, CombatAbilityType } from '../../../common/combatAbilities';
import { CombatEncounter } from '../../encounterManager/encounters';
import { getRandomRewards } from '../../encounterManager/rewards';
import { getScriptedRewards } from '../../encounterManager/scriptedRewards';
import { CombatAction, CombatState, CombatUnit, RewardUpdate, unitsAdapter } from './combatModels';

/**
 * Clears everything that shouldn't carry over to next combat
 */
const clearCombatState = (state: CombatState) => {
    state.units.entities = {};
    state.units.ids = [];
    state.isTargeting = false;
    state.targetingAbilityId = null;
    state.targetingSourceUnitId = null;
    state.isCombatInProgress = false;
    state.isCombatFailed = false;
    state.isCombatVictorious = false;
};

/**
 * Handle state changes for units that have died (ie. HP <= 0)
 */
const checkDeadEnemies = (state: CombatState) => {
    Object.values(state.units.entities).forEach((u) => {
        if (u && u.hp <= 0) {
            u.hp = 0;
            u.isDead = true;
            u.isCasting = false;

            // If this unit was blocking another unit, that unit will no longer be blocked
            if (u.blocking) {
                const blockingUnit = state.units.entities[u.blocking];
                if (blockingUnit) blockingUnit.blockedBy = null;
            }
            u.blockedBy = null;
            u.blocking = null;
        }
    });
};

export const calculateAbilityDamage = (
    sourceUnit: CombatUnit,
    targetUnit: CombatUnit,
    ability: CombatAbility,
): number => {
    const damageBeforeBlock = Math.max(
        Math.ceil(
            sourceUnit.weaponDamage * ability.weaponDamageMultiplier +
                sourceUnit.strength * ability.strengthMultiplier -
                targetUnit.armor,
        ),
        0,
    );
    if (sourceUnit.blockedBy) return Math.max(0, damageBeforeBlock - targetUnit.block);
    return damageBeforeBlock;
};

const initialState: CombatState = {
    isTargeting: false,
    targetingAbilityId: null,
    targetingSourceUnitId: null,
    units: unitsAdapter.getInitialState(),
    isCombatInProgress: false,
    isCombatFailed: true,
    isCombatVictorious: false,
    difficulty: 0,
    rewardCurrency: 0,
    availableRewards: [],
    scriptedText: '',
};
export const combatSlice = createSlice({
    name: 'combat',
    initialState,
    reducers: {
        initTargetingAbility: (state, action: PayloadAction<CombatAction>) => {
            state.isTargeting = true;
            state.targetingAbilityId = action.payload.abilityId;
            state.targetingSourceUnitId = action.payload.sourceUnitId;
        },
        initCombatEncounter: (state, action: PayloadAction<CombatEncounter>) => {
            clearCombatState(state);
            unitsAdapter.addMany(state.units, action.payload.units);
            state.isCombatInProgress = true;
        },

        /**  Combat Defeat: Anything that needs to be hard reset, do it here */
        setDefeatState: (state) => {
            if (!state.isCombatInProgress) return;
            state.isCombatVictorious = false;
            state.isCombatFailed = true;
            state.isCombatInProgress = false;
            state.difficulty = 0;
            state.rewardCurrency = 0;
        },

        /**  Combat Victory: Reset combat for next encounter, but don't reset things that continue through run */
        setVictoryState: (state) => {
            if (!state.isCombatInProgress) return;
            const livingFriendlyUnits = Object.values(state.units.entities).filter((u) => u?.isFriendly && !u.isDead);
            state.isCombatVictorious = true;
            state.isCombatFailed = false;
            state.isCombatInProgress = false;
            state.difficulty += 0.5;
            livingFriendlyUnits.forEach((u) => {
                if (u) u.combatNumbers = [];
            });

            // Post combat rewards
            getScriptedRewards(state);
            state.rewardCurrency += 1 + Math.floor(state.difficulty);
            state.availableRewards = getRandomRewards(2);
        },
        updateUnit: (state, action: PayloadAction<Update<CombatUnit>>) => {
            unitsAdapter.updateOne(state.units, action.payload);
        },
        updateUnitWithReward: (state, action: PayloadAction<RewardUpdate>) => {
            const reward = action.payload.reward;
            const unit = state.units.entities[action.payload.unitId];
            if (unit && state.rewardCurrency >= reward.cost) {
                const changes: Partial<CombatUnit> = {};
                for (const prop in reward.update) {
                    // @ts-ignore
                    changes[prop] = unit[prop] + reward.update[prop];
                }
                unitsAdapter.updateOne(state.units, {
                    id: unit.id,
                    changes,
                });
                state.rewardCurrency -= reward.cost;
            }
        },
        setTargetingMode: (state, action: PayloadAction<boolean>) => {
            state.isTargeting = action.payload;
            state.targetingAbilityId = null;
            state.targetingSourceUnitId = null;
        },
        spendRewardCurrency: (state, action: PayloadAction<number>) => {
            if (state.rewardCurrency >= action.payload) state.rewardCurrency -= action.payload;
        },
        performCombatAction: (state, action: PayloadAction<CombatAction>) => {
            if (!action?.payload) return;
            const source = state.units.entities[action.payload.sourceUnitId];
            const target = state.units.entities[action.payload.targetUnitId];
            const ability = combatAbilities[action.payload.abilityId];
            if (!target || !ability || !source || source.isDead) return;

            source.isCasting = false;
            source.castingAbility = null;
            source.castProgress = 0;
            source.targetUnitId = null;

            // Damage ability
            switch (ability.id) {
                case CombatAbilityType.BLOCK:
                    source.blocking = target.id;
                    target.blockedBy = source.id;
                    break;
                default:
                    if (source.blockedBy) {
                        const newTarget = state.units.entities[source.blockedBy];
                        if (!newTarget) break;
                        const damage = calculateAbilityDamage(source, newTarget, ability);
                        newTarget.hp -= damage;
                        source.blockedBy = null;
                        newTarget.blocking = null;
                        newTarget.combatNumbers.push(damage);
                    } else {
                        const damage = calculateAbilityDamage(source, target, ability);
                        target.hp -= damage;
                        target.combatNumbers.push(damage);
                    }
            }
            checkDeadEnemies(state);
        },
        clearOldestCombatNumber: (state, action: PayloadAction<string>) => {
            const unitId = action.payload;
            const unit = state.units.entities[unitId];
            if (unit && unit.combatNumbers.length > 3) unit?.combatNumbers.splice(0, 1);
        },
        cancelBlock: (state, action: PayloadAction<string>) => {
            const unit = state.units.entities[action.payload];
            if (!unit || !unit.blocking) return;
            const blockTarget = state.units.entities[unit.blocking];
            unit.blocking = null;
            if (blockTarget?.blockedBy) blockTarget.blockedBy = null;
        },
    },
});

export const {
    initTargetingAbility,
    updateUnit,
    performCombatAction,
    initCombatEncounter,
    setTargetingMode,
    clearOldestCombatNumber,
    cancelBlock,
    setDefeatState,
    setVictoryState,
    updateUnitWithReward,
} = combatSlice.actions;

export default combatSlice.reducer;