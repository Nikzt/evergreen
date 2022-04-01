type EffectIconProps = {
    label: string;
};

const EffectIcon = ({ label }: EffectIconProps) => {
    return (
        <div className="effect-icon-container">
            <img className="effect-icon" src={label} />
        </div>
    );
};

export default EffectIcon;
