import './unitClickBox.scss';

type UnitClickBoxProps = {
    clickCallback: () => void;
};

const UnitClickBox = ({ clickCallback }: UnitClickBoxProps) => {
    return <button className="unit-click-box unit-overlay" onClick={() => clickCallback()}></button>;
};

export default UnitClickBox;
