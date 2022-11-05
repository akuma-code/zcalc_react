import React, { HTMLAttributes } from 'react'
import { WinFrameModel } from '../../Models/WinFrameModel'
import { IcRowDown, IcRowUp } from '../Icons/IconsPack'

type WFModelItemProps = {
    model: WinFrameModel
} & HTMLAttributes<HTMLDivElement>

export const WFModelItem: React.FC<WFModelItemProps> = ({ model }) => {
    const { frame } = model
    const rows = frame.wf_rows
    const OnModelClickFn = (e: React.MouseEvent<HTMLElement>) => {
        if (e.altKey === true) return model.RemRow()
        return model.AddRow()
    }

    const OnPartClickFn = (e: React.MouseEvent<HTMLElement>, row_id: string) => {
        // e.stopPropagation()
        if (e.altKey === true) return model.RemPart(row_id)
        return model.AddPart(row_id)
    }


    return (
        <div
            className='bg-slate-500 border-2 hover:bg-blue-700 relative'

        >
            <button className='absolute right-[-3em] top-1 border-2 bg-[#2165f8] p-1 rounded-md border-[black]'
                onClick={() => model.AddRow()}
            >
                <IcRowUp w={6} h={6} />

            </button>
            <button className='absolute right-[-3em] top-10 border-2 bg-[#2165f8] p-1 mt-1 rounded-md border-[black]'
                onClick={() => model.RemRow()}
            >
                <IcRowDown hw={6} />

            </button>
            {
                rows && rows.map(r => (
                    <ModelRow row_id={r.id} wf_parts={r.wf_parts} key={r.id} onClick={(e) => OnPartClickFn(e, r.id)} />
                ))
            }
        </div>
    )
}



type ModelRowProps = {
    row_id: string,
    wf_parts?: { id: string, row_id?: string }[]
} & HTMLAttributes<HTMLDivElement>
const ModelRow: React.FC<ModelRowProps> = ({ row_id, wf_parts }) => {

    const cls = (n: number) => `columns-${n} gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-2 border-[#000000] hover:bg-slate-400`
    // if (!wf_parts || wf_parts.length == 0) return (<div className='columns-1 gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-2 border-[#000000] hover:bg-slate-400'></div>)
    return (
        <div className={cls(wf_parts!.length)}>
            {
                wf_parts && wf_parts.map(p =>
                    <RowPart part_id={p.id} key={p.id} />
                )
            }
        </div>

    )
}


type RowPartProps = { part_id: string, } & HTMLAttributes<HTMLDivElement>
const RowPart: React.FC<RowPartProps> = ({ part_id }) => {
    return (
        <div className={`flex h-[10em] min-w-[3em] border-8 border-double border-black bg-[#0f66ad] `} >{part_id}</div>)
}