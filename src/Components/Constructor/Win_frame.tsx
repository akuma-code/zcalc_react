import React, { FC, useState, HTMLAttributes, useEffect } from 'react'
import { useConstructCtx } from '../../Context/ConstructCTX'
import { useUtils } from '../../hooks/useUtils'
import { IWinFrame, IWinFramePart, IWinFrameRow, StrNum } from '../../Types/FrameTypes'
import { IcRowDown, IcRowUp, IcTrash } from '../Icons/IconsPack'
import { ButtonIcon } from '../UI/ButtonIcon'

type WinFrameProps = {
    id?: string
    remove?: (id: string) => void
    onClickFn: (frame: IWinFrame) => void
    wf_rows: IWinFrameRow[]
}

type WFRow_Props = IWinFrameRow
    & HTMLAttributes<HTMLDivElement>

type IWF_PartProps = { f_part: IWinFramePart }
    & HTMLAttributes<HTMLDivElement> & { min?: boolean, row_id?: number }

export enum WF_CLS {
    ACTIVE = 'bg-[#f1f34f]',
    FRAME = `flex h-[10em] min-w-[3em] border-8 border-double border-black bg-[#0f66ad] `,
    FRAME_MIN = `flex h-[3em] min-w-[3em] border-8 border-double border-black bg-[#0f66ad] `,
    WIN_RAMA_FRAME = `flex flex-col-reverse w-fit relative border-double border-2 border-black `,
    WF_ROW = `columns-3 gap-x-6  bg-[#2e2e2e] p-5 border-2 border-[#fff] max-w-[35em] hover:border-[red] hover:border-5`

}
const getID = useUtils.generateID



export const WinFrame: FC<WinFrameProps> = ({ wf_rows, id, remove, onClickFn }) => {
    const [localRows, setLocalRows] = useState<IWinFrameRow[]>([])
    const { setCurrent, setFrames } = useConstructCtx()

    const AddROW = (newrow?: IWinFrameRow, frame_id?: string) => {
        if (!newrow) return setLocalRows(prev => [...prev, initROW])
        setLocalRows(prev => [...prev, newrow])

    }

    const RemLastRow = () => {
        setLocalRows(prev => [...prev].filter((p, idx) => idx !== prev.length - 1))
    }


    useEffect(() => {

        setLocalRows(wf_rows)
    }, [])

    useEffect(() => {
        setFrames && setFrames(prev => prev.map(f => f.id === id ? { ...f, wf_rows: localRows } : f))
    }, [localRows])

    return (
        <div className={WF_CLS.WIN_RAMA_FRAME}

        >
            {
                localRows.map((row, idx) => (
                    <WF_ROW key={idx} wf_parts={row.wf_parts} level={idx + 1} isMin={idx === 1 && localRows.length === 2} />
                ))
            }
            <button className='absolute right-[-3em] top-1 border-2 bg-[#2165f8] p-1 rounded-md border-[black]'

            >
                <IcRowUp w={6} h={6} />

            </button>
            {localRows.length > 0 &&
                <button className='absolute right-[-3em] top-1 border-2 bg-[#2165f8] p-1 rounded-md border-[black]'
                    onClick={() => AddROW(new_row, id)}
                >
                    <IcRowUp hw={6} />

                </button>
            }

            {localRows.length > 1 &&
                <button className='absolute right-[-3em] top-10 border-2 bg-[#2165f8] p-1 mt-1 rounded-md border-[black]'
                    onClick={RemLastRow}
                >
                    <IcRowDown hw={6} />

                </button>
            }
            {localRows.length > 0 && remove && id &&

                <button className='absolute right-[-3.7em] bottom-4 border-2 bg-[#e40c0c] p-1 rounded-md border-[black]'
                    onClick={() => remove(id)}
                >
                    <IcTrash hw={8} color='#ffffff' />

                </button>
            }
        </div>
    )
}


const WF_ROW: FC<WFRow_Props> = ({ wf_parts, isMin, level }: IWinFrameRow): JSX.Element => {

    const [parts, setParts] = useState<IWinFramePart[] | []>(wf_parts || [])
    const ADD_Part = () => setParts((prev: IWinFramePart[]) => [...prev, new_part()])
    const REM_Part = () => setParts((prev: IWinFramePart[]) => [...prev].filter((p, idx) => idx !== parts.length - 1))

    const rowClickFn = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.altKey === true) return REM_Part()
        return ADD_Part()
    }



    const cls = (n: number) => `columns-${n} gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-2 border-[#000000] hover:bg-slate-400`

    return (
        <div
            className={cls(parts?.length) || WF_CLS.WF_ROW}
            onClick={rowClickFn}
        >
            {parts && parts.map((f, idx) =>
                <WfPart f_part={f} key={idx} min={isMin} row_id={level} />
            )}
        </div>
    )
}



const WfPart: FC<IWF_PartProps> = ({ min }): JSX.Element => {
    return (
        <div className={min ? WF_CLS.FRAME_MIN : WF_CLS.FRAME} />
    )
}

const genID = useUtils.generateID
const new_part = (row_id: number = 1) => ({ part_id: genID(), row_id: row_id })
const new_row = { wf_parts: [{ part_id: genID() }] }
const initROW = {
    id: 1,
    isActive: false,
    wf_parts: [{
        part_id: genID(),

    }]
}