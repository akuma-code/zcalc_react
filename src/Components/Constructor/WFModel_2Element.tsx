import React, { useState, HTMLAttributes } from 'react'
import { FrameNode, WinFrameModel_2 } from '../../Models/WinFrameModel'
import { IFrameNode, IWFModel_2 } from '../../Types/ModelsTypes'

type ElementProps = {
    model: WinFrameModel_2
} & HTMLAttributes<HTMLDivElement>


export const WFmodelElement: React.FC<ElementProps> = ({ model }) => {
    const { frame } = model
    function rows(nodes: IFrameNode[]) {
        const maxlvl = frame.rows.length
        const result = []
        for (let i = 0; i < maxlvl; i++) {
            const row_id = frame.rows[i].id
            const lvlnodes = nodes?.filter(n => n.row_id === row_id)
            result.push(lvlnodes)
        }
        console.log('result', result)
        return result
    }

    const ROWS = () => {
        if (!frame.nodes) return
        const nodes = rows(frame.nodes)
        const elemnts = (nds: FrameNode[]) => nds.map(n => n.element)
        const cls = (n: number) => `columns-${n} gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-2 border-[#000000] hover:bg-slate-400`
        return (
            <div >
                {nodes && nodes.map((nds, idx) => (
                    <div className={cls(elemnts(nds).length)} key={idx}
                        onClick={() => model.addNode()}>
                        {elemnts(nds)}
                    </div>
                ))}
            </div>
        )
    }
    return ROWS() || <></>

}