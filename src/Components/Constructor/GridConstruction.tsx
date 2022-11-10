import React, { useState, HTMLAttributes, useEffect } from 'react'
import { MakeNodes, useGridControl } from '../../hooks/useColsControl'
import { useUtils } from '../../hooks/useUtils'
import { CNode, ConstructionModel } from '../../Models/WinFrameHookModel'
import { IGrid } from '../../Types/ModelsTypes'
import { IcMinus, IcPlus, IcRowDown, IcRowUp } from '../Icons/IconsPack'



const expandGrid = (grid: IGrid[]) => {
    const res = grid.map(row => MakeNodes(row.row_id, row.cols))
    return res
}

const GridConstruction = ({ grid, nodes }: ConstructionModel) => {
    const [GR, setGR] = useGridControl(grid)
    const [gNodes, setGNodes] = useState<CNode[][]>([])

    useEffect(() => {
        setGNodes(expandGrid(GR))


    }, [GR])

    return (
        <div className='relative'>
            {<button className='absolute right-[-3em] top-1 border-2 bg-[#2165f8] p-1 mt-1 rounded-md border-[black]'
                onClick={() => { }}
            >
                <IcRowUp w={6} h={6} />
            </button>
            }

            {<button className='absolute left-[-3em] top-1 border-2 bg-[#2165f8] p-1 mt-1 rounded-md border-[black]'
                onClick={() => { }}
            >
                <IcRowDown hw={6} />
            </button>
            }
            {


            }
        </div>
    )
}


interface ListProps<T> extends HTMLAttributes<HTMLDivElement> {
    items: T[]
    renderNode: (item: T) => React.ReactNode

}


function NodeList<T>(row: ListProps<T>) {
    if (!row.items) return <div>NO ITEMS</div>
    return <div
        className={['gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-2 border-[#000000] hover:bg-slate-400',
            `columns-${row.items.length}`].join(' ')}
    >
        {row.renderNode && row.items?.map(row.renderNode)}
    </div>
}

function GFrame(grid: IGrid[]) {
    const rowNodes = grid.map(gRow => (MakeNodes(gRow.row_id, gRow.cols)))
    return (
        <div className="relative">
            {rowNodes.map(row =>
                <NodeList items={row} key={Date.now()}
                    renderNode={(cnode) => <Node node={cnode} key={cnode.id} />} />
            )}
        </div>
    )
}

const Node: React.FC<{ node: CNode } & HTMLAttributes<HTMLDivElement>> = ({ node }): JSX.Element => {
    return (
        <div className={`flex-col h-[10em] min-w-[3em] border-8 border-double border-black bg-[#0f66ad] justify-items-start`} >

            <div>{node.id}</div>
            <div className='text-white'>row_id: {node.row_id}</div>
        </div>)
}



export default GridConstruction


{/* <div key={Date.now()} className='relative'>
                    {

                        <button className='absolute left-[-3em] bottom-2 border-2 bg-[#450563] p-1 mt-1 rounded-md border-[black]'
                            onClick={() => { }}
                        >
                            <IcPlus hw={6} />
                        </button>

                    }
                    {

                        <button className='absolute right-[-3em] bottom-2 border-2 bg-[#450563] p-1 mt-1 rounded-md border-[black]'
                            onClick={() => { }}
                        >
                            <IcMinus hw={6} />
                        </button>
                    }
                    <NodeList
                        items={gNodes[0]}
                        renderNode={(hook_node) => <Node node={hook_node} key={hook_node.id} />}
                    // key={list_item.row_id}
                    />
                </div> */}