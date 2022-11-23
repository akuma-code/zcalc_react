import React, { useState, HTMLAttributes, useEffect } from 'react'
import { useFrameRow, MakeNodes, useGridControl, FRow } from '../../hooks/useColsControl'
import { useUtils } from '../../hooks/useUtils'
import { CNode, ConstructionModel } from '../../Models/WinFrameHookModel'
import { IGridRow } from '../../Types/ModelsTypes'
import { IcMinus, IcPlus, IcRowDown, IcRowUp } from '../Icons/IconsPack'


export type IGridConstProps = Pick<ConstructionModel, 'grid' | 'nodes'> & { id: string }
export type INodeCols = { id: string, row_id: string }
type IRowNodes = { id?: string, row_id: string }[]
const expandGrid = (grid: IGridRow[]) => {
    const res = grid.map(row => MakeNodes(row.row_id, row.cols))
    return res
}


//* GRID_CONSTRUCTION*/
const GridConstruction = ({ grid, nodes, id }: IGridConstProps) => {
    const [GR, setGR] = useGridControl(grid)
    const [gNodes, setGNodes] = useState<INodeCols[] | []>([])
    const [frameROWS, setFrameRows] = useState<IGridRow[] | []>([])
    // const [cols, setCols] = useState(1)
    // const ROW = useFrameRow(cols)
    useEffect(() => {
        const rows = GR.map(RowLine => FRow(RowLine.cols, RowLine.row_id))
        // if (!ROW.length) return

        setFrameRows(rows)
        // setGNodes(nodes)
        console.log('GR', GR)
        console.log('rows', rows)

    }, [])

    return (
        <div className='relative'>
            <button className='absolute right-[-3em] top-1 border-2 bg-[#2165f8] p-1 mt-1 rounded-md border-[black]'
                onClick={() => setGR.rowUp()}
            >
                <IcRowUp w={6} h={6} />
            </button>


            <button className='absolute left-[-3em] top-1 border-2 bg-[#2165f8] p-1 mt-1 rounded-md border-[black]'
                onClick={() => { }}
            >
                <IcRowDown hw={6} />
            </button>




        </div>
    )
}


interface ListProps<T> extends HTMLAttributes<HTMLDivElement> {
    items: T[]
    renderNode: (item: T) => React.ReactNode

}
export type ICell = { id: string } & IGridRow
export interface ICellsList extends HTMLAttributes<HTMLDivElement> {
    cells: ICell[]
    renderNode: (item: ICell) => React.ReactNode

}

function CellList(row: ICellsList) {
    return <div
        className={['gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-2 border-[#000000] hover:bg-slate-400',
            `columns-${row.cells.length}`].join(' ')}
    >
        {row.cells.map(row.renderNode)}
    </div>
}
function NodeList<T>(row: ListProps<T>) {
    return <div
        className={['gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-2 border-[#000000] hover:bg-slate-400',
            `columns-${row.items.length}`].join(' ')}
    >
        {row.items?.map(row.renderNode)}
    </div>
}

function GFrame(grid: IGridRow[]) {
    const rowNodes = grid.map(gRow => (MakeNodes(gRow.row_id, gRow.cols)))
    return (
        <div className="relative">
            {rowNodes.map(row =>
                <NodeList
                    items={row}
                    key={Date.now()}
                    renderNode={(cnode) => <Node {...cnode} />}
                />
            )}
        </div>
    )
}
type INodeElement = { id: string, row_id: string } & HTMLAttributes<HTMLDivElement>
const Node: React.FC<INodeElement> = ({ id, row_id }): JSX.Element => {
    return (
        <div className={`flex-col h-[10em] min-w-[3em] border-8 border-double border-black bg-[#0f66ad] justify-items-start`} >

            <div>{id}</div>
            <div className='text-white'>row_id: {row_id}</div>
        </div>)
}



export default GridConstruction


/* <div key={Date.now()} className='relative'>
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
                </div> */