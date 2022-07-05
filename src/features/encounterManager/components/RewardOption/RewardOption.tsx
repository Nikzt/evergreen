import { useAppDispatch } from '../../../../hooks';
import { updateUnitWithReward } from '../../../combat/state/combatSlice';
import { Reward, getRewardDescription } from '../../rewards';
import './rewardOption.scss';

type RewardOptionProps = {
    reward: Reward;
};

const RewardOption = ({ reward }: RewardOptionProps) => {
    const dispatch = useAppDispatch();
    const onRewardClick = () => {
        if (reward.value.unitId != null) dispatch(updateUnitWithReward({ unitId: reward.value.unitId, reward }));
    };

    return (
        <button className="reward-option" onClick={() => onRewardClick()}>
            <h3>{reward.value.label}</h3>
            <p>{getRewardDescription(reward)}</p>
        </button>
    );
};

export default RewardOption;
