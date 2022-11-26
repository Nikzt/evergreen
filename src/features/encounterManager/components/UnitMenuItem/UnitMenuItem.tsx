import { useSelectCombatUnit } from '../../../../hooks';
import './unitMenuItem.scss';
import UnitInfo from '../../../../common/components/UnitInfo/UnitInfo';

export type UnitMenuItemProps = {
    unitId: string;
};

const UnitMenuItem = ({ unitId }: UnitMenuItemProps) => {
    const unit = useSelectCombatUnit(unitId);

    if (!unit) return <div>Unit info not found</div>;

    return (
        <div className="unit-menu-item friendly-unit-ui-element friendly">
            <section className="unit-menu-item__info-section">
                <UnitInfo unitId={unitId}/>
            </section>
            <section className="unit-menu-item__stats-section">
                <table className="unit-menu-item__stats-table">
                    <tr>
                        <th>Str</th>
                        <td>{unit.strength}</td>
                    </tr>
                    <tr>
                        <th>Block</th>
                        <td>{unit.blockPercent}%</td>
                    </tr>
                </table>
            </section>
            <section className="unit-menu-item__buttons-section">
                <button className="menu-button">Abilities</button>
                <button className="menu-button">Powers</button>
                <button className="menu-button important-button">Upgrade</button>
            </section>
        </div>
    );
};

export default UnitMenuItem;
