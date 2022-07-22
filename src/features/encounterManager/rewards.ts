import { CombatAbilityType } from '../combat/abilities/combatAbilities';
import { RootState, store } from '../../store';
import { CombatUnit, CombatState } from '../combat/state/combatModels';
import { selectUnit } from '../combat/state/combatSelectors';
import { getEntityList } from '../../common/entityUtils';
import { PlayerCharacterGreg, PlayerCharacterMira } from '../../common/playerCharacters';
import _ from "lodash";

export enum RewardId {
    MAX_HP,
    STRENGTH,
    BLOCK_PERCENT,
    MAX_MANA,
    QUICK_ATTACK,
    HEALTH,
    MANA,
    REVENGE,
    BLOCK,
    STRONG_ATTACK
}

export enum RewardType {
    CONSUMABLE,
    POWER,
    ABILITY
}

export type Reward = {
    id: RewardId;
    type: RewardType;
    /**The IDs for which this power is available */
    availableUnitIds: string[];

    unitId?: string;
    label: string;
    description: string;
    changes: Partial<CombatUnit>;
    maxAmountPerUnit: number | null;
    probabilityWeight: number;
};

const powers: { [key: number]: Reward } = {
    [RewardId.STRENGTH]: {
        availableUnitIds: [PlayerCharacterMira.id],
        id: RewardId.STRENGTH,
        type: RewardType.POWER,
        label: 'Manifest Strength',
        description: '[UNIT_NAME] gains +1 strength',
        changes: {
            strength: 1,
        },
        maxAmountPerUnit: null,
        probabilityWeight: 4,
    },
    [RewardId.BLOCK_PERCENT]: {
        availableUnitIds: [],
        id: RewardId.BLOCK_PERCENT,
        type: RewardType.POWER,
        label: 'Manifest Armor',
        description: '[UNIT_NAME] gains 10% block value',
        changes: {
            blockPercent: 10,
        },
        maxAmountPerUnit: null,
        probabilityWeight: 4,
    },
    [RewardId.MAX_HP]: {
        availableUnitIds: [],
        id: RewardId.MAX_HP,
        type: RewardType.POWER,
        label: 'Invigorate',
        description: '[UNIT_NAME] gains +5 Max HP',
        changes: {
            maxHp: 5,
            hp: 5,
        },
        maxAmountPerUnit: null,
        probabilityWeight: 2,

    },
    [RewardId.MAX_MANA]: {
        availableUnitIds: [],
        id: RewardId.MAX_HP,
        type: RewardType.POWER,
        label: 'Consolidate Energy',
        description: '[UNIT_NAME] gains +1 Max Mana',
        changes: {
            maxMana: 1,
            mana: 1,
        },
        maxAmountPerUnit: 5,
        probabilityWeight: 3,
    },
};

const abilities: { [key: number]: Reward } = {
    [RewardId.QUICK_ATTACK]: {
        availableUnitIds: [],
        id: RewardId.QUICK_ATTACK,
        type: RewardType.ABILITY,
        label: 'Quick Attack',
        description: '[UNIT_NAME] gains the ability "Quick Attack"',
        changes: {
            abilityIds: [0], // TODO: Can't reference enum for some reason
        },
        maxAmountPerUnit: 1,
        probabilityWeight: 10,
    },
    [RewardId.REVENGE]: {
        availableUnitIds: [],
        id: RewardId.REVENGE,
        type: RewardType.ABILITY,
        label: 'Revenge',
        description: '[UNIT_NAME] gains the ability "Revenge"',
        changes: {
            abilityIds: [CombatAbilityType.REVENGE],
        },
        maxAmountPerUnit: 1,
        probabilityWeight: 10,
    },
    [RewardId.BLOCK]: {
        availableUnitIds: [],
        id: RewardId.BLOCK,
        type: RewardType.ABILITY,
        label: 'Block',
        description: '[UNIT_NAME] gains the ability "Block"',
        changes: {
            abilityIds: [CombatAbilityType.BLOCK],
        },
        maxAmountPerUnit: 1,
        probabilityWeight: 15,
    }, [RewardId.STRONG_ATTACK]: {
        availableUnitIds: [],
        id: RewardId.STRONG_ATTACK,
        type: RewardType.ABILITY,
        label: 'Strong Attack',
        description: '[UNIT_NAME] gains the ability "Strong Attack"',
        changes: {
            abilityIds: [CombatAbilityType.STRONG_ATTACK],
        },
        maxAmountPerUnit: 1,
        probabilityWeight: 10,

    }
}

const consumables: { [key: number]: Reward } = {
        [RewardId.HEALTH]: {
            availableUnitIds: [],
            id: RewardId.HEALTH,
            type: RewardType.CONSUMABLE,
            label: 'Absorb Vitality',
            description: '[UNIT_NAME] heals +10 HP',
            changes: {
                hp: 10,
            },
            maxAmountPerUnit: null,
            probabilityWeight: 7
        },
    };

const getRandomFriendlyUnitId = (state: CombatState): string => {
    const friendlyUnitIds = getEntityList(state.units.entities)
        .filter((unit) => unit.isFriendly)
        .map((unit) => unit.id);
    return _.sample(friendlyUnitIds) as string;
};

const canUnitObtainAbility = (reward: Reward, unit: CombatUnit): boolean => {
    if (reward.type !== RewardType.ABILITY) return true;
    if (reward.changes.abilityIds == null) return false;
    const abilityInReward = reward.changes.abilityIds[0];
    const doesUnitHaveAbility = unit.abilityIds.includes(abilityInReward);
    return !doesUnitHaveAbility;
}

const canUnitUseReward = (state: CombatState, reward: Reward, unitId: string): boolean => {
    const unit = state.units.entities[unitId];
    if (!unit) return false;
    const numPowersOfType = unit.powers.filter((power) => power.id === power.id).length;
    const isRewardAvailableForUnit = reward.availableUnitIds.length <= 0 || reward.availableUnitIds.includes(unitId);
    const isRewardMaxedOut = reward.maxAmountPerUnit != null && numPowersOfType >= reward.maxAmountPerUnit;
    return isRewardAvailableForUnit && !isRewardMaxedOut && canUnitObtainAbility(reward, unit);
}

const generateRewardForUnit = (state: CombatState, unitId: string): Reward => {
    const rewardsListCopy = [...Object.values(powers), ...Object.values(consumables), ...Object.values(abilities)];
    const filteredRewards = _.filter(rewardsListCopy, r => canUnitUseReward(state, r, unitId));
    if (filteredRewards.length < 1) throw new Error('No rewards available for unit');
    //const reward = _.sample(filteredRewards) as Reward;
    // get random reward with probablity weight
    const randomizedRewards = _.shuffle(filteredRewards);
    const random = Math.random();
    const probabilitySum = randomizedRewards.reduce((sum, r) => sum + r.probabilityWeight, 0);
    const probability = random * (probabilitySum / randomizedRewards.length);
    const rewardIndex = randomizedRewards.findIndex((r) => r.probabilityWeight >= probability);
    const reward = randomizedRewards[rewardIndex];
    console.log(probability)

    return { ...reward, unitId };
}

export const getRewardsForEachUnit = (state: CombatState): Reward[] => {
    return getEntityList(state.units.entities)
        .filter((unit) => unit.isFriendly)
        .map((unit) => generateRewardForUnit(state, unit.id));
}

export const getRewardDescription = (reward: Reward): string => {
    if (!reward.unitId) return reward.description;
    const unit = selectUnit(reward.unitId)(store.getState() as RootState);
    if (!unit) throw new Error('Unit not found');
    return reward.description.replace('[UNIT_NAME]', unit.name);
};
