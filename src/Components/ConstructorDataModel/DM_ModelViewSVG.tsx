import React, { useReducer, useEffect } from 'react'
import { CoordsEnum as CE, CoordsTuple, IDataBorder, IDataModel, IDataNode } from '../../Types/DataModelTypes'
import { ISideStateValues, ISides } from '../../Types/CalcModuleTypes'
import { BorderDescEnum, DIRECTION } from '../../Types/Enums'
import { DM_ACTION_LIST, DM_DATA, ENUM_DM_ACTIONS, dataModelReducer } from './Store/Reducers/DM_ModelReducer'
import { EDMC_ACTION, DMC_Action_SelectModel, DMC_Actions } from './Store/Interfaces/DM_ConstructorActions'
import { _log } from '../../hooks/useUtils'
import { NodeManager } from './Store/actions/NodeManager'
import { useDataModelContext } from '../../Context/DataModelContext'


type ViewModelSvgProps = {
    data_model: IDataModel
    onSelectModel?: () => void
}
type WithCoordsProps = {
    coords: CoordsTuple
    children?: React.ReactNode
}

type GlassSvgProps = {
    coords: CoordsTuple
    nodeClickFn: () => void,
    isActive?: boolean
} & React.SVGProps<SVGRectElement>
function GlassSvg({ coords, nodeClickFn, isActive }: GlassSvgProps) {
    const [x, y, ox, oy] = coords
    const W = ox - x
    const H = oy - y

    return <rect x={x} y={y} width={W} height={H}
        onClick={nodeClickFn}
        fill={isActive ? 'lime' : 'grey'}
        stroke={isActive ? 'black' : 'none'}
        strokeWidth={2}
        className='hover:cursor-pointer' />
}



export const DMViewModelSVG = ({ data_model, onSelectModel }: ViewModelSvgProps) => {
    const { id: model_id, nodes, coords, baseNode } = data_model
    const { DMC_Data, DMC_Action } = useDataModelContext()
    if (nodes.length < 1) nodes.push(baseNode!)
    const initData: DM_DATA = {
        model_id: data_model.id,
        coords: coords!,
        nodes: nodes,
        size: data_model.size

    }

    const [DM_DATA, DM_dispatch] = useReducer(dataModelReducer, initData)


    const selectModelFn = () => {
        const m = DMC_Data.modelGroup.find(m => m.id === model_id)
        DMC_Action({
            type: EDMC_ACTION.SELECT_MODEL,
            payload: { id: model_id, model: m }
        })
    }
    useEffect(() => {

        DMC_Action({
            type: EDMC_ACTION.UPDATE,
            payload: { coords: DM_DATA.coords, nodes: DM_DATA.nodes, size: DM_DATA.size, model_id }
        })
        _log("updated!")

    }, [DMC_Action, DM_DATA, model_id])

    const isActive = (node_id: string) => DMC_Data.selected?.node_id === node_id
    return (
        <ModelSvg coords={coords!} key={model_id} onClick={selectModelFn}>

            {DM_DATA.nodes.length >= 1 &&
                DM_DATA.nodes.map(n =>

                    <DataNodeSvg data_node={n} key={n.id} actions={DM_dispatch} isActive={isActive(n.id)} onClick={selectModelFn} />
                )}


        </ModelSvg>


    )
}

const ModelSvg = (props: WithCoordsProps & React.SVGProps<SVGSVGElement>) => {
    const [x, y, ox, oy] = props.coords
    const ViewBox = [0, 0, ox, oy].join(' ')


    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox={ViewBox}
            width={`${(ox - x) / 10}em`}
            height={`${(oy - y) / 10}em`}
            transform='scale(1)'
            className='max-w-[35em] max-h-[35em]'
            onClick={props.onClick}
        >
            {props.children}
        </svg>
    )
}
type DataNodeSvgProps = {
    data_node: IDataNode
    actions: React.Dispatch<DM_ACTION_LIST>
    isActive?: boolean
} & React.SVGProps<SVGRectElement>
// asd
function DataNodeSvg({ data_node, isActive }: DataNodeSvgProps) {
    const initedNode = new NodeManager().initNode(data_node)
    const { DMC_Action, DMC_Data } = useDataModelContext()
    const [x, y, ox, oy] = initedNode.coords
    const nodeClickFn = () => {
        DMC_Action({
            type: EDMC_ACTION.SELECT_NODE,
            payload: { node: initedNode, node_id: initedNode.id, variant: 'node' }
        })

        // isActive && actions({
        //     type: ENUM_DM_ACTIONS.DEVIDE_NODE,
        //     payload: { node_id: initedNode.id, dir: DIRECTION.VERT }
        // })
    }
    const selectFn = (b: IDataBorder) => {
        DMC_Action({
            type: EDMC_ACTION.SELECT_BORDER,
            payload: { border: b, border_id: b.id, variant: 'border' }
        })
    }
    return (
        <g x={x} y={y} viewBox={`0 0 ${ox} ${oy}`} className='hover:stroke-[black]'>

            <GlassSvg nodeClickFn={nodeClickFn} coords={[x, y, ox, oy]} isActive={isActive} />

            {initedNode.borders &&
                initedNode.borders.sort((a, b) => b.side.localeCompare(a.side)).map(b =>
                    <BorderSvg border={b} key={b.side} className='z-40' onClick={() => selectFn(b)} />
                )}
            <rect fill='none' stroke={isActive ? 'grey' : 'none'} strokeWidth={10} width={ox - x} height={oy - y} />
        </g>
    )
}

type BorderSvgProps = {
    border: IDataBorder


} & React.SVGProps<SVGRectElement>

const BorderSvg = ({ border, className, fill, onClick }: BorderSvgProps) => {
    const { DMC_Data } = useDataModelContext()
    const isActive = DMC_Data.selected?.border_id === border.id
    const desc = BorderDescEnum[border.state]
    const { state } = border
    const styleState = {
        fill: isActive ? 'yellow' : 'red',
        // stroke: isActive ? 'black' : 'none'
    }
    const border_props = {
        x: border.coords![CE.X],
        y: border.coords![CE.Y],
        width: border.coords![CE.OX] - border.coords![CE.X],
        height: border.coords![CE.OY] - border.coords![CE.Y]
    }


    return <rect {...border_props} {...styleState} className={className} onClick={onClick} />

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
