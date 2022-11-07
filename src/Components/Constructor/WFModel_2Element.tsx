import React, { useState, HTMLAttributes } from 'react'
import { FrameNode, WinFrameModel_3 } from '../../Models/WinFrameModel'
import { IFrameNode, IWFModel_2 } from '../../Types/ModelsTypes'

type ElementProps = {
    model: WinFrameModel_3
} & HTMLAttributes<HTMLDivElement>


export const WFmodelElement: React.FC<ElementProps> = ({ model }) => {
    const { frame } = model
    function rows(nodes: IFrameNode[]) {
        return [nodes]
    }

    const ROWS = () => {
        if (!frame.nodes) return
        const nodes = rows(frame.nodes)
        const elemnts = (nds: FrameNode[]) => nds.map(n => n)
        const cls = (n: number) => `columns-${n} gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-2 border-[#000000] hover:bg-slate-400`
        return (
            <div >
                {nodes && nodes.map((nds, idx) => (
                    <div className={cls(elemnts(nds).length)} key={idx}
                        onClick={() => model.addNode()}>
                    </div>
                ))}
            </div>
        )
    }
    return ROWS() || <></>

}