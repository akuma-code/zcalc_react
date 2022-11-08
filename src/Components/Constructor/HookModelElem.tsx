import React, { useState, useEffect, useContext, useMemo, HTMLAttributes, FC } from 'react'
import { useHookContext } from '../../Context/HookModelCTX'
import { useNodeList } from '../../hooks/useModelHooks'
import { HookNode } from '../../Models/WinFrameHookModel'
import { WinFrameModel_3 } from '../../Models/WinFrameModel'
import { DivProps } from '../../Types'
import { IListItem, IHook_Model, IHOOK_Node } from '../../Types/ModelsTypes'
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
        <div className={`flex h-[10em] min-w-[3em] border-8 border-double border-black bg-[#0f66ad] `} >{node.id}</div>)
}


const HookModelElem = (props: Props) => {
    const { setModels } = useHookContext()
    const { model } = props
    const [maxROW, setMaxRow] = useState(0)
    const [nodeCount, setNodeCount] = useState({})
    const [nodes, setNodes] = useState(model.nodes)
    const list_rows = useNodeList(nodes)


    const add = (model_id: string, lvl = 0,) =>
        setModels(prev => prev.map(mod => mod.id === model_id ? { ...mod, nodes: [...mod.nodes, new HookNode(lvl)] } : mod))

    const rem = (model_id: string, lvl: number) => {
        // const lvlNodes = [...nodes].filter(n => n.row_lvl === lvl)
        // console.log('lvlNodes before', lvlNodes)
        // lvlNodes.splice(0, 1)
        // console.log('lvlNodes after', lvlNodes)
        const lvlN = nodes.filter(n => n.row_lvl === lvl)
        const last = lvlN.length - 1
        nodes.splice(last, 1)
        setModels(prev => prev.map(mod =>
            (mod.id === model_id) ?
                { ...mod, nodes: [...nodes] }
                : mod
        ))

    }
    const remFullRow = (model_id: string, lvl = 0) =>
        setModels(prev => prev.map(mod => mod.id === model_id ? { ...mod, nodes: [...mod.nodes.filter(node => node.row_lvl !== lvl)] } : mod))
    const addRow = (maxrow: number) => add(model.id, maxrow + 1)


    useEffect(() => {
        setNodes(model.nodes)
        setMaxRow(maxLvl(list_rows))
    }, [model, list_rows])

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
                list_rows && list_rows.map((list_item) =>
                    <div key={list_item.id} className='relative'>
                        {list_item.row_nodes.length > 1 && <button className='absolute right-[-3em] bottom-2 border-2 bg-[#450563] p-1 mt-1 rounded-md border-[black]'
                            onClick={() => { rem(model.id, list_item.row_lvl) }}
                        >
                            <IcMinus hw={6} />
                        </button>}
                        {list_item.row_nodes.length < 5 &&
                            <button className='absolute left-[-3em] bottom-2 border-2 bg-[#450563] p-1 mt-1 rounded-md border-[black]'
                                onClick={() => { add(model.id, list_item.row_lvl) }}
                            >
                                <IcPlus hw={6} />
                            </button>

                        }
                        <NodeList
                            items={list_item.row_nodes}
                            renderNode={(hook_node) => <Node node={hook_node} key={hook_node.id} />}
                            key={list_item.id}
                        />
                    </div>
                )}
        </div>
    )
}


export default HookModelElem