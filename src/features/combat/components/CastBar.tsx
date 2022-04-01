import { useSelectAbilityDamage, useSelectCombatUnit } from '../../../hooks';
import ProgressBar from '@ramonak/react-progress-bar';
import combatAbilities from '../../../common/combatAbilities';
import EffectIcon from './EffectIcon';

type CastBarProps = {
    unitId: string;
};

const CastBar = ({ unitId }: CastBarProps) => {
    const unit = useSelectCombatUnit(unitId);
    const damage = useSelectAbilityDamage(unitId);

    if (!unit || !unit.isCasting || unit.castingAbility === null) return <></>;

    const ability = combatAbilities[unit.castingAbility];

    return (
        <div className="cast-bar">
            <EffectIcon label={ability.icon} />
            <ProgressBar
                bgColor={'#f8ca65'}
                baseBgColor={'#222'}
                transitionDuration={'0.01'}
                transitionTimingFunction={'linear'}
                borderRadius={'3px'}
                isLabelVisible={false}
                completed={unit ? unit.castProgress : 0}
                maxCompleted={100}
                height="25px"
                className='progress-bar'
            />
        </div>
    );
};

export default CastBar;
