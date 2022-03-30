import ProgressBar from '@ramonak/react-progress-bar';

type HpBarProps = {
    hp: number;
    maxHp: number;
    isFriendly: boolean;
};

const HpBar = ({ hp, maxHp, isFriendly }: HpBarProps) => {
    return (
        <div className="hp-bar">
            <div className="hp-bar-label">HP:</div>
            <ProgressBar
                bgColor={isFriendly ? '#32a852' : '#eb4242'}
                transitionDuration={'0.3s'}
                transitionTimingFunction={'ease-out'}
                borderRadius={'0'}
                isLabelVisible={true}
                labelAlignment="left"
                labelClassName="cast-bar-label"
                completed={(hp / maxHp) * 100}
                maxCompleted={100}
                height="20px"
                className="hp-bar-progress"
                customLabel={`${hp} / ${maxHp}`}
            />
        </div>
    );
};

export default HpBar;
