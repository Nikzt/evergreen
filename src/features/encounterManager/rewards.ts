import { RootState, store } from "../../store";
import { CombatUnit } from "../combat/state/combatModels";
import { selectFriendlyUnitIds, selectUnit, unitsSelectors } from "../combat/state/combatSelectors";
import { CombatState } from "../combat/state/combatModels";
import { getEntityList } from "../../common/entityUtils";

export enum RewardType {
    POWER,
    CONSUMABLE
}

export enum PowerType {
    MAX_HP,
    STRENGTH,
    ARMOR,
    MAX_MANA
}

export enum ConsumableType {
    HEALTH,
    MANA,
}

export type Power = {
    id: PowerType;

    /**The IDs for which this power is available */
    availableUnitIds: string[];

    unitId?: string;
    label: string;
    description: string;
    changes: Partial<CombatUnit>;
    maxAmountPerUnit: number | null;

}

export type Consumable = {
    id: ConsumableType;
    availableUnitIds: string[];
    unitId?: string;
    label: string;
    description: string;
    changes: Partial<CombatUnit>;
}

export type Reward = {
    type: RewardType;
    value: Power | Consumable;
}

const powers: { [key: number]: Power } = {
    [PowerType.STRENGTH]: {
        availableUnitIds: [],
        id: PowerType.STRENGTH,
        label: 'Manifest Strength',
        description: '[UNIT_NAME] gains +1 strength',
        changes: {
            strength: 1,
        },
        maxAmountPerUnit: null
    },
    [PowerType.ARMOR]: {
        availableUnitIds: [],
        id: PowerType.ARMOR,
        label: 'Manifest Armor',
        description: '[UNIT_NAME] gains +1 armor',
        changes: {
            armor: 1,
        },
        maxAmountPerUnit: null
    },
    [PowerType.MAX_HP]: {
        availableUnitIds: [],
        id: PowerType.MAX_HP,
        label: 'Reinforce Will to Live',
        description: '[UNIT_NAME] gains +5 Max HP',
        changes: {
            maxHp: 5,
            hp: 5
        },
        maxAmountPerUnit: null
    },
    [PowerType.MAX_MANA]: {
        availableUnitIds: [],
        id: PowerType.MAX_HP,
        label: 'Consolidate Energy',
        description: '[UNIT_NAME] gains +1 Max Mana',
        changes: {
            maxMana: 1,
            mana: 1
        },
        maxAmountPerUnit: 5
    },
};

const consumables: { [key: number]: Consumable } = {
    [ConsumableType.HEALTH]: {
        availableUnitIds: [],
        id: ConsumableType.HEALTH,
        label: 'Absorb Vitality',
        description: '[UNIT_NAME] heals +10 HP',
        changes: {
            hp: 10,
        },
    },
};

const getRandomFriendlyUnitId = (state: CombatState): string => {
    const friendlyUnitIds = getEntityList(state.units.entities).filter(unit => unit.isFriendly).map(unit => unit.id);
    const randomIndex = Math.floor(Math.random() * friendlyUnitIds.length);
    return friendlyUnitIds[randomIndex];
}

const filterByAvailableUnitIds = (unitId: string, rewardList: (Power | Consumable)[]) => {
    return rewardList.filter(reward => {
        return reward.availableUnitIds.length <= 0 || reward.availableUnitIds.includes(unitId);
    });
}

export const getRandomPowerReward = (state: CombatState): Reward => {
    const powersListCopy = [...Object.values(powers)];
    const randomFriendlyUnitId = getRandomFriendlyUnitId(state);
    const filteredPowers = filterByAvailableUnitIds(randomFriendlyUnitId, powersListCopy);
    const randomPower = filteredPowers[Math.floor(Math.random() * powersListCopy.length)];

    return {
        type: RewardType.POWER,
        value: {...randomPower, unitId: randomFriendlyUnitId},
    }
}

export const getRandomConsumableReward = (state: CombatState): Reward => {
    const consumablesListCopy = [...Object.values(consumables)];
    const randomFriendlyUnitId = getRandomFriendlyUnitId(state);
    const filteredConsumables = filterByAvailableUnitIds(randomFriendlyUnitId, consumablesListCopy);
    const randomConsumable = filteredConsumables[Math.floor(Math.random() * consumablesListCopy.length)];

    return {
        type: RewardType.CONSUMABLE,
        value: {...randomConsumable, unitId: randomFriendlyUnitId},
    }
}

export const getRewardDescription = (reward: Reward): string => {
    if (!reward.value.unitId)
        return reward.value.description;

    const unit = selectUnit(reward.value.unitId)(store.getState() as RootState);
    if (!unit)
        throw new Error('Unit not found');

    return reward.value.description.replace('[UNIT_NAME]', unit.name);
}