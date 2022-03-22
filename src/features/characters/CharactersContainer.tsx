import { chargeBattery } from '../../common/actions';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectAreBatteriesAllCharged } from '../resources/resourcesSlice';
import { initCharacters, selectCharacters } from './charactersSlice';

const CharactersContainer = () => {
    const characters = useAppSelector((state) => selectCharacters(state.characters.characters));
    const areBatteriesCharged = useAppSelector(selectAreBatteriesAllCharged);
    const dispatch = useAppDispatch();

    dispatch(initCharacters());

    /**
     * Charge batteries for given character
     * @param characterName Name of character
     */
    const handleChargeBatteriesClick = (characterName: string) => {
        const character = characters.find((c) => c.name === characterName);
        if (character && character.mp > 0 && !areBatteriesCharged) dispatch(chargeBattery(characterName));
    };

    return (
        <div className="characters-container">
            {characters.map((c) => (
                <div key={c.name}>
                    <h3>{c.name}</h3>
                    <ul>
                        <li>HP: {c.hp} / {c.maxHp}</li>
                        <li>MP: {c.mp} / {c.maxMp}</li>
                    </ul>
                    <button onClick={() => handleChargeBatteriesClick(c.name)}>Charge</button>
                </div>
            ))}
        </div>
    );
};

export default CharactersContainer;
