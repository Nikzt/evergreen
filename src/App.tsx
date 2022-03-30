import CombatContainer from './features/combat/CombatContainer';
import './reset.css';
import './app.css';
import { RootState } from './store';
import { useAppSelector } from './hooks';
import GameStartScreen from './features/encounterManager/GameStartScreen';
import UnitManagerScreen from './features/encounterManager/UnitManagerScreen';

const App = () => {
    const isCombatInProgress = useAppSelector((state: RootState) => state.combat.isCombatInProgress);
    const isCombatVictorious = useAppSelector((state: RootState) => state.combat.isCombatVictorious);
    const isCombatFailed = useAppSelector((state: RootState) => state.combat.isCombatFailed);

    return (
        <>
            {!isCombatInProgress && isCombatFailed && <GameStartScreen />}
            {!isCombatInProgress && isCombatVictorious && <UnitManagerScreen />}
            {isCombatInProgress && <CombatContainer />}
        </>
    );
};

export default App;
