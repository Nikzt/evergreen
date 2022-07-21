import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { Power, Reward } from '../../encounterManager/rewards';
import { CombatAbilityType } from '../abilities/combatAbilities';

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

    castProgress: number;
    recoveryProgress: number;
    combatNumbers: number[];
    isDead: boolean;

    // Turn state
    mana: number;

    // Block state
    blockedDamageThisCombat: number;
    revengeCharges: number;
    blockedBy: string | null;
    isBlocking: boolean;
    blockingProgress: number;
    isBlockSuccessful: boolean;
    isRevengeEnabled: boolean;
    lastBlockedUnitId: string | null;

    isTaunting: boolean;

    // Config
    id: string;
    name: string;
    icon?: string;

    //Stats / Loadout
    abilityIds: CombatAbilityType[];
    maxHp: number;
    maxMana: number;
    weaponDamage: number;
    strength: number;
    armor: number;
    powers: Power[];

    // Depcrecated, use blockPercent instead
    block: number;

    blockPercent: number;
    blockDuration: number;
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
