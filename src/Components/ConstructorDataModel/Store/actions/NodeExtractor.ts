import { _mapID, _uniueArray } from "../../../../CommonFns/HelpersFn";
import { mockNode_1, mockNode_2, mockNode_3, mockNode_4, mockNodesHor } from "../../../../Frames/mocknodes";
import { Size } from "../../../../Models/CalcModels/Size";
import { ISides } from "../../../../Types/CalcModuleTypes";
import { CoordsTuple, IDataBorder, IDataNode } from "../../../../Types/DataModelTypes";
import { _log } from "../../../../hooks/useUtils";
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";
import { InitedDataNode } from "../Reducers/DM_ModelReducer";
import { NodeManager } from "./NodeManager";
export type MinMaxCoords = {
    minX: number,
    minY: number,
    maxOX: number,
    maxOY: number
}


type CoordPropName = 'ox' | 'oy'
type AxisType = { coord: CoordPropName }
type PAxisType = Partial<AxisType>



export class NodesGroupController {
    nodes: InitedDataNode[]
    selectedNodes: InitedDataNode[]
    constructor(initNodes: IDataNode[]) {
        this.nodes = initNodes.map(NodeManager.initNode)
        this.selectedNodes = []
        // _log("nodes:", this.nodes)
    }

    get mapId() {
        return [...this.nodes].map(n => n.id)
    }


    getImpostOwner(impost_id: string) {
        const isImpostOwner = (node: InitedDataNode) => node.borders.map(b => b.id).includes(impost_id)
        const impostOwner = [...this.nodes].find(isImpostOwner)
        // _log("owner: ", impostOwner)
        return impostOwner
    }
    filterSelectedNodes(impost_id_pool: string[]) {
        const selected = impost_id_pool.map(id => this.getImpostOwner(id)!)
        this.selectedNodes = _uniueArray(selected)
        this.selectedNodes.forEach(n => this.removeNode(n.id))
        console.log('controller nodes', this.getMinMaxBorders(this.selectedNodes), this.nodes)
        return this
    }
    // insertNodes(...args: InitedDataNode[]) {
    //     this.nodes.push(...args)
    //     return this.nodes
    // }

    ejectNodes(...args: InitedDataNode['id'][]) {
        this.nodes.filter(n => !args.includes(n.id))
        return this
    }
    removeNode(id: string) {
        this.nodes = this.nodes.filter(n => n.id !== id)
        return this
    }

    spliceNodes(removeIdList: string | string[], ...new_nodes: InitedDataNode[]) {
        const id_pool = (Array.isArray(removeIdList)) ? removeIdList : [removeIdList]



        return this
    }

    findMinMaxCoords(nodes = this.selectedNodes) {
        // const selected = this.selectedNodes
        // if (selected.length === 0) return { minX: 0, minY: 0, maxOX: 0, maxOY: 0 }

        const MinMaxCoords = nodes.reduce((minmax, node) => {
            const [x, y, ox, oy] = node.coords
            const minX = minmax.minX <= x ? minmax.minX : x
            const minY = minmax.minY <= y ? minmax.minY : y
            const maxOX = minmax.maxOX >= ox ? minmax.maxOX : ox
            const maxOY = minmax.maxOY >= oy ? minmax.maxOY : oy
            return { ...minmax, minX, minY, maxOX, maxOY }
        }, { minX: 0, minY: 0, maxOX: 0, maxOY: 0 } as MinMaxCoords)
        console.log('MinMaxCoords', MinMaxCoords)
        return MinMaxCoords
    }

    getMinMaxBorders(selected_nodes = this.selectedNodes) {

        const mm = this.findMinMaxCoords()
        const first = selected_nodes.find(n => (n.coords[0] === mm.minX && n.coords[1] === mm.minY))
        const last = selected_nodes.find(n => (n.coords[2] === mm.maxOX && n.coords[3] === mm.maxOY))
        if (!first || !last) return { first, last }

        const get_border = (side: ISides, node: InitedDataNode) => node.borders.find(b => b.side === side)!
        const new_borders: Record<ISides, IDataBorder> = {
            top: get_border('top', first),
            left: get_border('left', first),
            bottom: get_border('bottom', last),
            right: get_border('right', last),
        }
        const result = Object.values(new_borders)
        console.log('result', result)
        return result


    }


}
const getBorder = (borders: IDataBorder[], selected_side: ISides) => borders.find(b => b.side === selected_side)!
const getRestBorders = (borders: IDataBorder[], except_side: ISides) => borders.filter(b => b.side !== except_side)!
const INIT = NodeManager.initNode
const compareNodesByCoords = (n1: InitedDataNode, n2: InitedDataNode): number => sortCoordsLine(n1.coords, n2.coords);

//! MinMaxCoords
function MMC(nodes: InitedDataNode[]) {
    return nodes.reduce((minmax, node) => {
        const [x, y, ox, oy] = node.coords;
        const minX = minmax.minX <= x ? minmax.minX : x;
        const minY = minmax.minY <= y ? minmax.minY : y;
        const maxOX = minmax.maxOX >= ox ? minmax.maxOX : ox;
        const maxOY = minmax.maxOY >= oy ? minmax.maxOY : oy;
        return { ...minmax, minX, minY, maxOX, maxOY };
    }, { minX: 0, minY: 0, maxOX: 0, maxOY: 0 } as MinMaxCoords);
}

//!Chain Concat
export function ChainConcatNodes(...nodes: InitedDataNode[]) {

    const sorted = [...nodes].sort(compareNodesByCoords)

    const reduced = sorted.reduce((summary, node) => {
        if (!summary.id) {
            summary = node
            return summary
        }
        const cc = ConcatNodes(summary, node,)
        summary = cc
        return summary
    }, {} as InitedDataNode)
    console.log('concat result', { ...reduced })
    return reduced
}

//! Concat Nodes
export function ConcatNodes(node1: InitedDataNode, node2: typeof node1, logged = false): InitedDataNode {
    let { first, second } = ConvertToFirstSecond(node1, node2, logged);
    const { borders: b1, coords: [x1, y1, ox1, oy1] } = first;
    const { borders: b2, coords: [x2, y2, ox2, oy2] } = second;

    const axis: PAxisType = {};
    if (y1 === y2 && oy1 === oy2) {

        axis.coord = 'ox'
        _log("axis: ", axis)
    }
    if (x1 === x2 && ox1 === ox2) {

        axis.coord = 'oy'
        _log("axis: ", axis)
    }
    if (x1 !== x2 && y1 !== y2) _log("axis error", axis)

    const firstBorders = axis.coord === 'ox' ? getRestBorders(b1, 'right') : getRestBorders(b1, 'bottom')
    const secondBorder = axis.coord === 'ox' ? getBorder(b2, 'right') : getBorder(b2, 'bottom')
    // _log(...firstBorders.map(b => ({ side: b.side, state: b.desc })))
    const new_coords = Object.values(MMC([first, second])) as unknown as CoordsTuple
    const [X, Y, OX, OY] = new_coords

    const new_size = new Size(OX - X, OY - Y)

    const isnb = (firstBorders.length > 0 && !!secondBorder)
    const new_borders = [...firstBorders, secondBorder,]
    const result = INIT({
        ...first,
        borders: isnb ? new_borders : first.borders,
        size: new_size,
        coords: new_coords
    })

    // logged && console.log('concated nodes: ', result)
    return result


}
function ConvertToFirstSecond(node1: InitedDataNode, node2: typeof node1, logging = false) {

    const [first, second] = [node1, node2].sort(compareNodesByCoords)

    const result = { first, second };
    // logging && _log("SortedByCoords: ", result.first.id, result.second.id)
    return result
}


function sortCoordsLine(c1: CoordsTuple, c2: CoordsTuple) {
    const [x1, y1] = c1
    const [x2, y2] = c2

    if (x1 === x2) return y1 - y2
    if (y1 === y2) return x1 - x2
    _log(`cant sort, nodes arent neiborhoods
    c1:${c1},
    c2:${c2}`)
    return 0
}


// const [n1, n2, n3,] = mockNodesHor
// ChainConcatNodes(...[
//     n3,
//     n1,
//     n2,
// ])