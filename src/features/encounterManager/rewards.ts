import { CombatAbilityType } from '../../common/combatAbilities';
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
        cost: 5,
        update: {
            hp: 10,
        },
    },
    [RewardType.MAX_HP]: {
        type: RewardType.MAX_HP,
        label: '+2 Max HP',
        cost: 2,
        update: {
            maxHp: 5,
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
    [RewardType.WEAPON_DAMAGE]: {
        type: RewardType.WEAPON_DAMAGE,
        label: '+3 Weapon Damage',
        cost: 5,
        update: {
            weaponDamage: 3,
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
    const randomRewards = [];
    while (numRewards > 0) {
        const randomRewardIdx = Math.floor(Math.random() * rewardsListCopy.length);
        randomRewards.push(rewardsListCopy[randomRewardIdx]);
        rewardsListCopy.splice(randomRewardIdx, 1);
        numRewards--;
    }
    return randomRewards;
};
