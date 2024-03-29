import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { Reward, RewardId } from '../../encounterManager/rewards';
import { CombatAbility, CombatAbilityType } from '../abilities/combatAbilities';

export type CombatAction = {
    sourceUnitId: string;
    targetUnitId: string;
    abilityId: CombatAbilityType;
};

export type CombatActionFull = {
    sourceUnit: CombatUnit;
    targetUnit: CombatUnit;
    ability: CombatAbility;
};

export type CombatUnitState = {
    hp: number;
};

export type CombatUnit = {
    /** ID to reference unit in combat */
    id: string,

    // Resources/Stats State
    hp: number;
    mana: number;
    armor: number;
    isDead: boolean;

    isFriendly: boolean;

    targetUnitId: string | null;

    combatNumbers: number[];

    // Block state
    blockedDamageThisCombat: number;
    revengeCharges: number;
    isRevengeEnabled: boolean;

    /** Config ID to reference static unit info such as name and icon */ 
    configId: string;

    //Stats / Loadout
    abilityIds: CombatAbilityType[];
    maxHp: number;
    maxMana: number;
    strength: number;
    powers: RewardId[];
    blockPercent: number;
};

export type CombatState = {
    isCombatInProgress: boolean;
    difficulty: number;
    isCombatVictorious: boolean;
    isCombatFailed: boolean;
    isPlayerTurn: boolean;
    displayedUnitActionBar: string | null;
    numEncounters: number;
    showTurnIndicator: boolean;
    numTurnsInCurrentCombat: number;

    /** Order of list is the order in which the enemies will perform their actions */
    enemyAbilitiesQueue: CombatAction[];

    // Post-combat rewards
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

export type RewardUpdate = {
    unitId: string;
    reward: Reward;
};

export enum CombatOutcome {
    IN_PROGRESS = 0,
    VICTORY,
    DEFEAT,
}

export const unitsAdapter = createEntityAdapter<CombatUnit>({ selectId: (unit) => unit.id });
