import unitIcons from "../assets/unitIcons/unitIcons";
import { CombatAbilityType } from "../features/combat/abilities/combatAbilities";
import { createFriendlyUnit } from "../features/encounterManager/combatUnitUtils";

export type PlayerCharacter = {
    id: string;
}

export const PlayerCharacterGreg: PlayerCharacter = {
    id: 'greg'
}

export const PlayerCharacterMira: PlayerCharacter = {
    id: 'mira'
}

export const initGreg = () =>
    createFriendlyUnit({
        id: 'greg',
        name: 'Greg',
        icon: unitIcons.greg,
        maxHp: 30,
        abilityIds: [CombatAbilityType.REVENGE, CombatAbilityType.BLOCK, CombatAbilityType.STRONG_ATTACK],
        weaponDamage: 1,
        strength: 1,
        armor: 1,
        block: 100,
        blockDuration: 1,
        isTaunting: true,
        maxMana: 2,
        blockPercent: 80
    });

export const initMira = () =>
    createFriendlyUnit({
        id: 'mira',
        name: 'Mira',
        icon: unitIcons.mira,
        maxHp: 30,
        abilityIds: [CombatAbilityType.QUICK_ATTACK, CombatAbilityType.BLOCK],
        weaponDamage: 2,
        strength: 2,
        armor: 0,
        block: 4,
        blockDuration: 1,
        maxMana: 3,
        blockPercent: 30
    });