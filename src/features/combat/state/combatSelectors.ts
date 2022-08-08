import { CombatAbilityType } from '../abilities/combatAbilities';
import { RootState } from '../../../store';
import { CombatAction, unitsAdapter } from './combatModels';
import { getAbility } from '../abilities/abilityUtils';
import { RewardId } from '../../encounterManager/rewards';

export const unitsSelectors = unitsAdapter.getSelectors();

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

export const selectCanUseAnyAbilities = (unitId: string) => (state: RootState) => {
    const unit = selectUnit(unitId)(state);
    // Enemies can only use abilities in their queue
    if (!unit?.isFriendly && !state.combat.enemyAbilitiesQueue.some((a) => a.sourceUnitId === unitId)) {
        return false;
    }
    const minManaCost =
        unit?.abilityIds.reduce((min, a) => Math.min(min, getAbility(a)?.manaCost), Number.MAX_SAFE_INTEGER) ?? 0;
    return unit && !unit.isDead && unit.mana >= minManaCost;
};

export const selectCanUseSpecificAbility = (unitId: string, abilityType: CombatAbilityType) => (state: RootState) => {
    const unit = selectUnit(unitId)(state);
    const ability = getAbility(abilityType);
    if (!unit || unit.mana < ability.manaCost) return false;
    switch (abilityType) {
        case CombatAbilityType.REVENGE:
            return unit.blockedDamageThisCombat > 0 && unit.revengeCharges > 0;
    }

    return selectCanUseAnyAbilities(unitId)(state);
};

export const selectAvailableRewards = (state: RootState) => state.combat.availableRewards;
export const selectScriptedText = (state: RootState) => state.combat.scriptedText;

export const selectFriendlyUnitByIdx = (idx: number) => (state: RootState) => {
    const friendlyUnits = selectFriendlyUnits(state);
    if (friendlyUnits.length > idx) return friendlyUnits[idx];
};
export const selectEnemyUnitByIdx = (idx: number) => (state: RootState) => {
    const enemyUnits = selectEnemyUnits(state);
    if (enemyUnits.length > idx) return enemyUnits[idx];
};

export const selectFriendlyUnitIndexes = (state: RootState) => {
    return selectFriendlyUnitIds(state).map((uid, idx) => {
        return { unitId: uid, idx };
    });
};

export const selectLivingUnits = (state: RootState) => {
    return unitsSelectors.selectAll(state.combat.units).filter((u) => !u.isDead);
};

export const selectLivingFriendlyUnitIds = (state: RootState) => {
    return selectLivingUnits(state)
        .filter((u) => u.isFriendly)
        .map((u) => u.id);
};

export const selectLivingEnemyUnitIds = (state: RootState) => {
    return selectLivingUnits(state)
        .filter((u) => !u.isFriendly)
        .map((u) => u.id);
};

export const selectEnemyAbilitiesQueue = (state: RootState) => {
    return state.combat.enemyAbilitiesQueue;
};

export const selectNextEnemyAbility = (unitId: string) => (state: RootState) =>
    state.combat.enemyAbilitiesQueue.find((a) => a.sourceUnitId === unitId);

export const selectAllFriendlyUnitsMaxHp = (state: RootState) => {
    return selectFriendlyUnits(state).every((u) => u.hp >= u.maxHp);
};

export const selectFullCombatAction = (combatAction: CombatAction) => (state: RootState) => {
    const sourceUnit = state.combat.units.entities[combatAction.sourceUnitId];
    const targetUnit = state.combat.units.entities[combatAction.targetUnitId];
    const ability = getAbility(combatAction.abilityId);
    if (!sourceUnit || !targetUnit || !ability) return null;
    return {
        sourceUnit,
        targetUnit,
        ability,
    };
};

export const selectUnitHasCleave = (unitId: string) => (state: RootState) => {
    const unit = selectUnit(unitId)(state);
    return unit && unit.powers.includes(RewardId.CLEAVE);
};
