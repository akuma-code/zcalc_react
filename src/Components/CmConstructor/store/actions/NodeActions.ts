import { Size } from "../../../../Models/CalcModels/Size"
import { CoordsTuple, IDataBorder, IDataNode } from "../../../../Types/DataModelTypes"
import { DIRECTION, OPPOSITEenum } from "../../../../Types/Enums"
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst"
const isSameCoords = (c1: CoordsTuple, c2: typeof c1) => {
    const t1 = c1.join('')
    const t2 = c2.join('')
    return t1 === t2
}

export function updateNodeBorderCoords(node: IDataNode) {
    if (!node.size || !node.coords) {
        console.log('no size or coords', node.size, node.coords)
        return node
    }
    const { w, h } = node.size
    const [x, y, ox, oy] = node.coords
    // const [ox, oy] = [x + w, y + h]

    const bcoords = {
        left: [x, y, x, oy],
        right: [ox, y, ox, oy],
        top: [x, oy, ox, oy],
        bottom: [x, y, ox, y],
    }

    node.sideBorders?.map(sb => ({ ...sb, border: { ...sb.border, coords: bcoords[sb.side] } }))
    node.borders?.map(b => ({ ...b, coords: bcoords[b.side!] }))
    return node
}


function findConnectedNodes(impost: IDataBorder, nodes: IDataNode[]) {
    if (!impost.coords) return nodes
    const ImCoords = impost.coords
    const fnodes = nodes.filter(n => n.borders?.some(b => isSameCoords(b.coords!, ImCoords)))
    return fnodes
}

function makeDataNode(params: { size?: Size, borders?: IDataNode['borders'] }): IDataNode {

    const newDataNode: IDataNode = {
        id: _ID(),
        borders: params.borders,
        size: params.size,
    }
    updateNodeBorderCoords(newDataNode)
    return newDataNode
}

