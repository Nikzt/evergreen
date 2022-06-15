import ProgressBar from '@ramonak/react-progress-bar';
import colors from '../../../../common/scss/colors';

type HpBarProps = {
    hp: number;
    maxHp: number;
    isFriendly: boolean;
};

const HpBar = ({ hp, maxHp, isFriendly }: HpBarProps) => {
    return (
        <div className="hp-bar">
            <ProgressBar
                bgColor={isFriendly ? colors.friendly : colors.enemy}
                baseBgColor={colors.text}
                transitionDuration={'0.3s'}
                transitionTimingFunction={'ease-out'}
                borderRadius={'0'}
                isLabelVisible={true}
                labelAlignment="left"
                labelClassName="cast-bar-label"
                completed={(hp / maxHp) * 100}
                maxCompleted={100}
                className="hp-bar-progress progress-bar"
                customLabel={`HP: ${hp} / ${maxHp}`}
            />
        </div>
    );
};

export default HpBar;
