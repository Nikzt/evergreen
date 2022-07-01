type TargetLineProps = {
    sourceUnitId: string;
    targetUnitId: string | null;
    isFriendlySource: boolean;
    isBlocking: boolean;
};

const TargetLine = ({ sourceUnitId, targetUnitId, isFriendlySource, isBlocking }: TargetLineProps) => {
    const getCoordinatesOfUnitAnchorPoint = (unitId: string) => {
        const unitAnchorPoint = document.getElementById(unitId + '-anchor-point');
        if (!unitAnchorPoint) return null;
        const rect = unitAnchorPoint.getBoundingClientRect();
        const combatContainer = document.getElementById('combat-container');
        const offsetLeft = combatContainer?.offsetLeft ?? 0;
        return {
            x: rect.x - offsetLeft,
            y: rect.y
        };
    }

    const calculateLineCoordinates = () => {
        if (!sourceUnitId || !targetUnitId) return;

        const sourceUnitAnchorPoint = getCoordinatesOfUnitAnchorPoint(sourceUnitId);
        const targetUnitAnchorPoint = getCoordinatesOfUnitAnchorPoint(targetUnitId);
        if (sourceUnitAnchorPoint == null || targetUnitAnchorPoint == null) return;

        // If line is perfectly vertical, the gradient will not work
        if (sourceUnitAnchorPoint.x - targetUnitAnchorPoint.x === 0)
            sourceUnitAnchorPoint.x += 0.0001
        return {
            x1: sourceUnitAnchorPoint.x,
            y1: sourceUnitAnchorPoint.y,
            x2: targetUnitAnchorPoint.x,
            y2: targetUnitAnchorPoint.y,
            lineColor: '#f8ca65aa',
        }
    }

    const lineProps = calculateLineCoordinates();

    if (!lineProps) return <></>;

    return (
        <>
            <line
                x1={lineProps.x1}
                y1={lineProps.y1}
                x2={lineProps.x2}
                y2={lineProps.y2}
                strokeWidth="3"
                stroke="url(#lgrad)"
                style={{stroke: "url(#lgrad)"}}
            />
        </>
    );
};

export default TargetLine;
