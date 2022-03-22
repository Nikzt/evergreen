import { crafting, ItemType, itemTypeToLabel } from './common/items';
import CharactersContainer from './features/characters/CharactersContainer';
import { initCharacters } from './features/characters/charactersSlice';
import TimerManager from './features/events/timerManager';
import { craftItem, selectResourcesList } from './features/resources/resourcesSlice';
import { useAppDispatch, useAppSelector } from './hooks';

const App = () => {
    const dispatch = useAppDispatch();
    TimerManager.startTimer();

    dispatch(initCharacters());

    const onCraftItemClick = (itemType: ItemType) => {
        dispatch(craftItem(itemType));
    };

    const resourcesList = useAppSelector(selectResourcesList);
    const craftingList = Object.keys(crafting).map(c => {
        const itemType = parseInt(c) as ItemType;
        return {
            label: itemTypeToLabel[itemType].singular,
            itemType
        }
    })

    return (
        <>
            <CharactersContainer />
            <hr></hr>
            <div>
                <h3>Resources</h3>
                {resourcesList.map(r => <p key={r.itemType}>
                    {r.label}: {r.value}
                </p>)}
            </div>
            <hr></hr>
            <div>
                <h3>Forge</h3>
                {craftingList.map(c => <button onClick={() => onCraftItemClick(c.itemType)}>{c.label}</button>)}
            </div>
        </>
    );
};

export default App;
