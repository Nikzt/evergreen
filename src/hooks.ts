import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ItemType } from './common/items';
import { selectNextEnemyAbility, selectUnit } from './features/combat/state/combatSelectors';
import { selectCanCraftItem } from './features/idleGame/resources/resourcesSlice';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCanCraftItem = (itemType: ItemType) => {
    return useAppSelector(selectCanCraftItem(itemType));
};

export const useSelectCombatUnit = (unitId: string | null) => {
    return useAppSelector(selectUnit(unitId ?? ''));
};

export const useSelectNextEnemyAbility = (unitId: string) => {
    return useAppSelector(selectNextEnemyAbility(unitId));
};
