import { useSelectAbilityDamage, useSelectCombatUnit } from '../../hooks';
import ProgressBar from '@ramonak/react-progress-bar';
import combatAbilities, { CombatAbility } from '../../common/combatAbilities';
import EffectIcon from './EffectIcon';

type CastBarProps = {
    unitId: string;
};

const CastBar = ({ unitId }: CastBarProps) => {
    const unit = useSelectCombatUnit(unitId);
    const damage = useSelectAbilityDamage(unitId);

    if (!unit || !unit.isCasting || unit.castingAbility === null) return <></>

    const ability = combatAbilities[unit.castingAbility]

    return (
        <div className="cast-bar">
            <EffectIcon label={damage.toString()} />
            <ProgressBar
                bgColor={ability?.castBarColor}
                transitionDuration={'0.01'}
                transitionTimingFunction={'linear'}
                borderRadius={'0'}
                isLabelVisible={true}
                labelAlignment="left"
                labelClassName='cast-bar-label'
                completed={unit ? unit.castProgress : 0}
                maxCompleted={100}
                height="30px"
                customLabel={ability?.name}
                
            />
        </div>
    );
};

export default CastBar;
