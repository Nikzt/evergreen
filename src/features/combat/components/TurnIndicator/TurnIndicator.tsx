import { useAppSelector } from '../../../../hooks';
import './turnIndicator.scss';

const TurnIndicator = () => {
    const isPlayerTurn = useAppSelector((state) => state.combat.isPlayerTurn);
    const showTurnIndicator = useAppSelector((state) => state.combat.showTurnIndicator);
    const getTurnIndicatorText = () => {
        if (isPlayerTurn) return 'Your Turn';
        return 'Enemy Turn';
    };
    if (!showTurnIndicator) return <></>;
    return (
        <div className="overlay turn-indicator">
            <div className="text-container">
                <h1 className={isPlayerTurn ? 'player-turn' : 'enemy-turn'}>{getTurnIndicatorText()}</h1>
            </div>
        </div>
    );
};

export default TurnIndicator;
