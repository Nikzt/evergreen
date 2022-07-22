import { CombatUnit } from '../combat/state/combatModels';

const getDefaultUnitProps = (maxHp: number, maxMana: number) => {
    return {
        isCasting: false,
        isFriendly: false,
        isRecovering: false,
        hp: maxHp,
        castProgress: 0,
        recoveryProgress: 0,
        combatNumbers: [],
        blockedBy: null,
        blocking: null,
        isDead: false,
        castingAbility: null,
        isBlockSuccessful: false,
        mana: maxMana,
        blockedDamageThisCombat: 0,
        revengeCharges: 1,
        powers: [],
    };
};

export const createEnemyUnit = (partialUnit: Partial<CombatUnit>): CombatUnit => {
    return {
        ...getDefaultUnitProps(partialUnit.maxHp as number, partialUnit.maxMana as number),
        ...(partialUnit as CombatUnit),
    };
};

export const createFriendlyUnit = (partialUnit: Partial<CombatUnit>): CombatUnit => {
    return {
        ...createEnemyUnit(partialUnit),
        isFriendly: true,
    };
};
