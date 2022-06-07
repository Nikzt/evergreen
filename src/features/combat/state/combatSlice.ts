import { createSlice, PayloadAction, Update } from '@reduxjs/toolkit';
import combatAbilities, { CombatAbility, CombatAbilityType } from '../abilities/combatAbilities';
import { CombatEncounter } from '../../encounterManager/encounters';
import { getRandomRewards } from '../../encounterManager/rewards';
import { getScriptedRewards } from '../../encounterManager/scriptedRewards';
import { CombatAction, CombatState, CombatUnit, RewardUpdate, unitsAdapter } from './combatModels';
import { unitsSelectors } from './combatSelectors';
import calculateAbilityDamage from '../abilities/calculateAbilityDamage';

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
    state.isPlayerTurn = true;
    state.enemyAbilitiesQueue = [];
};

const removeAbilitiesWithSourceUnitId = (state: CombatState, sourceUnitId: string) => {
    const abilities = state.enemyAbilitiesQueue.filter(a =>
        a.sourceUnitId !== sourceUnitId
        && a.targetUnitId !== sourceUnitId);
    state.enemyAbilitiesQueue = abilities;
};

const onUnitKilled = (state: CombatState, unit: CombatUnit) => {
    unit.hp = 0;
    unit.isDead = true;
    unit.isCasting = false;
    removeAbilitiesWithSourceUnitId(state, unit.id);
}

/**
 * Handle state changes for units that have died (ie. HP <= 0)
 */
const checkDeadUnits = (state: CombatState) => {
    Object.values(state.units.entities).forEach((u) => {
        if (u && u.hp <= 0) {
            onUnitKilled(state, u);
        }
    });
};

const initialState: CombatState = {
    isPlayerTurn: true,
    isTargeting: false,
    targetingAbilityId: null,
    targetingSourceUnitId: null,
    units: unitsAdapter.getInitialState(),
    isCombatInProgress: false,
    isCombatFailed: true,
    isCombatVictorious: false,
    difficulty: 4,
    rewardCurrency: 0,
    availableRewards: [],
    scriptedText: '',
    enemyAbilitiesQueue: []
};
export const combatSlice = createSlice({
    name: 'combat',
    initialState,
    reducers: {
        initCombatEncounter: (state, action: PayloadAction<CombatEncounter>) => {
            clearCombatState(state);
            unitsAdapter.addMany(state.units, action.payload.units.map(u => {
                // TODO: Reset all units mana should be helper function
                return { ...u, mana: 1 }
            }));
            state.isCombatInProgress = true;
            onBeginPlayerTurn(state);
        },

        /**  Combat Defeat: Anything that needs to be hard reset, do it here */
        setDefeatState: (state) => {
            if (!state.isCombatInProgress) return;
            state.isCombatVictorious = false;
            state.isCombatFailed = true;
            state.isCombatInProgress = false;
            state.difficulty = 4;
            state.rewardCurrency = 0;
        },

        /**  Combat Victory: Reset combat for next encounter, but don't reset things that continue through run */
        setVictoryState: (state) => {
            if (!state.isCombatInProgress) return;
            const livingFriendlyUnits = Object.values(state.units.entities).filter((u) => u?.isFriendly && !u.isDead);
            state.isCombatVictorious = true;
            state.isCombatFailed = false;
            state.isCombatInProgress = false;
            state.difficulty += 1;
            livingFriendlyUnits.forEach((u) => {
                if (u) u.combatNumbers = [];
            });

            // Post combat rewards
            getScriptedRewards(state);
            state.rewardCurrency += 3;
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
        beginTargetingAbility: (state, action: PayloadAction<CombatAction>) => {
            state.isTargeting = true;
            state.targetingAbilityId = action.payload.abilityId;
            state.targetingSourceUnitId = action.payload.sourceUnitId;
        },
        endTargetingAbility: (state, action: PayloadAction<boolean>) => {
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
            // TODO: Turn this into helper function
            if (!target || !ability || !source || source.isDead || source.mana <= 0) return;

            source.isCasting = false;
            source.castingAbility = null;
            source.castProgress = 0;
            source.targetUnitId = null;

            // Damage ability
            switch (ability.id) {
                case CombatAbilityType.BLOCK:
                    break;
                default:
                    const damage = calculateAbilityDamage(action.payload, state);
                    if (target.isBlocking) {
                        target.isBlockSuccessful = true;
                        target.lastBlockedUnitId = source.id;
                        target.isBlocking = false;
                        target.blockingProgress = 0;
                        target.isRecovering = false;
                        target.isRevengeEnabled = true;
                        console.log("target blocked my attack");
                    }
                    target.hp -= damage;
                    target.combatNumbers.push(damage);
            }
            source.mana--;
            checkDeadUnits(state);
        },
        toggleTaunt: (state, action: PayloadAction<string>) => {
            const unit = state.units.entities[action.payload];
            if (!unit) return;

            unit.isTaunting = !unit.isTaunting;
            if (unit.isTaunting) {
                const otherUnits = Object.values(state.units.entities).filter(u => u?.isFriendly !== unit.isFriendly);
                otherUnits.forEach(u => {
                    if (u) u.targetUnitId = unit.id;
                })
            }
        },
        clearOldestCombatNumber: (state, action: PayloadAction<string>) => {
            const unitId = action.payload;
            const unit = state.units.entities[unitId];
            if (unit && unit.combatNumbers.length > 3) unit?.combatNumbers.splice(0, 1);
        },
        beginPlayerTurn: (state) => {
            onBeginPlayerTurn(state);
        },
        beginEnemyTurn: (state) => {
            state.isPlayerTurn = false;
            Object.values(state.units.entities).forEach(u => {
                if (u && !u.isFriendly) u.mana = 1
            });
        },
        removeFromEnemyAbilityQueue: (state, action: PayloadAction<CombatAction>) => {
            const idx = state.enemyAbilitiesQueue.findIndex(c => c.sourceUnitId === action.payload.sourceUnitId)
            if (idx > -1)
                state.enemyAbilitiesQueue.splice(idx, 1);
        }
    },
});

const onBeginPlayerTurn = (state: CombatState) => {
    state.isPlayerTurn = true;
    populateEnemyAbilitiesQueue(state);
    Object.values(state.units.entities).forEach(u => {
        if (u && u.isFriendly) u.mana = 1
    });
}

const populateEnemyAbilitiesQueue = (state: CombatState) => {
    const enemies = unitsSelectors.selectAll(state.units)
        .filter(u => !u.isFriendly && !u.isDead);
    const friendlyUnitIds = unitsSelectors.selectAll(state.units)
        .filter(u => u.isFriendly && !u.isDead)
        .map(u => u.id);
    state.enemyAbilitiesQueue = enemies.map(u => {
        const randomAbilityId = u.abilityIds[Math.floor(Math.random() * u.abilityIds.length)]
        const randomFriendlyUnitId = friendlyUnitIds[Math.floor(Math.random() * friendlyUnitIds.length)]
        return {
            sourceUnitId: u.id,
            targetUnitId: randomFriendlyUnitId,
            abilityId: randomAbilityId
        }
    })
}

export const {
    updateUnit,
    performCombatAction,
    initCombatEncounter,
    beginTargetingAbility,
    endTargetingAbility,
    clearOldestCombatNumber,
    setDefeatState,
    setVictoryState,
    updateUnitWithReward,
    toggleTaunt,
    beginPlayerTurn,
    beginEnemyTurn,
    removeFromEnemyAbilityQueue
} = combatSlice.actions;

export default combatSlice.reducer;
