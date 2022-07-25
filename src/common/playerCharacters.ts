import unitIcons from '../assets/unitIcons/unitIcons';
import { CombatAbilityType } from '../features/combat/abilities/combatAbilities';
import { createFriendlyUnit } from '../features/encounterManager/combatUnitUtils';

export type PlayerCharacter = {
    id: string;
};

export const PlayerCharacterGreg: PlayerCharacter = {
    id: 'greg',
};

export const PlayerCharacterMira: PlayerCharacter = {
    id: 'mira',
};

export const initGreg = () =>
    createFriendlyUnit({
        id: 'greg',
        name: 'Greg',
        icon: unitIcons.greg,
        maxHp: 30,
        abilityIds: [CombatAbilityType.BLOCK, CombatAbilityType.STRONG_ATTACK],
        strength: 3,
        armor: 1,
        isTaunting: true,
        maxMana: 2,
        blockPercent: 50,
    });

export const initMira = () =>
    createFriendlyUnit({
        id: 'mira',
        name: 'Mira',
        icon: unitIcons.mira,
        maxHp: 30,
        abilityIds: [CombatAbilityType.QUICK_ATTACK],
        strength: 2,
        armor: 0,
        maxMana: 2,
        blockPercent: 50,
    });
