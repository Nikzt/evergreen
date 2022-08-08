import ProgressBar from '@ramonak/react-progress-bar';
import colors from '../../../../common/scss/colors';
import { useSelectCombatUnit } from '../../../../hooks';

type HpBarProps = {
    unitId: string;
};

const HpBar = ({unitId}: HpBarProps) => {
    const unit = useSelectCombatUnit(unitId);
    if (!unit) return <></>;
    return (
        <div className="hp-bar">
            <ProgressBar
                bgColor={unit.isFriendly ? colors.friendly : colors.enemy}
                baseBgColor={colors.text}
                transitionDuration={'0.3s'}
                transitionTimingFunction={'ease-out'}
                borderRadius={'0'}
                isLabelVisible={true}
                labelAlignment="left"
                labelClassName="cast-bar-label"
                completed={((unit.hp + unit.armor) / unit.maxHp) * 100}
                maxCompleted={100}
                className="hp-bar-progress progress-bar"
                customLabel={`${unit.hp} / ${unit.maxHp}`}
                height="100%"
            />
        </div>
    );
};

export default HpBar;
