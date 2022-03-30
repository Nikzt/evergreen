import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    EntityState,
    PayloadAction,
    Update,
} from '@reduxjs/toolkit';
import combatAbilities, { CombatAbility, CombatAbilityType } from '../../common/combatAbilities';
import { timeout } from '../../common/timeout';
import { RootState } from '../../store';
import { CombatEncounter } from '../encounterManager/encounters';
import { getRandomRewards, Reward } from '../encounterManager/rewards';
import { getScriptedRewards } from '../encounterManager/scriptedRewards';

export type CombatAction = {
    sourceUnitId: string;
    targetUnitId: string;
    abilityId: CombatAbilityType;
};

export type CombatUnit = {
    // State
    hp: number;
    isFriendly: boolean;

    isRecovering: boolean;
    isCasting: boolean;
    castingAbility: CombatAbilityType | null;
    targetUnitId: string | null;

    blockedBy: string | null;
    blocking: string | null;
    castProgress: number;
    recoveryProgress: number;
    combatNumbers: number[];
    isDead: boolean;

    // Config
    id: string;
    name: string;

    //Stats / Loadout
    abilityIds: CombatAbilityType[];
    maxHp: number;
    weaponDamage: number;
    strength: number;
    armor: number;
    block: number;
};

export type CombatState = {
    isCombatInProgress: boolean;
    difficulty: number;
    isCombatVictorious: boolean;
    isCombatFailed: boolean;

    // Post-combat rewards
    rewardCurrency: number;
    availableRewards: Reward[];
    scriptedText: string;

    // Targeting logic should only be used for friendly units!
    // Make sure to bypass this system when getting enemies to target, otherwise
    // player and enemy targets may conflict
    isTargeting: boolean;
    targetingAbilityId: CombatAbilityType | null;
    targetingSourceUnitId: string | null;

    units: EntityState<CombatUnit>;
};

export const unitsAdapter = createEntityAdapter<CombatUnit>({ selectId: (unit) => unit.id });

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

enum CombatOutcome {
    IN_PROGRESS = 0,
    VICTORY,
    DEFEAT,
}

/**
 * End the game if all player characters are dead or all enemies are dead
 */
const checkEndCombat = (state: CombatState): CombatOutcome => {
    const livingUnits = Object.values(state.units.entities).filter((u) => !u?.isDead);
    const livingFriendlyUnits = livingUnits.filter((u) => u?.isFriendly);
    const livingEnemyUnits = livingUnits.filter((u) => !u?.isFriendly);

    if (livingFriendlyUnits.length <= 0) {
        return CombatOutcome.DEFEAT;
    } else if (livingEnemyUnits.length <= 0) {
        return CombatOutcome.VICTORY;
    }
    return CombatOutcome.IN_PROGRESS;
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

type RewardUpdate = {
    unitId: string;
    reward: Reward;
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
            if (!state.isCombatInProgress)
                return;
            state.isCombatVictorious = false;
            state.isCombatFailed = true;
            state.isCombatInProgress = false;
            state.difficulty = 0;
            state.rewardCurrency = 0;
        },

        /**  Combat Victory: Reset combat for next encounter, but don't reset things that continue through run */
        setVictoryState: (state) => {
            if (!state.isCombatInProgress)
                return;
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

export const targetAbility = createAsyncThunk(
    'combat/targetAbility',
    async (combatAction: CombatAction, { getState, dispatch }) => {
        const state = getState() as RootState;

        const ability = combatAbilities[combatAction.abilityId];
        const sourceUnit = state.combat.units.entities[combatAction.sourceUnitId];
        const targetUnit = state.combat.units.entities[combatAction.targetUnitId];

        if (!ability || !sourceUnit || !targetUnit || !selectCanUseAbility(sourceUnit.id)(state)) return;

        if (sourceUnit.isFriendly) dispatch(setTargetingMode(false));

        const castTickCallback = (currTime: number, castTime: number) => {
            const castProgress = Math.ceil((currTime / castTime) * 100);
            dispatch(
                updateUnit({
                    id: sourceUnit.id,
                    changes: {
                        castProgress,
                    },
                }),
            );
        };

        if (ability.castTimeInSec > 0) {
            // start casting ability
            dispatch(
                updateUnit({
                    id: sourceUnit.id,
                    changes: {
                        isCasting: true,
                        castingAbility: combatAction.abilityId,
                        targetUnitId: combatAction.targetUnitId,
                    },
                }),
            );

            await timeout(castTickCallback, ability.castTimeInSec * 1000);
        }

        dispatch(performCombatAction(combatAction));
        dispatch(cancelBlock(combatAction.targetUnitId));

        // Check if combat has ended based on results of action
        const stateAfterCombatAction = getState() as RootState;
        const combatOutcome = checkEndCombat(stateAfterCombatAction.combat);
        if (combatOutcome === CombatOutcome.DEFEAT) setTimeout(() => dispatch(setDefeatState()), 1000);
        else if (combatOutcome === CombatOutcome.VICTORY) setTimeout(() => dispatch(setVictoryState()), 1000);

        //setTimeout(() => {
        //    dispatch(clearOldestCombatNumber(combatAction.targetUnitId));
        //}, 5000);

        // recovery time after using ability
        const recoveryTickCallback = (currTime: number, recoveryTime: number) => {
            const recoveryProgress = Math.ceil((currTime / recoveryTime) * 100);
            dispatch(
                updateUnit({
                    id: sourceUnit.id,
                    changes: {
                        recoveryProgress,
                    },
                }),
            );
        };

        if (ability.recoveryTimeInSec > 0) {
            dispatch(
                updateUnit({
                    id: sourceUnit.id,
                    changes: {
                        isRecovering: true,
                    },
                }),
            );
            await timeout(recoveryTickCallback, ability.recoveryTimeInSec * 1000);
            dispatch(
                updateUnit({
                    id: sourceUnit.id,
                    changes: {
                        isRecovering: false,
                        recoveryProgress: 0,
                    },
                }),
            );
        }
    },
);

const unitsSelectors = unitsAdapter.getSelectors();
export const selectEnemyUnits = (state: RootState) =>
    unitsSelectors.selectAll(state.combat.units).filter((u) => !u.isFriendly);
export const selectFriendlyUnits = (state: RootState) =>
    unitsSelectors.selectAll(state.combat.units).filter((u) => u.isFriendly);
export const selectRandomFriendlyUnit = (state: RootState) => {
    const friendlyUnits = selectFriendlyUnits(state).filter((u) => !u.isDead);
    return friendlyUnits[Math.floor(Math.random() * friendlyUnits.length)];
};

export const selectRandomAbilityId = (state: RootState, unitId: string) => {
    const abilities = selectUnit(unitId)(state)?.abilityIds;
    if (abilities) return abilities[Math.floor(Math.random() * abilities.length)];
    return 0;
};
export const selectFriendlyUnitIds = (state: RootState) =>
    unitsSelectors
        .selectAll(state.combat.units)
        .filter((u) => u.isFriendly)
        .map((u) => u.id);
export const selectEnemyUnitIds = (state: RootState) =>
    unitsSelectors
        .selectAll(state.combat.units)
        .filter((u) => !u.isFriendly)
        .map((u) => u.id);
export const selectUnit = (unitId: string) => (state: RootState) =>
    unitsSelectors.selectById(state.combat.units, unitId);

export const selectUnitCastProgress = (unitId: string) => (state: RootState) => selectUnit(unitId)(state)?.castProgress;
export const selectCanUseAbility = (unitId: string) => (state: RootState) => {
    const unit = selectUnit(unitId)(state);
    return unit && !unit.isCasting && !unit.isRecovering && !unit.blocking && !unit.isDead;
};

export const selectAbilityDamage = (unitId: string) => (state: RootState) => {
    const units = state.combat.units.entities;
    const unit = units[unitId];
    if (!unit || !unit.targetUnitId || unit.castingAbility === null) return 0;

    let targetUnit: CombatUnit | undefined;
    if (unit.blockedBy) targetUnit = units[unit.blockedBy];
    else targetUnit = units[unit.targetUnitId];

    const ability = combatAbilities[unit.castingAbility];
    if (!targetUnit || !ability) return 0;
    return calculateAbilityDamage(unit, targetUnit, ability);
};

export const selectTargetLines = (state: RootState) => {
    const units = unitsSelectors.selectAll(state.combat.units);
    const castingUnits = units.filter((u) => u.isCasting || u.blocking);
    return castingUnits.map((u) => {
        const target = u.blockedBy ?? u.targetUnitId;
        return {
            sourceUnitId: u.id,
            targetUnitId: u.blocking ? u.blocking : target,
            abilityId: u.castingAbility,
            isFriendlySource: u.isFriendly,
            isBlocking: !!u.blocking,
        };
    });
};

export const selectRewardCurrency = (state: RootState) => state.combat.rewardCurrency;
export const selectAvailableRewards = (state: RootState) => state.combat.availableRewards;
export const selectScriptedText = (state: RootState) => state.combat.scriptedText;

export default combatSlice.reducer;
