import { useAppDispatch, useAppSelector } from '../../../../hooks';
import { selectAllFriendlyUnitsMaxHp } from '../../../combat/state/combatSelectors';
import { updateUnitWithReward } from '../../../combat/state/combatSlice';
import { Reward, getRewardDescription, RewardId } from '../../rewards';
import './rewardOption.scss';

type RewardOptionProps = {
    reward: Reward;
};

const RewardOption = ({ reward }: RewardOptionProps) => {
    const dispatch = useAppDispatch();
    const allMaxHp = useAppSelector(selectAllFriendlyUnitsMaxHp);
    const disableReward = reward.id === RewardId.HEALTH && allMaxHp;
    const onRewardClick = () => {
        if (disableReward)
            return;
        if (reward.unitIds != null)
        reward.unitIds.forEach((id) => {
            dispatch(updateUnitWithReward({ unitId: id, reward }));
        })
    };

    return (
        <button className={`reward-option`} disabled={disableReward} onClick={() => onRewardClick()}>
            <h3>{reward.label}</h3>
            <p>{getRewardDescription(reward)}</p>
        </button>
    );
};

export default RewardOption;
