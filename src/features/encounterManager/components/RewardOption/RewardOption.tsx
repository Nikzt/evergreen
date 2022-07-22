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
        if (reward.unitId != null) dispatch(updateUnitWithReward({ unitId: reward.unitId, reward }));
    };

    return (
        <button className="reward-option" onClick={() => onRewardClick()}>
            <h3>{reward.label}</h3>
            <p>{getRewardDescription(reward)}</p>
        </button>
    );
};

export default RewardOption;
