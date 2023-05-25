import React, { useReducer, useEffect } from 'react'
import { CoordsEnum as CE, CoordsTuple, IDataBorder, IDataModel, IDataNode } from '../../Types/DataModelTypes'
import { ISideStateValues, ISides } from '../../Types/CalcModuleTypes'
import { BorderDescEnum, DIRECTION } from '../../Types/Enums'
import { DM_ACTION_LIST, DM_DATA, ENUM_DM_ACTIONS, dataModelReducer } from './Store/Reducers/DM_ModelReducer'
import { DMC_ACTION, DMC_Action_Select, DMC_Actions } from './Store/Interfaces/DM_ConstructorActions'
import { _log } from '../../hooks/useUtils'
import { NodeManager } from './Store/actions/NodeManager'
import { useDataModelContext } from '../../Context/DataModelContext'


type ViewModelSvgProps = {
    data_model: IDataModel
    update: (value: DMC_Actions) => void
}
type WithCoordsProps = {
    coords: CoordsTuple
    children?: React.ReactNode
}
export const DMViewModelSVG = ({ data_model }: ViewModelSvgProps) => {
    const { id, nodes, coords, baseNode } = data_model
    if (nodes.length < 1) nodes.push(baseNode!)
    const initData: DM_DATA = {
        coords: coords!,
        nodes: nodes,
        size: data_model.size

    }

    const [DM_DATA, DM_dispatch] = useReducer(dataModelReducer, initData)
    const { DMC_Data, DMC_Action } = useDataModelContext()
    const SelectFn = (payload: DMC_Action_Select['payload']) => {
        const { item } = payload
        DMC_Action({
            type: DMC_ACTION.SELECT,
            payload: { model_id: id, item }
        })
    }
    useEffect(() => {
        DMC_Action({
            type: DMC_ACTION.UPDATE,
            payload: { coords: DM_DATA.coords, nodes: DM_DATA.nodes, size: DM_DATA.size, model_id: id }
        })
        _log("updated!")

    }, [DM_DATA, id])

    const isActive = (node_id: string) => DMC_Data.selected?.node_id === node_id
    return (
        <ModelSvg coords={coords!} key={id}>

            {DM_DATA.nodes.length >= 1 &&
                DM_DATA.nodes.map(n =>
                    // nns.map(n =>
                    <DataNodeSvg data_node={n} key={n.id} actions={DM_dispatch} isActive={isActive(n.id)} onClick={SelectFn} />
                )}


        </ModelSvg>


    )
}

const ModelSvg = (props: WithCoordsProps) => {
    const [x, y, ox, oy] = props.coords
    const ViewBox = [0, 0, ox, oy].join(' ')


    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox={ViewBox}
        >
            {props.children}
        </svg>
    )
}
type DataNodeSvgProps = {
    data_node: IDataNode
    actions: React.Dispatch<DM_ACTION_LIST>
    isActive?: boolean
    onClick?: (payload: Partial<DMC_Action_Select['payload']>) => void
}
// asd
function DataNodeSvg({ data_node, actions, isActive, onClick }: DataNodeSvgProps) {
    const initedNode = new NodeManager().initNode(data_node)
    const { DMC_Action } = useDataModelContext()
    const scaled = initedNode.coords!.map(c => c / 1)
    const [x, y, ox, oy] = initedNode.coords
    const nodeClickFn = () => {
        actions({
            type: ENUM_DM_ACTIONS.DEVIDE_NODE,
            payload: { node_id: initedNode.id, dir: DIRECTION.VERT }
        })



    }
    return (
        <g x={x} y={y} viewBox={`0 0 ${ox} ${oy}`} fill={isActive ? 'red' : 'blue'} className='hover:stroke-[black]'>
            <rect x={x} y={y} fill='lime' width={ox - x} height={oy - y} onClick={nodeClickFn} className='hover:cursor-pointer' />
            {initedNode.borders &&
                initedNode.borders.sort((a, b) => b.side.localeCompare(a.side)).map(b =>
                    <BorderSvg border={b} key={b.side} className='z-40' />
                )}

        </g>
    )
}

type BorderSvgProps = {
    border: IDataBorder


} & React.SVGProps<SVGRectElement>

const BorderSvg = ({ border, className, fill }: BorderSvgProps) => {
    const desc = BorderDescEnum[border.state]
    const { state } = border
    const styleState = {
        fill: state === 'imp' ? 'yellow' : 'red'
    }
    const border_props = {
        x: border.coords![CE.X],
        y: border.coords![CE.Y],
        width: border.coords![CE.OX] - border.coords![CE.X],
        height: border.coords![CE.OY] - border.coords![CE.Y]
    }


    return <rect {...border_props} {...styleState} className={className} />

}


const getBorderProps = (coords: CoordsTuple, side: ISides, borderWidth = 10) => {
    const [x, y, ox, oy] = coords
    const BC: Record<ISides, CoordsTuple> = {
        top: [x, y, ox, y + borderWidth],
        left: [x, y, x + borderWidth, oy],
        bottom: [x, oy - borderWidth, ox, oy],
        right: [ox - borderWidth, y, ox, oy],
        // mid: [x + 10, y + 10, ox - 10, oy - 10]
    }
    const [X, Y, OX, OY] = BC[side]

    return {
        x: X,
        y: Y,
        width: OX - X,
        height: OY - Y
    }
}

