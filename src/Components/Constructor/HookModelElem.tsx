import React, { useState, useEffect, useContext, useMemo, HTMLAttributes, FC } from 'react'
import { useHookContext } from '../../Context/HookModelCTX'
import { useGridModel, useNodeList } from '../../hooks/useModelHooks'
import { HookNode } from '../../Models/WinFrameHookModel'
import { WinFrameModel_3 } from '../../Models/WinFrameModel'
import { DivProps } from '../../Types'
import { IRowListItem, IHook_Model, IHOOK_Node } from '../../Types/ModelsTypes'
import { IcMinus, IcPlus, IcRowDown, IcRowUp } from '../Icons/IconsPack'

type Props = {
    model: IHook_Model
    children?: React.ReactNode
} & DivProps
interface NodeListProps<T> extends HTMLAttributes<HTMLDivElement> {
    items: T[]
    renderNode: (item: T) => React.ReactNode

}
interface HasLvlProp {
    row_lvl: number
}
const maxLvl = <T extends HasLvlProp>(arr: Array<T>): number => {
    const maxlvl = arr.reduce((max, current) => (max > current.row_lvl) ? max : current.row_lvl, 0)
    return maxlvl
}


function NodeList<T>(row: NodeListProps<T>) {
    if (!row.items) return <div>NO ITEMS</div>
    return <div
        className={['gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-2 border-[#000000] hover:bg-slate-400',
            `columns-${row.items.length}`].join(' ')}
    >
        {row.renderNode && row.items?.map(row.renderNode)}
    </div>
}

const Node: React.FC<{ node: IHOOK_Node } & HTMLAttributes<HTMLDivElement>> = ({ node }): JSX.Element => {
    return (
        <div className={`flex-col h-[10em] min-w-[3em] border-8 border-double border-black bg-[#0f66ad] justify-items-start`} >

            <div>{node.id}</div>
            <div className='text-white'>row_lvl: {node.row_lvl}</div>
            <div className='text-white'>row_id: {node.row_id}</div>
        </div>)
}


const HookModelElem = (props: Props) => {
    const { setModels } = useHookContext()
    const { model } = props
    const [maxROW, setMaxRow] = useState(0)
    const [nodeCount, setNodeCount] = useState({})
    const [nodes, setNodes] = useState(model.nodes)
    // const list_rows = useNodeList(nodes)
    const [rows, grid] = useGridModel(nodes)


    const add = (model_id: string, lvl: number, row_id?: string) => {
        const rid = grid[lvl].row_id
        const HN = new HookNode(lvl, rid)
        console.log('addrow_id', rid)
        setModels(prev => prev.map(mod => mod.id === model_id ? { ...mod, nodes: [...mod.nodes, HN] } : mod))
    }

    const rem = (model_id: string, lvl: number, row_id?: string) => {

        const lvlN = rows.filter(n => n.row_lvl === lvl)
        const last = lvlN.length - 1
        const deleted = nodes.splice(last, 1)
        setModels(prev => prev.map(mod =>
            (mod.id === model_id) ?
                { ...mod, nodes: [...nodes] }
                : mod
        ))
        console.log('deleted', deleted)
    }
    const remFullRow = (model_id: string, lvl = 0) =>
        setModels(prev => prev.map(mod => mod.id === model_id ? { ...mod, nodes: [...mod.nodes.filter(node => node.row_lvl !== lvl)] } : mod))
    const addRow = (maxrow: number) => add(model.id, maxrow)


    useEffect(() => {
        setNodes(model.nodes)
        setMaxRow(rows.length)
        // console.log(grid);

    }, [model, rows])

    return (
        <div className='relative'>
            {maxROW < 2 && <button className='absolute right-[-3em] top-1 border-2 bg-[#2165f8] p-1 mt-1 rounded-md border-[black]'
                onClick={() => { addRow(maxROW) }}
            >
                <IcRowUp w={6} h={6} />
            </button>
            }

            {maxROW >= 1 && <button className='absolute left-[-3em] top-1 border-2 bg-[#2165f8] p-1 mt-1 rounded-md border-[black]'
                onClick={() => remFullRow(model.id, maxROW)}
            >
                <IcRowDown hw={6} />
            </button>
            }
            {
                rows && rows.map((row_list) =>
                    <div key={row_list.id} className='relative'>
                        {
                            row_list.row_nodes.length < 5 &&
                            <button className='absolute left-[-3em] bottom-2 border-2 bg-[#450563] p-1 mt-1 rounded-md border-[black]'
                                onClick={() => { add(model.id, row_list.row_lvl, row_list.row_id) }}
                            >
                                <IcPlus hw={6} />
                            </button>

                        }
                        {
                            row_list.row_nodes.length > 1 &&
                            <button className='absolute right-[-3em] bottom-2 border-2 bg-[#450563] p-1 mt-1 rounded-md border-[black]'
                                onClick={() => { rem(model.id, row_list.row_lvl, row_list.row_id) }}
                            >
                                <IcMinus hw={6} />
                            </button>
                        }
                        <NodeList
                            items={row_list.row_nodes}
                            renderNode={(hook_node) => <Node node={hook_node} key={hook_node.id} />}
                        // key={list_item.row_id}
                        />
                    </div>
                )}
        </div>
    )
}


export default HookModelElem