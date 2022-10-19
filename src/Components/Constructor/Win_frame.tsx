import React, { FC, useState } from 'react'
import { useToggle } from '../../hooks/useToggle'
import { v4 } from 'uuid'
type IWinFramePart = {
    part_id?: number | string
}
type IWinFrameRow = {

    row_id?: number
    wf_id?: number
    isActive?: boolean
    wf_parts?: IWinFramePart[]
    onClickFn?: () => void

}
type WinFrameProps = {
    id?: number
    wf_rows?: IWinFrameRow[]
}



export enum WF_CLS {
    ACTIVE = 'bg-[#f1f34f]',
    FRAME = `flex h-[10em] min-w-[5em] border-4 border-double bg-[#3ddd07] hover:bg-[#124402]`,
    WIN_FRAME = `flex flex-col-reverse w-fit`,
    WF_ROW = `columns-3 gap-x-6  bg-[#2e2e2e] p-5 border-2 border-[#fff] hover:border-[red] hover:border-2`

}
const getID = () => parseInt(v4(), 16)
const newframe = { part_id: getID() }

const WF_ROW: FC = ({ wf_parts }: IWinFrameRow): JSX.Element => {
    const [active, activeFn] = useToggle()
    const [frames, setFrames] = useState(wf_parts)
    const ADD = () => setFrames((prev: any) => [...prev, newframe])
    const REM = () => setFrames((prev: any) => {
        const r = prev.pop()
        console.log('rem: ', r);

        return [...prev]
    })
    const rowClickFn = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.altKey === true) return REM()

        ADD()
    }


    return (
        <div className={active ? WF_CLS.WF_ROW : `${WF_CLS.WF_ROW} ${WF_CLS.ACTIVE}`}
            onClick={(event) => rowClickFn(event)}
        >
            {frames && frames.map((f, idx) =>
                <div key={idx}>{f.part_id}</div>
            )}
        </div>
    )
}
export const WinFrame: FC<WinFrameProps> = ({ wf_rows }) => {
    const [wfRows, setWfRows] = useState<WinFrameProps['wf_rows'] | []>(wf_rows)
    const [selectedRow, setSelectedRow] = useState<IWinFrameRow>({})
    return (
        <div className={WF_CLS.WIN_FRAME}>
            {wfRows && wfRows.map((fr, idx) => (
                <WF_ROW {...fr} key={idx} />


            ))}

        </div>
    )
}


const initVals: WinFrameProps = {
    id: 1,
    wf_rows: [
        {
            row_id: 1,
            wf_id: 1,
            isActive: false,
            wf_parts: [
                { part_id: 1 },
                { part_id: 2 },
                { part_id: 3 },
            ]
        },
        {
            row_id: 2,
            wf_id: 1,
            wf_parts: [
                { part_id: 4 },
                { part_id: 5 },
                { part_id: 6 },
            ],
            isActive: false
        },

    ]
}