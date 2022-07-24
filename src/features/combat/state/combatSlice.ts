import { createSlice, PayloadAction, Update } from '@reduxjs/toolkit';
import combatAbilities  from '../abilities/combatAbilities';
import { CombatEncounter } from '../../encounterManager/encounters';
import { CombatAction, CombatState, CombatUnit, RewardUpdate, unitsAdapter } from './combatModels';
import { unitsSelectors } from './combatSelectors';
import calculateAbilityDamage, { calculateRawDamage } from '../abilities/calculateAbilityDamage';
import { getRewardsForEachUnit, RewardType } from '../../encounterManager/rewards';
import { getAbility } from '../abilities/abilityUtils';

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
    state.displayedUnitActionBar = null;
    state.numTurnsInCurrentCombat = 0;
    state.showTurnIndicator = true;
};

const removeAbilitiesWithSourceUnitId = (state: CombatState, sourceUnitId: string) => {
    const abilities = state.enemyAbilitiesQueue.filter(
        (a) => a.sourceUnitId !== sourceUnitId && a.targetUnitId !== sourceUnitId,
    );
    state.enemyAbilitiesQueue = abilities;
};

const onUnitKilled = (state: CombatState, unit: CombatUnit) => {
    unit.hp = 0;
    unit.isDead = true;
    unit.isCasting = false;
    removeAbilitiesWithSourceUnitId(state, unit.id);
};

const getUnit = (state: CombatState, unitId: string) => {
    const unit = state.units.entities[unitId];
    if (!unit) throw new Error(`Unit ${unitId} not found`);
    return unit;
};

const makeChangesAdditive = (changes: Partial<CombatUnit>, unit: CombatUnit) => {
    const additiveChanges: any = {};
    Object.keys(changes).forEach((key) => {
        if ((unit as any)[key] !== undefined) {
            if ((unit as any)[key] instanceof Array) {
                additiveChanges[key] = [...(unit as any)[key], ...(changes as any)[key]];
            } else if (typeof ((unit as any)[key]) === 'number') {
                additiveChanges[key] = (changes as any)[key] + (unit as any)[key];
            }
        }
    });
    return additiveChanges;
};

const resetUnitOverflowedValues = (unit: CombatUnit) => {
    if (unit.mana > unit.maxMana) unit.mana = unit.maxMana;
    if (unit.hp > unit.maxHp) unit.hp = unit.maxHp;
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
    difficulty: 1,
    numEncounters: 0,
    rewardCurrency: 0,
    availableRewards: [],
    scriptedText: '',
    enemyAbilitiesQueue: [],
    displayedUnitActionBar: null,
    showTurnIndicator: true,
    numTurnsInCurrentCombat: 0,
};
export const combatSlice = createSlice({
    name: 'combat',
    initialState,
    reducers: {
        initCombatEncounter: (state, action: PayloadAction<CombatEncounter>) => {
            clearCombatState(state);
            unitsAdapter.addMany(
                state.units,
                action.payload.units.map((u) => {
                    return { ...u, revengeCharges: 1, blockedDamageThisCombat: 0, mana: u.maxMana };
                }),
            );
            state.isCombatInProgress = true;
            onBeginPlayerTurn(state);
        },

        /**  Combat Defeat: Anything that needs to be hard reset, do it here */
        setDefeatState: (state) => {
            if (!state.isCombatInProgress) return;
            state.isCombatVictorious = false;
            state.isCombatFailed = true;
            state.isCombatInProgress = false;
            state.difficulty = 1;
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
            state.availableRewards = getRewardsForEachUnit(state);
        },
        updateUnit: (state, action: PayloadAction<Update<CombatUnit>>) => {
            unitsAdapter.updateOne(state.units, action.payload);
        },
        updateUnitWithReward: (state, action: PayloadAction<RewardUpdate>) => {
            const unit = getUnit(state, action.payload.unitId);
            let changes = action.payload.reward.changes;
            if (changes) changes = makeChangesAdditive(changes, unit);

            // Non-consumable rewards must be kept track of
            if (action.payload.reward.type === RewardType.POWER) {
                const power = action.payload.reward;
                unit.powers.push(power);
            }
            unitsAdapter.updateOne(state.units, {
                id: unit.id,
                changes,
            });
            resetUnitOverflowedValues(getUnit(state, unit.id));

            state.availableRewards = [];
            // Going to need to update everything that reads stats from the unit to actually
            // derive those values based on rewards...
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
            if (!target || !ability || !source || source.isDead || source.mana < ability.manaCost) return;

            source.targetUnitId = null;

            // Basic damaging ability
            const damage = calculateAbilityDamage(action.payload, state);
            target.hp -= damage;
            target.combatNumbers.push(damage);
            source.mana -= ability.manaCost;

            state.displayedUnitActionBar = null;
            checkDeadUnits(state);
        },
        performRevenge: (state, action: PayloadAction<CombatAction>) => {
            if (!action?.payload) return;
            const source = state.units.entities[action.payload.sourceUnitId];
            // All living other targets
            const targets = Object.values(state.units.entities).filter(
                (u) => u?.isFriendly !== source?.isFriendly && !u?.isDead,
            );
            const ability = combatAbilities[action.payload.abilityId];
            // TODO: Turn this into helper function
            if (
                targets.length <= 0 ||
                !ability ||
                !source ||
                source.isDead ||
                source.mana < ability.manaCost ||
                source.revengeCharges < 1
            )
                return;

            source.targetUnitId = null;

            // Basic damaging ability
            const damage = source.blockedDamageThisCombat;
            targets.forEach((target) => {
                if (target) {
                    target.hp -= damage;
                    target.combatNumbers.push(damage);
                }
            });
            source.mana -= ability.manaCost;
            source.revengeCharges--;

            state.displayedUnitActionBar = null;
            checkDeadUnits(state);
        },
        performBlock: (state, action: PayloadAction<CombatAction>) => {
            if (!action?.payload) return;
            const source = state.units.entities[action.payload.sourceUnitId];
            const target = state.units.entities[action.payload.targetUnitId];
            const ability = combatAbilities[action.payload.abilityId];
            const enemyAbilityId = state.enemyAbilitiesQueue.find(
                (a) => a.sourceUnitId === action.payload.targetUnitId,
            )?.abilityId;

            if (enemyAbilityId == null) return;

            const enemyAbility = getAbility(enemyAbilityId);

            // TODO: Turn this into helper function
            if (!target || !ability || !source || !enemyAbility || source.isDead || source.mana < ability.manaCost)
                return;

            source.targetUnitId = null;

            // The damage the enemy would do if they hadn't been blocked
            const enemyDamageBeforeBlock = calculateRawDamage(target, enemyAbility);

            const blockedDamage = Math.ceil(enemyDamageBeforeBlock * (source.blockPercent / 100));
            const damageAfterBlock = Math.max(0, enemyDamageBeforeBlock - blockedDamage);

            source.blockedDamageThisCombat += blockedDamage;
            source.hp -= damageAfterBlock;
            source.combatNumbers.push(damageAfterBlock);
            source.mana -= ability.manaCost;

            state.displayedUnitActionBar = null;

            const blockedAbilityIdx = state.enemyAbilitiesQueue.findIndex(
                (a) => a.sourceUnitId === action.payload.targetUnitId,
            );
            const blockedAbility = state.enemyAbilitiesQueue[blockedAbilityIdx];
            if (blockedAbility) { 
                // Remove blocked ability from enemyAbilitiesQueue
                // Should be as if the enemy just used this ability
                state.enemyAbilitiesQueue.splice(blockedAbilityIdx, 1);
                target.mana -= getAbility(blockedAbility.abilityId)?.manaCost ?? 0;
            }

            checkDeadUnits(state);
        },
        toggleTaunt: (state, action: PayloadAction<string>) => {
            const unit = state.units.entities[action.payload];
            if (!unit) return;

            unit.isTaunting = !unit.isTaunting;
            if (unit.isTaunting) {
                const otherUnits = Object.values(state.units.entities).filter((u) => u?.isFriendly !== unit.isFriendly);
                otherUnits.forEach((u) => {
                    if (u) u.targetUnitId = unit.id;
                });
            }
        },
        clearOldestCombatNumber: (state, action: PayloadAction<string>) => {
            const unitId = action.payload;
            const unit = state.units.entities[unitId];
            if (unit && unit.combatNumbers.length > 3) unit?.combatNumbers.splice(0, 1);
        },
        beginPlayerTurn: (state) => {
            onBeginPlayerTurn(state);
            // Enemy mana regenerates on player turn because the player needs to see
            // how much mana the enemy *will* have at the start of their turn.
            regenerateEnemyUnitsMana(state);
        },
        beginEnemyTurn: (state) => {
            state.isPlayerTurn = false;
            state.displayedUnitActionBar = null;
            state.numTurnsInCurrentCombat++;
        },
        removeFromEnemyAbilityQueue: (state, action: PayloadAction<CombatAction>) => {
            const idx = state.enemyAbilitiesQueue.findIndex((c) => c.sourceUnitId === action.payload.sourceUnitId);
            if (idx > -1) state.enemyAbilitiesQueue.splice(idx, 1);
        },
        toggleUnitActionBar: (state, action: PayloadAction<string | null>) => {
            if (action.payload == null) {
                state.displayedUnitActionBar = null;
                state.isTargeting = false;
                state.targetingAbilityId = null;
                return;
            }

            const unit = state.units.entities[action.payload];

            // toggle off cases
            if (!unit || !unit.isFriendly || unit.id === state.displayedUnitActionBar)
                state.displayedUnitActionBar = null;
            // toggle on cases
            else state.displayedUnitActionBar = unit.id;
        },
        setShowTurnIndicator: (state, action: PayloadAction<boolean>) => {
            state.showTurnIndicator = action.payload;
        }
    },
});

const regenerateFriendlyUnitsMana = (state: CombatState) => {
    Object.values(state.units.entities)
        .filter((u) => u?.isFriendly)
        .forEach((u) => u && regenerateUnitMana(u));
};

const regenerateEnemyUnitsMana = (state: CombatState) => {
    Object.values(state.units.entities)
        .filter((u) => !u?.isFriendly)
        .forEach((u) => u && regenerateUnitMana(u));
};

const regenerateUnitMana = (unit: CombatUnit) => {
    if (unit.mana < unit.maxMana) unit.mana++;
};

const onBeginPlayerTurn = (state: CombatState) => {
    populateEnemyAbilitiesQueue(state);
    state.isPlayerTurn = true;
    state.displayedUnitActionBar = null;
    regenerateFriendlyUnitsMana(state);
    state.numTurnsInCurrentCombat++;
};

const populateEnemyAbilitiesQueue = (state: CombatState) => {
    const enemies = unitsSelectors.selectAll(state.units).filter((u) => !u.isFriendly && !u.isDead);
    const friendlyUnitIds = unitsSelectors
        .selectAll(state.units)
        .filter((u) => u.isFriendly && !u.isDead)
        .map((u) => u.id);
    state.enemyAbilitiesQueue = enemies.map((u) => {
        const randomAbilityId = u.abilityIds[Math.floor(Math.random() * u.abilityIds.length)];
        const randomFriendlyUnitId = friendlyUnitIds[Math.floor(Math.random() * friendlyUnitIds.length)];
        return {
            sourceUnitId: u.id,
            targetUnitId: randomFriendlyUnitId,
            abilityId: randomAbilityId,
        };
    });
};

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
    removeFromEnemyAbilityQueue,
    toggleUnitActionBar,
    performBlock,
    performRevenge,
    setShowTurnIndicator
} = combatSlice.actions;

export default combatSlice.reducer;
