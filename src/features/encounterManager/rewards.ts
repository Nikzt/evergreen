import { CombatAbilityType } from '../combat/abilities/combatAbilities';
import { CombatUnit } from '../combat/state/combatModels';

export enum RewardType {
    HEAL = 0,
    MAX_HP,
    STRENGTH,
    WEAPON_DAMAGE,
    ARMOR,
    ABILITY,
}

export type Reward = {
    type: RewardType;
    cost: number;
    label: string;
    abilityId?: CombatAbilityType;
    update?: Partial<CombatUnit>;
};

export const rewards: { [key: number]: Reward } = {
    [RewardType.HEAL]: {
        type: RewardType.HEAL,
        label: '+10 HP',
        cost: 2,
        update: {
            hp: 10,
        },
    },
    [RewardType.STRENGTH]: {
        type: RewardType.STRENGTH,
        label: '+2 Strength',
        cost: 2,
        update: {
            strength: 2,
        },
    },
    [RewardType.ARMOR]: {
        type: RewardType.ARMOR,
        label: '+2 Armor',
        cost: 2,
        update: {
            armor: 2,
        },
    },
};

export const rewardsList = Object.values(rewards);

export const getRandomRewards = (numRewards: number) => {
    const rewardsListCopy = [...rewardsList];
    return rewardsListCopy;
};
