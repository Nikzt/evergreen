import { useAppSelector, useSelectCombatUnit, useSelectNextEnemyAbility } from '../../../../hooks';
import combatAbilities from '../../abilities/combatAbilities';
import { CombatAction } from '../../state/combatModels';
import calculateAbilityDamage from '../../abilities/calculateAbilityDamage';
import './enemyActionPreview.scss';
import { selectFullCombatAction } from '../../state/combatSelectors';

type EnemyActionPreviewProps = {
    unitId: string;
};

const EnemyActionPreview = ({ unitId }: EnemyActionPreviewProps) => {
    const combatAction = useSelectNextEnemyAbility(unitId);
    const unit = useSelectCombatUnit(unitId);
    const state = useAppSelector((state) => state);

    const calculateDamage = (combatAction: CombatAction) => {
        if (!combatAction) return 0;
        const combatActionFull = selectFullCombatAction(combatAction)(state);
        if (!combatActionFull) return 0;
        return calculateAbilityDamage(combatActionFull);
    };

    if (!combatAction || !unit) return <></>;

    return (
        <div className="enemy-action-preview">
            <img src={combatAbilities[combatAction.abilityId].icon} alt="missing ability icon" />
            <span className="combat-number">{calculateDamage(combatAction)}</span>
        </div>
    );
};

export default EnemyActionPreview;
