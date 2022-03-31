import { useSelectCombatUnit } from '../../../hooks';

type CombatNumbersProps = {
    unitId: string;
};

const CombatNumbers = ({ unitId }: CombatNumbersProps) => {
    const unit = useSelectCombatUnit(unitId);

    return (
        <div
            className="combat-numbers-container"
            style={{
                bottom: unit?.isFriendly ? 'none' : '-20px',
                top: !unit?.isFriendly ? 'none' : '-40px',
            }}
        >
            <div className="combat-numbers">
                {unit?.combatNumbers.map((c, idx) => (
                    <div key={idx} className="combat-number">
                        {c}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CombatNumbers;
