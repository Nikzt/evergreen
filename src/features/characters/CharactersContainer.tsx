import { chargeBattery } from '../../common/actions';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectAreBatteriesAllCharged } from '../resources/resourcesSlice';
import { Character, initCharacters, selectCharacters } from './charactersSlice';

const CharactersContainer = () => {
    const characters = useAppSelector((state) => selectCharacters(state.characters.characters));
    const areBatteriesCharged = useAppSelector(selectAreBatteriesAllCharged);
    const dispatch = useAppDispatch();

    dispatch(initCharacters());

    const canChargeBatteries = (character: Character) => character.mp > 0 && !areBatteriesCharged;

    /**
     * Charge batteries using mp from a character
     * @param characterName Name of character
     */
    const handleChargeBatteriesClick = (character: Character) => {
        if (canChargeBatteries(character)) dispatch(chargeBattery(character.name));
    };

    return (
        <div className="characters-container">
            {characters.map((c) => (
                <div key={c.name}>
                    <h3>{c.name}</h3>
                    <ul>
                        <li>
                            HP: {c.hp} / {c.maxHp}
                        </li>
                        <li>
                            MP: {c.mp} / {c.maxMp}
                        </li>
                    </ul>
                    <button onClick={() => handleChargeBatteriesClick(c)} disabled={!canChargeBatteries(c)}>
                        Charge
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CharactersContainer;
