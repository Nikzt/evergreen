import { useSelectCombatUnit, useSelectNextEnemyAbility } from '../../../../hooks';
import combatAbilities from '../../abilities/combatAbilities';
import { CombatAction } from '../../state/combatModels';
import calculateAbilityDamage from '../../abilities/calculateAbilityDamage';
import './enemyActionPreview.scss';

type EnemyActionPreviewProps = {
    unitId: string;
};

const EnemyActionPreview = ({ unitId }: EnemyActionPreviewProps) => {
    const combatAction = useSelectNextEnemyAbility(unitId);
    const unit = useSelectCombatUnit(unitId);

    if (!combatAction || !unit) return <></>;

    const calculateDamage = (combatAction: CombatAction) => {
        return calculateAbilityDamage(combatAction);
    };

    return (
        <div className="enemy-action-preview">
            <img src={combatAbilities[combatAction.abilityId].icon} alt="missing ability icon" />
            <span className="combat-number">{calculateDamage(combatAction)}</span>
        </div>
    );
};

export default EnemyActionPreview;
