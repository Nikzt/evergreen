import { getUnitConfig } from "../../unitConfigs";
import "./unitPortrait.scss";

type UnitInfoProps = {
    unitConfigId: string;
};

const UnitPortrait = ({unitConfigId}: UnitInfoProps) => {
    const unitConfig = getUnitConfig(unitConfigId);
    if (!unitConfig) return <></>;

    let icon;
    if (unitConfig.icon) icon = unitConfig.icon;
    else icon = null;

    return (
        <div className="unit-portrait">
            <img src={icon} alt="" className="unit-portrait-image"/>
            <p className="unit-portrait-name">{unitConfig.name}</p>
        </div>
    );
};

export default UnitPortrait;