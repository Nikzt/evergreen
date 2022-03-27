import { crafting, ItemType, itemTypeToLabel } from './common/items';
import CharactersContainer from './features/characters/CharactersContainer';
import { initCharacters } from './features/characters/charactersSlice';
import CombatContainer from './features/combat/CombatContainer';
import TimerManager from './features/events/timerManager';
import { craftItem, selectResourcesList } from './features/resources/resourcesSlice';
import { useAppDispatch, useAppSelector, useCanCraftItem } from './hooks';
import './app.css';
import KeyHandler from './features/combat/keyHandler';

const App = () => {
    const dispatch = useAppDispatch();
    const resourcesList = useAppSelector(selectResourcesList);
    const craftingList = Object.keys(crafting).map((c) => {
        const itemType = parseInt(c) as ItemType;
        return {
            label: itemTypeToLabel[itemType].singular,
            itemType,
        };
    });

    KeyHandler.init();

    dispatch(initCharacters());
    TimerManager.startTimer();

    const canCraftItem = useCanCraftItem;
    const onCraftItemClick = (itemType: ItemType) => {
        dispatch(craftItem(itemType));
    };

    return (
        <>
            <CombatContainer />
            {/*
            <hr></hr>
            <CharactersContainer />
            <hr></hr>
            <div>
                <h3>Resources</h3>
                {resourcesList.map((r) => (
                    <p key={r.itemType}>
                        {r.label}: {r.value}
                    </p>
                ))}
            </div>
            <hr></hr>
            <div>
                <h3>Forge</h3>
                {craftingList.map((c) => (
                    <button
                        key={c.itemType}
                        disabled={!canCraftItem(c.itemType)}
                        onClick={() => onCraftItemClick(c.itemType)}
                    >
                        {c.label}
                    </button>
                ))}
            </div>
                */}
        </>
    );
};

export default App;
