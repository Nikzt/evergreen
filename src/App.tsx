import CharactersContainer from './features/characters/CharactersContainer';
import { initCharacters } from './features/characters/charactersSlice';
import TimerManager from './features/events/timerManager';
import { createBattery } from './features/resources/resourcesSlice';
import { useAppDispatch, useAppSelector } from './hooks';

const App = () => {
    const chargedBatteries = useAppSelector((state) => state.resources.chargedBatteries);
    const batteries = useAppSelector((state) => state.resources.batteries);
    const metal = useAppSelector((state) => state.resources.metal);
    const dispatch = useAppDispatch();
    TimerManager.startTimer();

    dispatch(initCharacters());

    const craftBattery = () => {
        dispatch(createBattery());
    };

    return (
        <>
            <p>
                Batteries: {chargedBatteries} / {batteries}
            </p>
            <p>Metal: {metal}</p>
            <button onClick={craftBattery}>Craft Battery</button>
            <CharactersContainer />
        </>
    );
};

export default App;
