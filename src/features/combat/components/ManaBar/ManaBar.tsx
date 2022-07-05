import colors from '../../../../common/scss/colors';
import './manaBar.scss';

type ManaBarProps = {
    mana: number;
    maxMana: number;
};

const ManaBar = ({ mana, maxMana }: ManaBarProps) => {
    const manaIcons = new Array(maxMana).fill(1).map((val, i) => {
        return {
            idx: i,
            isManaAvailable: i < mana,
        };
    });

    return (
        <div className="mana-bar">
            {manaIcons.map((i) => (
                <svg className="mana-icon" key={i.idx}>
                    <rect
                        width="20"
                        height="10"
                        fill={i.isManaAvailable ? colors.mana : 'grey'}
                        stroke={colors.secondaryV1}
                    />
                </svg>
            ))}
        </div>
    );
};

export default ManaBar;
