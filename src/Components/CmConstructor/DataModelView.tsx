import React, { useReducer, useEffect, HTMLAttributes, MouseEventHandler } from 'react'
import { IDataBorder, IDataModel, IDataNode } from '../../Types/DataModelTypes'
import { ISides } from '../../Types/CalcModuleTypes'
import { dataNodeReducer } from '../../_testing_scripts/DM_NodeReducer'
import { _log, useUtils } from '../../hooks/useUtils'
import { BorderDescEnum } from '../../Types/Enums'
import { BorderReducer, initBorderState } from './store/reducers/BorderReducer'
import { updateNodeBorderCoords } from './store/actions/NodeActions'
import { NodeCreator, updateBorderCoords } from "../ConstructorDataModel/Store/actions/DM_Creators"
import { useModelReducer } from '../../Store/ConstructReducer'
import { useDataModelContext } from '../../Context/DataModelContext'
import { EDMC_ACTION } from '../ConstructorDataModel/Store/Interfaces/DM_ConstructorActions'
import { useScale } from '../../hooks/useScale'
import { DM_ACTION_DevideNode, DM_DATA, ENUM_DM_ACTIONS, dataModelReducer } from '../ConstructorDataModel/Store/Reducers/DM_ModelReducer'




type DataModelViewProps = {
    data_model: IDataModel
}
export const setStyle = (...args: string[]) => [' ', ...args, ' '].join(' ')


export const DataModelView = ({ data_model }: DataModelViewProps) => {
    const { nodes, size, coords } = initModel(data_model)
    const [x, y] = coords!
    const initData: DM_DATA = {

        nodes: nodes,
        coords: coords!,
        size: size,
        model_id: data_model.id
    }

    const [DM_DATA, DM_dispatch] = useReducer(dataModelReducer, initData)

    const [width, height] = [`w-[${size.w}em]`, `h-[${size.h}em]`]
    const [left, bottom] = [`left-[${x}em]`, `bottom-[${y}em]`]
    const viewstyle = `bg-yellow-500 relative`

    const style = setStyle(width, height, left, bottom, viewstyle)

    return (

        <div className={style}>
            <NodesCanvas className='___NODES CANVAS____'>
                {
                    DM_DATA.nodes.map(n => <DataNode data_node={n} key={n.id} action={DM_dispatch} />)
                }
            </NodesCanvas>

        </div>

    )
}
type DataNodeProps = {
    data_node: IDataNode
    className?: string
    action: React.Dispatch<DM_ACTION_DevideNode>
}


const DataNode = ({ data_node, className, action }: DataNodeProps) => {


    const { size, coords, id: node_id, borders } = initNode(data_node)

    const [x = 0, y = 0, ox = size!.w, oy = size!.h] = coords!
    const [w, h] = [ox - x, oy - y]

    const [left, bottom, width, height] = [`left-[${x}em]`, `bottom-[${y}em]`, `w-[${w}em]`, `h-[${h}em]`]
    const style_node = setStyle(left, bottom, width, height, className || "")


    // const borderClickHandler = (id: string) => {
    //     const brd = borders?.find(b => b.id === id)!
    //     DMC_Action({ type: DMC_ACTION.SELECT, payload: { item: brd } })
    //     _log(`${brd.side} ${brd.desc} | ${id}, NodeID: ${node_id}`)
    // }
    const nodeClickHandler = () => {
        action({ type: ENUM_DM_ACTIONS.DEVIDE_NODE, payload: { node_id: node_id } })
        // console.log('selected Node: ', data_node)
    }
    const NodeInfo = <ul className='text-sm list-disc'>
        <li><b>{node_id}</b></li>
        <li>x: {x}</li>
        <li>y: {y}</li>
        <li>ox: {ox}</li>
        <li>oy: {oy}</li>
    </ul>
    return (
        <div className={`____DATANODE____ ${style_node}  border-2 border-black`} onClick={nodeClickHandler}>
            <BordersGrid borders={borders}  >
                {NodeInfo}
            </BordersGrid>
        </div>
    )
}



type NodesCanvasProps = {
    children?: React.ReactNode
} & HTMLAttributes<HTMLDivElement>

const NodesCanvas = ({ children, className }: NodesCanvasProps) => {
    return (
        <div className={'relative border-2 bg-slate-200 ' + className}>
            {children}
        </div>
    )
}


type BorderGridCellProps = {
    side: ISides,
    border: IDataBorder,
    className?: string
    onClickCallback?: (id: string) => void
}
const BorderGridCell: React.FC<BorderGridCellProps> = ({ side, border, className, onClickCallback }) => {


    const cell_style = {
        left: ['h-full min-w-[1em] w-full', 'flex place-items-center'].join(' '),
        right: ['h-full min-w-[1em] w-full', 'flex place-items-center'].join(' '),
        top: ['w-full h-full min-h-[1em]', "flex justify-center place-items-center"].join(' '),
        bottom: ['w-full h-full min-h-[1em]', "flex justify-center place-items-center"].join(' '),
    }
    function nodeClickFn() {
        if (onClickCallback) onClickCallback(border.id)

    }
    return <div className={
        `bg-slate-500 text-center text-black truncate hover:bg-green-300 hover:opacity-100 hover:cursor-pointer z-40
       ${cell_style[side]}  ` + className}
        onClick={nodeClickFn}
    >
        {border.desc}
    </div>
}




type BordersGridComponentProps = {
    borders: IDataNode['borders']
    children?: React.ReactNode
    onClick?: () => void
}



const BordersGrid = ({ borders, children, onClick }: BordersGridComponentProps) => {
    const { DMC_Action, DMC_Data } = useDataModelContext()

    const borderClickFn = (id: string) => {
        const brd = borders?.find(b => b.id === id)!
        // DMC_Action({ type: DMC_ACTION.SELECT, payload: { item: brd || {} } })
        _log(`selected border side: ${brd.side}, state: ${brd.desc}, coords: ${brd.coordsSVG}`)
    }


    const components = borders!.map(b => ({
        side: b.side,
        element: <BorderGridCell border={b} side={b.side} onClickCallback={borderClickFn} />
    }))
        .reduce((bdrs, current) => {
            bdrs[current.side] = current.element
            return bdrs
        }, {} as Record<ISides, React.ReactNode>)



    return (
        <div className={`bg-red-500 w-full h-full relative`}>
            <div className='grid grid-cols-[1rem_1fr_1rem] grid-rows-[1rem_1fr_1rem] w-full h-full absolute bg-red-200 justify-between place-items-center place-content-center'>
                <div className='h-full   w-full flex place-items-center' />
                {components.top}
                <div className='h-full   w-full flex place-items-center' />
                {components.left}
                <div className={`border-2 border-black w-full h-full flex place-items-center justify-center z-10 
                hover:bg-green-300 hover:opacity-75 hover:cursor-pointer 
                `} onClick={onClick}>{children}</div>
                {components.right}
                <div className='h-full   w-full flex place-items-center' />
                {components.bottom}
                <div className='h-full   w-full flex place-items-center' />
            </div>
        </div>
    )
}


function initNode(node: IDataNode) {

    const [w, h, x = 0, y = 0] = [node.size!.w, node.size!.h, node.coords![0], node.coords![1]]
    const init_node = NodeCreator('fix', w, h, x, y)
    if (!init_node.coords) _log("No coords on init", init_node)
    if (!node.borders) return init_node
    else return updateNodeBorderCoords(node)
}

function initModel(model: IDataModel): IDataModel {
    const { nodes, baseNode } = model
    if (nodes.length < 1 && baseNode) model.nodes.push(baseNode)
    model.nodes.map(updateBorderCoords)
    return model
}