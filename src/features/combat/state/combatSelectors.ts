import combatAbilities, { CombatAbility, CombatAbilityType } from '../abilities/combatAbilities';
import { RootState } from '../../../store';
import { CombatUnit, unitsAdapter } from './combatModels';
import { calculateAbilityDamage } from './combatSlice';

export const unitsSelectors = unitsAdapter.getSelectors();

export const selectEnemyUnits = (state: RootState) =>
    unitsSelectors.selectAll(state.combat.units).filter((u) => !u.isFriendly);
export const selectFriendlyUnits = (state: RootState) =>
    unitsSelectors.selectAll(state.combat.units).filter((u) => u.isFriendly);

export const selectRandomFriendlyUnit = (state: RootState) => {
    let friendlyUnits = selectFriendlyUnits(state).filter((u) => !u.isDead);
    if (friendlyUnits.some(u => u.isTaunting))
        friendlyUnits = friendlyUnits.filter(u => u.isTaunting);
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
export const selectCanUseAnyAbilities = (unitId: string) => (state: RootState) => {
    const unit = selectUnit(unitId)(state);
    return unit && !unit.isCasting && !unit.isRecovering && !unit.isBlocking && !unit.isDead && unit.mana > 0;
};

export const selectCanUseSpecificAbility = (unitId: string, abilityType: CombatAbilityType) => (state: RootState) => {
    const unit = selectUnit(unitId)(state);
    if (unit?.isRecovering) return false;
    switch (abilityType) {
        case CombatAbilityType.REVENGE:
            return !!unit?.isRevengeEnabled;
    }

    return selectCanUseAnyAbilities(unitId)(state);
}

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
    const castingUnits = units.filter((u) => u.isCasting || u.isBlocking);
    return castingUnits.map((u) => {
        const target = u.blockedBy ?? u.targetUnitId;
        return {
            sourceUnitId: u.id,
            targetUnitId: target,
            abilityId: u.castingAbility,
            isFriendlySource: u.isFriendly,
            isBlocking: u.isBlocking,
        };
    });
};

export const selectRewardCurrency = (state: RootState) => state.combat.rewardCurrency;
export const selectAvailableRewards = (state: RootState) => state.combat.availableRewards;
export const selectScriptedText = (state: RootState) => state.combat.scriptedText;

export const selectFriendlyUnitByIdx = (idx: number) => (state: RootState) => {
    const friendlyUnits = selectFriendlyUnits(state);
    if (friendlyUnits.length > idx) return friendlyUnits[idx];
};

export const selectFriendlyUnitIndexes = (state: RootState) => {
    return selectFriendlyUnitIds(state).map((uid, idx) => {return {unitId: uid, idx}});
}

export const selectLivingUnits = (state: RootState) => {
    return unitsSelectors.selectAll(state.combat.units).filter(u => !u.isDead);
}