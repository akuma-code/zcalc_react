import React, { FC, useState, HTMLAttributes, useEffect } from 'react'
import { useConstructCtx } from '../../Context/ConstructCTX'
import { useUtils } from '../../hooks/useUtils'
import { IWinFramePart, IWinFrameRow } from '../../Types/FrameTypes'

type WinFrameProps = {
    id?: number
    wf_rows: IWinFrameRow[]
}

type WFRow_Props = IWinFrameRow
    & HTMLAttributes<HTMLDivElement>

type IWF_PartProps = { f_part: IWinFramePart }
    & HTMLAttributes<HTMLDivElement> & { min?: boolean }

export enum WF_CLS {
    ACTIVE = 'bg-[#f1f34f]',
    FRAME = `flex h-[10em] min-w-[3em] border-4 border-double bg-[#3ddd07] hover:bg-[#124402]`,
    FRAME_MIN = `flex h-[3em] min-w-[3em] border-4 border-double bg-[#3ddd07] hover:bg-[#124402]`,
    WIN_RAMA_FRAME = `flex flex-col-reverse w-fit relative border-double border-2 border-cyan-400`,
    WF_ROW = `columns-3 gap-x-6  bg-[#2e2e2e] p-5 border-2 border-[#fff] max-w-[35em] hover:border-[red] hover:border-2`

}

export const WinFrame: FC<WinFrameProps> = ({ wf_rows }) => {
    // const { frames, parts, rows, setRows, setFrames } = useConstructCtx()
    const [localRows, setLocalRows] = useState<IWinFrameRow[]>([])
    const AddROW = (newrow?: IWinFrameRow) => {
        if (!newrow) return setLocalRows(prev => [...prev, initROW])
        setLocalRows(prev => [...prev, newrow])

    }

    useEffect(() => {
        setLocalRows(wf_rows)
    }, [wf_rows])
    const new_row = { id: localRows.length + 1, wf_parts: [{ part_id: genID(), row_id: localRows.length + 1 }] }
    return (
        <div className={WF_CLS.WIN_RAMA_FRAME}
        >
            {
                localRows.map((row, idx) => (
                    <WF_ROW key={idx} wf_parts={row.wf_parts} isMin={idx === 1 && localRows.length === 2} />
                ))
            }
            <button className='absolute right-[-6em] top-1 border-1 bg-[#10aa84] p-1 rounded-sm'
                onClick={() => AddROW(new_row)}
            >
                ADD ROW
            </button>
        </div>
    )
}


const WF_ROW: FC<WFRow_Props> = ({ wf_parts, isMin }: IWinFrameRow): JSX.Element => {

    const [parts, setParts] = useState<IWinFramePart[] | []>(wf_parts || [])
    const ADD_Part = () => setParts((prev: IWinFramePart[]) => [...prev, new_part()])
    const ADD_PartR = (row_id: number) => setParts((prev: IWinFramePart[]) => [...prev, new_part(row_id)])
    const REM_Part = () => setParts((prev: IWinFramePart[]) => [...prev].filter((p, idx) => idx !== parts.length - 1))

    const rowClickFn = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.altKey === true) return REM_Part()
        if (event.ctrlKey === true) return ADD_PartR(2)
        return ADD_Part()
    }



    const cls = (n: number) => `columns-${n} gap-x-6 max-w-[35em] bg-[#2e2e2e] p-5 border-2 border-[#fff] hover:border-[red] hover:border-2`

    return (
        <div
            className={cls(parts?.length) || WF_CLS.WF_ROW}
            onClick={rowClickFn}
        >
            {parts && parts.map((f, idx) =>
                <WfPart f_part={f} key={idx} min={isMin} />
            )}
        </div>
    )
}



const WfPart: FC<IWF_PartProps> = ({ f_part, min }): JSX.Element => {
    return <div className={min ? WF_CLS.FRAME_MIN : WF_CLS.FRAME}>
        {typeof f_part.part_id === 'string' ?
            f_part.part_id?.slice(0, 6)
            :
            f_part.part_id?.toFixed(0)
        }
    </div>
}

const genID = useUtils.generateID
const new_part = (row_id: number = 1) => ({ part_id: genID(), row_id: row_id })
const initROW = {
    id: 1,
    isActive: false,
    wf_parts: [{
        part_id: genID(),
        row_id: 1
    }]
}