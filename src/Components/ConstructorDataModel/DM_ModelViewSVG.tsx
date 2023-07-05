import React, { useReducer, useEffect } from 'react'
import { CoordsEnum as CE, CoordsTuple, IDataBorder, IDataModel, IDataNode, WithIdProp } from '../../Types/DataModelTypes'
import { ISideStateValues, ISides } from '../../Types/CalcModuleTypes'
import { BorderDescEnum, DIRECTION, OPPOSITEenum } from '../../Types/Enums'
import { DM_ACTION_LIST, DM_DATA, ENUM_DM_ACTIONS, InitedDataNode, dataModelReducer } from './Store/Reducers/DM_ModelReducer'
import { EDMC_ACTION, DMC_Action_SelectModel, DMC_Actions_List } from './Store/Interfaces/DM_ConstructorActions'
import { _log } from '../../hooks/useUtils'
import { NodeManager } from './Store/actions/NodeManager'
import { useDataModelContext } from '../../Context/DataModelContext'
import { setStyle } from '../CmConstructor/DataModelView'


type ViewModelSvgProps = {
    data_model: IDataModel
    onSelectModel?: () => void
}
type ResizeViewModelSvgProps = {
    baseNode: IDataNode,
    nodes: IDataNode[]
    onSelectModel?: () => void
} & WithIdProp & WithCoordsProps
type WithCoordsProps = {
    coords: CoordsTuple
    children?: React.ReactNode
}
type DataNodeSvgProps = {
    data_node: IDataNode
    isActive?: boolean
} & React.SVGProps<SVGRectElement>

type GlassSvgProps = {
    coords: CoordsTuple
    nodeClickFn: () => void,
    isActive?: boolean
} & React.SVGProps<SVGRectElement>

type BorderSvgProps = {
    border: IDataBorder


} & React.SVGProps<SVGRectElement>

function GlassSvg({ coords, nodeClickFn, isActive }: GlassSvgProps) {
    const [x, y, ox, oy] = coords
    const W = ox - x
    const H = oy - y
    const defaultStyle = 'hover:cursor-pointer'
    const outline_style = ` outline-double outline-3 outline-offset-2`
    const activeStyle = isActive ? `fill-[#53c6fc]` : `fill-grey`
    return <rect x={x} y={y} width={W} height={H}
        onClick={nodeClickFn}
        fill={isActive ? '#53c6fc' : 'grey'}
        stroke='none'
        // strokeWidth={2}
        className={setStyle(defaultStyle, activeStyle)} >

    </rect>
}



const BorderSvg = ({ border, className, fill, onClick }: BorderSvgProps) => {
    const { DMC_Data } = useDataModelContext()
    const isActive = DMC_Data.selected?.border_id === border.id
    const desc = BorderDescEnum[border.state]
    const { state } = border
    const isHL = DMC_Data.selected?.highLighted?.includes(border.id)
    const fill_style = isHL ? 'fill-green-300' : 'fill-white'
    const border_props = {
        x: border.coords![CE.X],
        y: border.coords![CE.Y],
        width: border.coords![CE.OX] - border.coords![CE.X],
        height: border.coords![CE.OY] - border.coords![CE.Y]
    }
    const style = !className ? setStyle(fill_style) : setStyle(fill_style, className)

    return <rect {...border_props} className={setStyle(fill_style)} onClick={onClick} />

}

const ModelSvg = (props: WithCoordsProps & React.SVGProps<SVGSVGElement>) => {
    const [x, y, ox, oy] = props.coords
    const ViewBox = [x, y, ox, oy].join(' ')


    const model_size_style = `max-w-[35em] max-h-[35em]`
    const style = !props.className ? model_size_style : setStyle(model_size_style, props.className)

    return (
        <svg xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox={ViewBox}
            width={`${(ox - x) / 10}em`}
            height={`${(oy - y) / 10}em`}
            transform='scale(1)'
            className={style}
            onClick={props.onClick}
            x={x}
            y={y}
        >
            {props.children}
        </svg>
    )
}


function DataNodeSvg({ data_node, isActive }: DataNodeSvgProps) {
    const initedNode = NodeManager.initNode(data_node)
    const { DMC_Action, setHL, DMC_Data, highlithedIDs } = useDataModelContext()
    const currentModel = DMC_Data.modelGroup.find(m => m.nodes.some(n => n.id === initedNode.id))
    const nodes = currentModel?.nodes.filter(n => n.id !== initedNode.id) || []
    const finded = (side: ISides, searchPoints: number[]) => nodes.map(NodeManager.initNode).reduce((res, n) => {
        const oppside = OPPOSITEenum[side]
        const [x, y, ox, oy] = searchPoints
        const [fx, fy, fox, foy] = n.mergePoints[oppside]
        if (ox === fx || x === fox) res.push(n)
        if (oy === fy || y === foy) res.push(n)
        return res
    }, [] as InitedDataNode[])
    const [x, y, ox, oy] = initedNode.coords
    const nodeClickFn = () => {
        DMC_Action({
            type: EDMC_ACTION.SELECT_NODE,
            payload: { node: initedNode, node_id: initedNode.id, variant: 'node' }
        })
        // setHL(prev => [])
    }
    const selectBorderFn = (b: IDataBorder) => {
        DMC_Action({
            type: EDMC_ACTION.SELECT_BORDER,
            payload: { border: b, border_id: b.id, variant: 'border' }
        })
        const f = finded(b.side, initedNode.mergePoints[b.side]).map(ff => ff.id)
        // console.log('f', f)
        // setHL(prev => [...prev, ...f])
    }

    const selected_border_style = isActive ? `fill-yellow-500` : `fill-white`
    return (
        <g x={x} y={y} viewBox={`0 0 ${ox} ${oy}`} className='hover:cursor-pointer'>


            <GlassSvg nodeClickFn={nodeClickFn} coords={[x, y, ox, oy]} isActive={isActive} />
            {initedNode.borders &&
                initedNode.borders.sort((a, b) => b.side.localeCompare(a.side)).map(b =>

                    <BorderSvg border={b} key={b.side} onClick={() => selectBorderFn(b)} className={selected_border_style} />
                )}

        </g>
    )
}



export const DMViewModelSVG = ({ data_model }: ViewModelSvgProps) => {
    const { id: model_id, nodes, coords, baseNode } = data_model
    const { DMC_Data, DMC_Action } = useDataModelContext()
    if (nodes.length < 1) nodes.push(baseNode!)



    const selectModelFn = () => {
        const m = DMC_Data.modelGroup.find(m => m.id === model_id)
        DMC_Action({
            type: EDMC_ACTION.SELECT_MODEL,
            payload: { id: model_id }
        })
    }


    const isActiveNode = (node_id: string) => DMC_Data.selected?.node_id === node_id
    const isActiveModel = (model_id: string) => DMC_Data.selected?.model_id === model_id
    const style_model = isActiveModel(model_id) ?
        `border-4 border-green-600` :
        `border-none`
    return (
        <ModelSvg coords={coords!} key={model_id} onClick={selectModelFn} className={style_model}>

            {
                // DM_DATA.nodes.length >= 1 &&
                nodes.map(n =>

                    <DataNodeSvg data_node={n} key={n.id} isActive={isActiveNode(n.id)} />
                )}


        </ModelSvg>


    )
}
export const DMResizeViewModelSVG = ({ id: model_id, baseNode, nodes = [], coords }: ResizeViewModelSvgProps) => {

    const { DMC_Data, DMC_Action } = useDataModelContext()
    if (nodes.length < 1) nodes.push(baseNode)



    const selectModelFn = () => {
        const m = DMC_Data.modelGroup?.find(m => m.id === model_id)
        DMC_Action({
            type: EDMC_ACTION.SELECT_MODEL,
            payload: { id: model_id, model: m }
        })
    }


    const isActiveNode = (node_id: string) => DMC_Data.selected?.node_id === node_id
    const isActiveModel = (model_id: string) => DMC_Data.selected?.model_id === model_id
    const style_model = isActiveModel(model_id) ?
        `border-4 border-green-600` :
        `border-none`
    return (
        <ModelSvg coords={coords} key={model_id} onClick={selectModelFn} className={style_model}>

            {
                // DM_DATA.nodes.length >= 1 &&
                nodes.map(n =>

                    <DataNodeSvg data_node={n} key={n.id} isActive={isActiveNode(n.id)} />
                )}


        </ModelSvg>


    )
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


