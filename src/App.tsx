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
            <CharactersContainer />
            <hr></hr>
            <div>
                <h3>Resources</h3>
                <p>
                    Batteries: {chargedBatteries} / {batteries}
                </p>
                <p>
                    Metal: {metal}
                </p>
            </div>
            <hr></hr>
            <div>
                <h3>Forge</h3>
                <button onClick={craftBattery}>Battery</button>
            </div>
        </>
    );
};

export default App;
