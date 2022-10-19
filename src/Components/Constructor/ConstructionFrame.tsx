import React, { useState, useLayoutEffect } from 'react'
import { useFRC } from '../../hooks/useFramesRC'
type RowGridType = {
    isMin?: boolean
    row: number
    cols: number
    row_frames: {
        posNumb: number
    }[]
    clickFn?: (row_id: number) => void
}

interface CF_Props {
    initframes: { row: number, posNumb: number }[]

}
const onClickFn = (grid_row: { row: number, row_frames: { posNumb: number }[], cols: number }) => {
    const nextNumber = Math.max(...grid_row.row_frames.map(g => g.posNumb)) + 1


}
const ConstructionFrame: React.FC<CF_Props> = ({ initframes }) => {
    const cls_rama = 'flex flex-col-reverse w-fit'
    const [grid] = useFRC(initframes)




    return (
        <div className={cls_rama}>
            {
                grid.map((grid_row, idx) => (
                    <RowGrid {...grid_row} key={idx} />
                ))
            }
        </div>
    )
}





const RowGrid: React.FC<RowGridType> = (grid): JSX.Element => {

    return (
        <div
            className={`gap-x-6 columns-${grid.cols} bg-[#2e2e2e] p-5 border-2 border-[#fff] hover:border-[red] hover:border-2`}

        >
            {
                grid.row_frames.map(f =>
                    grid.isMin ?
                        <RowFrameMin posNumb={f.posNumb} key={f.posNumb} />
                        :
                        <RowFrame posNumb={f.posNumb} key={f.posNumb} />
                )
            }
        </div>
    )
}

const RowFrame: React.FC<{ posNumb: number, isMin?: boolean }> = ({ isMin, posNumb }) => {
    if (isMin === false) return (
        <div className='flex h-[5em] min-w-[5em] border-4 border-double bg-[#3ddd07] hover:bg-[#124402]'>{posNumb}</div>
    )
    return (
        <div className='flex h-[10em] min-w-[5em] border-4 border-double bg-[#3ddd07] hover:bg-[#124402]'>{posNumb}</div>
    )
}

const RowFrameMin: React.FC<{ posNumb: number }> = (frame) => (
    <div className='flex h-[5em] min-w-[5em] border-4 border-double bg-[#3ddd07] hover:bg-[#124402]'>{frame.posNumb}</div>
)
export default ConstructionFrame