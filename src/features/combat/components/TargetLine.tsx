import { useMemo } from 'react';

const getId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return null;
    return el;
};

const getOffset = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset,
        width: rect.width || el.offsetWidth,
        height: rect.height || el.offsetHeight,
    };
};

const lineThickness = 1;

type TargetLineProps = {
    sourceUnitId: string;
    targetUnitId: string | null;
    isFriendlySource: boolean;
    isBlocking: boolean;
};

const TargetLine = ({ sourceUnitId, targetUnitId, isFriendlySource, isBlocking }: TargetLineProps) => {
    const lineProps = useMemo(() => {
        if (!sourceUnitId || !targetUnitId) return;

        const div1 = getId(isFriendlySource ? sourceUnitId : targetUnitId);
        const div2 = getId(isFriendlySource ? targetUnitId : sourceUnitId);

        if (!div1 || !div2) return;
        const off1 = getOffset(div1);
        const off2 = getOffset(div2);

        const staggerLinesOffset = isFriendlySource ? -5 : 5;

        // bottom center of unit container
        const x1 = off1.left + off1.width / 2 + staggerLinesOffset;
        const y1 = off1.top;

        // top center of unit container
        const x2 = off2.left + off2.width / 2 + staggerLinesOffset;
        const y2 = off2.top + off2.height;

        // distance
        const length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

        // center
        const cx = (x1 + x2) / 2 - length / 2;
        const cy = (y1 + y2) / 2 - lineThickness / 2;

        // angle
        const angle = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);

        // set line color
        let lineColor = '#f8ca65aa';
        if (isBlocking) lineColor = '#0da9e7aa';
        else if (!isFriendlySource) lineColor = '#e66d64aa';

        return {
            cx,
            cy,
            length,
            angle,
            lineColor,
        };
    }, [sourceUnitId, targetUnitId, isFriendlySource, isBlocking]);

    if (!lineProps) return <></>;

    return (
        <>
            <div
                style={{
                    padding: '0px',
                    margin: '0px',
                    height: lineThickness + 'px',
                    backgroundColor: lineProps.lineColor,
                    lineHeight: '1px',
                    position: 'absolute',
                    left: lineProps.cx + 'px',
                    top: lineProps.cy + 'px',
                    width: lineProps.length + 'px',
                    transform: 'rotate(' + lineProps.angle + 'deg)',
                }}
            ></div>
        </>
    );
};

export default TargetLine;
