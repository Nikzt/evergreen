import combatAbilities from '../../../common/combatAbilities';
import { RootState } from '../../../store';
import { CombatUnit, unitsAdapter } from './combatModels';
import { calculateAbilityDamage } from './combatSlice';

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

export const selectFriendlyUnitByIdx = (idx: number) => (state: RootState) => {
    const friendlyUnits = selectFriendlyUnits(state);
    if (friendlyUnits.length > idx)
        return friendlyUnits[idx];
}