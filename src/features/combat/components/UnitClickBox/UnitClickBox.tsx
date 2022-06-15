import './unitClickBox.scss';

type UnitClickBoxProps = {
    clickCallback: Function;
};

const UnitClickBox = ({ clickCallback }: UnitClickBoxProps) => {
    return <button className="unit-click-box" onClick={() => clickCallback()}></button>;
};

export default UnitClickBox;
