import React from 'react';
import '../Styles/Frames.css'

interface IBaseFrameProps {
    pos_x: number,
    pos_y: number
}

export const BaseFrame: React.FC<IBaseFrameProps> = (props) => {
    return (
        <>
            <div className="outer box" style={{ left: props.pos_x, top: props.pos_y }}>
                Outer
                <div className="inner box">
                    Inner
                </div>
            </div>
        </>
    );
}
