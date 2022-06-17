import { useAppSelector } from '../../../../hooks';
import RewardOption from '../RewardOption/RewardOption';
import './rewardSelector.scss';

const RewardSelector = () => {
    const rewards = useAppSelector((state) => state.combat.availableRewards);
    return (
        <div className="reward-selector-overlay">
            <div className="reward-selector">
                <h1>Foes Vanquished</h1>
                <p className="reward-selector-flavor-text">The corpses of your enemies turn to dust, as their corrupted life essence fills your soul.</p>
                <h3>Select your reward:</h3>
                <div className="rewards-options-list">
                    {rewards.map(r => <RewardOption reward={r} />)}
                </div>
            </div>
        </div>
    );
}

export default RewardSelector;