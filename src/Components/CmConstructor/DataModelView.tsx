import React, { useReducer } from 'react'
import { IDataBorder, IDataModel, IDataNode } from '../../Types/DataModelTypes'
import { ISides } from '../../Types/CalcModuleTypes'
import { dataNodeReducer } from './store/reducers/NodeReducer'
import { useUtils } from '../../hooks/useUtils'
import { BorderDescEnum } from '../../Types/Enums'
import { BorderReducer, initBorderState } from './store/reducers/BorderReducer'
import { updateBorderCoords } from './store/actions/NodeActions'



const _ID = useUtils.stringID
type DataModelViewProps = {
    data_model: IDataModel
}

export const DataModelView = ({ data_model }: DataModelViewProps) => {


    return (
        <div>
            <div className='relative p-2'>
                <NodesFcWrapper>
                    {data_model.nodes.map(n => <DataNode data_node={n} />)}
                </NodesFcWrapper>

            </div>

        </div>
    )
}
type DataNodeProps = {
    data_node: IDataNode
    className?: string
}


const DataNode = ({ data_node, className }: DataNodeProps) => {

    const [node, actions] = useReducer(dataNodeReducer, data_node, init)


    const { coords, id, sideBorders } = node
    const [x, y, ox, oy] = coords || [0, 0, 0, 0]
    const [w, h] = [ox - x, oy - y]
    const props = {
        left: ` left-[${x}em] `,
        bottom: ` bottom-[${y}em] `,
        width: `w-[${w}em] `,
        height: ` h-[${h}em] `
    }
    const style_node = Object.values(props).join(' ')
    return (
        <div className={`${style_node} absolute border-2 border-black` + className}>

            <BordersGrid sideBorders={sideBorders} >
                <ul className='text-sm'>
                    <li><b>{id}</b></li>
                    <li>x0: {x}</li>
                    <li>y0: {y}</li>
                    <li>ox: {ox}</li>
                    <li>oy: {oy}</li>

                </ul>
            </BordersGrid>


        </div>
    )
}



type NodeFcWrapperProps = {
    children?: React.ReactNode
}
const NodesFcWrapper = ({ children }: NodeFcWrapperProps) => {
    return (
        <div className='relative border-2 border-red-900 bg-slate-200 max-w-96 max-h-96 w-[30em] h-[30em]'>
            {children}
        </div>
    )
}


type BorderGridCellProps = {
    side: ISides,
    border: IDataBorder,
    className?: string
}
const BorderGridCell: React.FC<BorderGridCellProps> = ({ side, border, className }) => {


    const cell_style = {
        left: ['h-full w-5', 'flex place-items-center'].join(' '),
        right: ['h-full w-5', 'flex place-items-center'].join(' '),
        top: ['w-full h-5', "flex justify-center place-items-center"].join(' '),
        bottom: ['w-full h-5', "flex justify-center place-items-center"].join(' '),
    }

    return <div className={`bg-slate-500 text-center text-black truncate
       ${cell_style[side]}  ` + className}>
        {border.desc}
    </div>
}




type BordersGridComponentProps = {
    sideBorders: IDataNode['sideBorders']
    children?: React.ReactNode
    onClick?: (id: string) => void
}
const BordersGrid = ({ sideBorders, children }: BordersGridComponentProps) => {



    const components = sideBorders!.map(sb => ({ ...sb, element: <BorderGridCell border={sb.border} side={sb.side} /> }))
        .reduce((bdrs, current) => {
            bdrs[current.side] = current.element
            return bdrs
        }, {} as Record<ISides, React.ReactNode>)

    return (
        <div className={`bg-red-500 w-full h-full relative`}>
            <div className='grid grid-cols-[1rem_1fr_1rem] grid-rows-[1rem_1fr_1rem] w-full h-full absolute bg-red-200 justify-between place-items-center place-content-center'>
                <div className='h-full   w-full flex place-items-center'>                </div>
                {components.top}
                <div className='h-full   w-full flex place-items-center'>                </div>
                {components.left}
                <div className='border-2 border-black w-full h-full flex place-items-center justify-center z-10'>{children}</div>
                {components.right}
                <div className='h-full   w-full flex place-items-center'>                </div>
                {components.bottom}
                <div className='h-full   w-full flex place-items-center'>                </div>
            </div>
        </div>
    )
}


const initDatanode: IDataNode = {
    id: _ID(),
    sideBorders: [
        { side: 'left', border: { id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] } },
        { side: 'top', border: { id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] } },
        { side: 'right', border: { id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] } },
        { side: 'bottom', border: { id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] } },
    ],
    borders: [
        { side: 'left', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] },
        { side: 'top', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] },
        { side: 'right', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] },
        { side: 'bottom', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] },
    ],

}
function init(node: IDataNode) {
    initDatanode.size = node.size
    updateBorderCoords(initDatanode)
    return initDatanode
}