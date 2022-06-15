import CombatContainer from './features/combat/components/CombatContainer/CombatContainer';
import './reset.css';
import './app.scss';
import { RootState } from './store';
import { useAppSelector } from './hooks';
import GameStartScreen from './features/encounterManager/components/GameStartScreen';
import UnitManagerScreen from './features/encounterManager/components/UnitManagerScreen';

const App = () => {
    const isCombatInProgress = useAppSelector((state: RootState) => state.combat.isCombatInProgress);
    const isCombatVictorious = useAppSelector((state: RootState) => state.combat.isCombatVictorious);
    const isCombatFailed = useAppSelector((state: RootState) => state.combat.isCombatFailed);

    return (
        <div className="app">
            {!isCombatInProgress && isCombatFailed && <GameStartScreen />}
            {!isCombatInProgress && isCombatVictorious && <UnitManagerScreen />}
            {isCombatInProgress && <CombatContainer />}
        </div>
    );
};

export default App;
