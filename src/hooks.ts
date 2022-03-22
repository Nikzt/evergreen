import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ItemType } from './common/items';
import { selectCanCraftItem } from './features/resources/resourcesSlice';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCanCraftItem = (itemType: ItemType) => {
    return useAppSelector(selectCanCraftItem(itemType));
};
