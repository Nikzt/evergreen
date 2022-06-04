import { useSelectCombatUnit } from '../../../../hooks';
import './combatNumbers.scss';

type CombatNumbersProps = {
    unitId: string;
};

const CombatNumbers = ({ unitId }: CombatNumbersProps) => {
    const unit = useSelectCombatUnit(unitId);

    return (
        <div className="combat-numbers-container">
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
