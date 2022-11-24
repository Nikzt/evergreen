import { CombatAbilityType } from '../features/combat/abilities/combatAbilities';
import { createFriendlyUnit } from '../features/encounterManager/combatUnitUtils';
import { PlayerConfigIds } from './unitConfigs';

export type PlayerCharacter = {
    id: string;
};

export const initGreg = () =>
    createFriendlyUnit({
        configId: PlayerConfigIds.GREG,
        id: PlayerConfigIds.GREG,
        maxHp: 30,
        abilityIds: [CombatAbilityType.BLOCK, CombatAbilityType.STRONG_ATTACK],
        strength: 3,
        armor: 1,
        maxMana: 2,
        blockPercent: 50,
    });

export const initMira = () =>
    createFriendlyUnit({
        configId: PlayerConfigIds.MIRA,
        id: PlayerConfigIds.MIRA,
        maxHp: 30,
        abilityIds: [CombatAbilityType.QUICK_ATTACK],
        strength: 2,
        armor: 0,
        maxMana: 2,
        blockPercent: 50,
    });
