import React from 'react'
import { CoordsEnum as CE, CoordsTuple, IDataBorder, IDataModel, IDataNode } from '../../Types/DataModelTypes'
import { ISides } from '../../Types/CalcModuleTypes'
import { BorderDescEnum } from '../../Types/Enums'
import { dataModelReducer } from './Store/Reducers/DM_ModelReducer'


type ViewModelSvgProps = {
    data_model: IDataModel
}
type WithCoordsProps = {
    coords: CoordsTuple
    children?: React.ReactNode
}
export const DMViewModelSVG = ({ data_model }: ViewModelSvgProps) => {
    const { id, nodes, coords, baseNode } = data_model


    return (
        <ModelSvg coords={coords!} key={id}>
            {nodes.length >= 1 &&
                nodes.map(n =>
                    <DataNodeSvg data_node={n} key={n.id} />
                )}
            {baseNode && nodes.length < 1 &&
                <DataNodeSvg data_node={baseNode} key={baseNode.id} />
            }
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
}
// asd
function DataNodeSvg({ data_node }: DataNodeSvgProps) {
    const scaled = data_node.coords!.map(c => c / 10)
    const [x, y, ox, oy] = scaled

    return (
        <g x={x} y={y} viewBox={`0 0 ${ox} ${oy}`} fill='red' className='hover:stroke-[black]'>
            {data_node.borders &&
                data_node.borders.map(b =>
                    <BorderSvg border={b} key={b.side} />
                )}


        </g>
    )
}

type BorderSvgProps = {
    border: IDataBorder


}

const BorderSvg = ({ border }: BorderSvgProps) => {
    const desc = BorderDescEnum[border.state]

    const border_props = {
        x: border.coords![CE.X],
        y: border.coords![CE.Y],
        width: border.coords![CE.OX] - border.coords![CE.X],
        height: border.coords![CE.OY] - border.coords![CE.Y]
    }
    return <rect {...border_props} />

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
