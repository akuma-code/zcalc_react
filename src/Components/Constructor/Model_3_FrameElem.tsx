import React, { HTMLAttributes, useEffect, useState, useMemo } from 'react'
import { FrameNode, WinFrameModel_3 } from '../../Models/WinFrameModel'
import { IFrameNode, IFrameRowNodes } from '../../Types/ModelsTypes'
import { IcMinus, IcPlus, IcRowDown, IcRowUp } from '../Icons/IconsPack'

type ModelFrameElemProps = {
    children?: React.ReactNode
    model: WinFrameModel_3
}
interface NodeListProps<T> extends HTMLAttributes<HTMLDivElement> {
    items: T[]
    renderNode?: (item: T) => React.ReactNode

}
export const ModelFrameElem: React.FC<ModelFrameElemProps> = ({ model }) => {
    const { frame, addNode, remNode } = model
    const [nlist, setNlist] = useState(model.rows_list)
    const [nodes, setNodes] = useState(model.frame.nodes)
    function nodes_list(nodes: typeof frame.nodes) {

        const rows_list: IFrameRowNodes[] = []
        const lvls = Math.max(...nodes.map(n => n.row_idx))
        for (let i = 0; i <= lvls; i++) {
            rows_list.push([...nodes].filter(n => n.row_idx === i))
        }
        setNlist(rows_list)
        return rows_list
    }

    // const memoNodes = useMemo(() => nodes_list(nodes), [nodes])

    const memoList = useMemo(() => NodeList({
        items: nodes,
        renderNode: (node: IFrameNode) => <Node node={node} key={node.id} />
    }), [nodes])


    // useEffect(() => {
    //     setNlist(nodes_list(frame.nodes))
    //     console.log('nlist');


    // }, [model, frame.nodes])

    return (
        <div className='border-4'>

            {
                nodes_list(nodes).map((row_nodes, idx) => (
                    <div key={idx} className='relative'>
                        <button className='absolute right-[-3em] top-2 border-2 bg-[#2165f8] p-1 rounded-md border-[black]'
                            onClick={() => model.addRow()}
                        >
                            <IcRowUp w={6} h={6} />
                        </button>
                        <button className='absolute left-[-3em] top-1 border-2 bg-[#2165f8] p-1 mt-1 rounded-md border-[black]'

                        >
                            <IcRowDown hw={6} />
                        </button>
                        <button className='absolute left-[-3em] bottom-2 border-2 bg-[#450563] p-1 mt-1 rounded-md border-[black]'
                            onClick={() => model.remNode(idx)}
                        >
                            <IcMinus hw={6} />
                        </button>
                        <button className='absolute right-[-3em] bottom-2 border-2 bg-[#450563] p-1 mt-1 rounded-md border-[black]'
                            onClick={() => model.addNode(idx)}
                        >
                            <IcPlus hw={6} />
                        </button>
                        {<NodeList
                            items={row_nodes}
                            renderNode={(node: IFrameNode) => <Node node={node} key={node.id} />}
                        />}

                    </div>
                ))
            }
        </div>
    )
}

function NodeList<T>(row_nodes: NodeListProps<T>) {
    return <div
        className={['gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-2 border-[#000000] hover:bg-slate-400',
            `columns-${row_nodes.items.length}`].join(' ')}
    >
        {row_nodes.renderNode && row_nodes.items?.map(row_nodes.renderNode)}
    </div>
}

const Node: React.FC<{ node: IFrameNode } & HTMLAttributes<HTMLDivElement>> = ({ node }): JSX.Element => {
    return (
        <div className={`flex h-[10em] min-w-[3em] border-8 border-double border-black bg-[#0f66ad] `} >{node.id}</div>)
}
