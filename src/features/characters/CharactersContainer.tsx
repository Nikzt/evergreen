import { useAppDispatch, useAppSelector } from '../../hooks';
import { initCharacters, selectCharacters } from './charactersSlice';

const CharactersContainer = () => {
    const characters = useAppSelector((state) => selectCharacters(state.characters.characters));
    const dispatch = useAppDispatch();

    dispatch(initCharacters());

    return (
        <div className="characters-container">
            {characters.map((c) => (
                <div key={c.name}>
                    <h3>{c.name}</h3>
                    <ul>
                        <li>HP: {c.hp}</li>
                        <li>MP: {c.mp}</li>
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default CharactersContainer;
