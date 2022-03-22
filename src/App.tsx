import CharactersContainer from './features/characters/CharactersContainer';
import { initCharacters } from './features/characters/charactersSlice';
import TimerManager from './features/events/timerManager';
import { useAppDispatch, useAppSelector } from './hooks';

const App = () => {
    const chargedBatteries = useAppSelector((state) => state.resources.chargedBatteries);
    const batteries = useAppSelector((state) => state.resources.batteries)
    const dispatch = useAppDispatch();
    TimerManager.startTimer();

    dispatch(initCharacters());

    return (
        <>
            <p>{chargedBatteries} / {batteries}</p>
            <CharactersContainer />
        </>
    );
};

export default App;
