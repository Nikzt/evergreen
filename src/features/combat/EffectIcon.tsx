type EffectIconProps = {
    label: string;
}

const EffectIcon = ({ label }: EffectIconProps) => {
    return <div className="effect-icon-container">
        <div className="effect-icon">
            {label}
        </div>
    </div>
}

export default EffectIcon;