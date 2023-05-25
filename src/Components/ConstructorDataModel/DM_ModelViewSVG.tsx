import React, { useReducer, useEffect } from 'react'
import { CoordsEnum as CE, CoordsTuple, IDataBorder, IDataModel, IDataNode } from '../../Types/DataModelTypes'
import { ISideStateValues, ISides } from '../../Types/CalcModuleTypes'
import { BorderDescEnum, DIRECTION } from '../../Types/Enums'
import { DM_ACTION_LIST, DM_DATA, ENUM_DM_ACTIONS, dataModelReducer } from './Store/Reducers/DM_ModelReducer'
import { DMC_ACTION, DMC_Actions } from './Store/Interfaces/DM_ConstructorActions'
import { _log } from '../../hooks/useUtils'
import { NodeManager } from './Store/actions/NodeManager'


type ViewModelSvgProps = {
    data_model: IDataModel
    update: (value: DMC_Actions) => void
}
type WithCoordsProps = {
    coords: CoordsTuple
    children?: React.ReactNode
}
export const DMViewModelSVG = ({ data_model, update }: ViewModelSvgProps) => {
    const { id, nodes, coords, baseNode } = data_model
    if (nodes.length < 1) nodes.push(baseNode!)
    const initData: DM_DATA = {
        coords: coords!,
        nodes: nodes,
        size: data_model.size

    }

    const [DM_DATA, DM_dispatch] = useReducer(dataModelReducer, initData)


    useEffect(() => {
        update({
            type: DMC_ACTION.UPDATE,
            payload: { coords: DM_DATA.coords, nodes: DM_DATA.nodes, size: DM_DATA.size, model_id: id }
        })
        _log("updated!")

    }, [DM_DATA, id, update])


    return (
        <ModelSvg coords={coords!} key={id}>

            {DM_DATA.nodes.length >= 1 &&
                DM_DATA.nodes.map(n =>
                    // nns.map(n =>
                    <DataNodeSvg data_node={n} key={n.id} actions={DM_dispatch} />
                )}


        </ModelSvg>


    )
}

const ModelSvg = (props: WithCoordsProps) => {

    const ViewBox = props.coords.join(' ')


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
}
// asd
function DataNodeSvg({ data_node, actions }: DataNodeSvgProps) {
    const initedNode = new NodeManager().initNode(data_node)
    const scaled = initedNode.coords!.map(c => c / 1)
    const [x, y, ox, oy] = initedNode.coords
    const nodeClickFn = () => {
        actions({
            type: ENUM_DM_ACTIONS.DEVIDE_NODE,
            payload: { node_id: initedNode.id, dir: DIRECTION.VERT }
        })
        _log(initedNode.coords)
    }
    return (
        <g x={x} y={y} viewBox={`0 0 ${ox} ${oy}`} fill='red' className='hover:stroke-[black]'>
            <rect x={x} y={y} fill='lime' width={ox - x} height={oy - y} onClick={nodeClickFn} className='hover:fill-[white]' />
            {initedNode.borders &&
                initedNode.borders.map(b =>
                    <BorderSvg border={b} key={b.side} />
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

    const border_props = {
        x: border.coords![CE.X],
        y: border.coords![CE.Y],
        width: border.coords![CE.OX] - border.coords![CE.X],
        height: border.coords![CE.OY] - border.coords![CE.Y]
    }


    return <rect {...border_props} fill={fill} className={className} />

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

