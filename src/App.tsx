import CharactersContainer from './features/characters/CharactersContainer';
import { initCharacters } from './features/characters/charactersSlice';
import { chargeBatteries } from './features/resources/resourcesSlice';
import { useAppDispatch, useAppSelector } from './hooks';

const App = () => {
    const chargedBatteries = useAppSelector((state) => state.resources.chargedBatteries);
    const dispatch = useAppDispatch();

    dispatch(initCharacters());

    const handleClick = () => {
        dispatch(chargeBatteries(1));
    };

    return (
        <>
            <p>{chargedBatteries}</p>
            <button onClick={handleClick}>Charge</button>
            <CharactersContainer />
        </>
    );
};

export default App;
