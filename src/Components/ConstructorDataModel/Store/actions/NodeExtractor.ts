import { _uniueArray } from "../../../../CommonFns/HelpersFn";
import { mockNodesHor } from "../../../../Frames/mocknodes";
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



export function ConcatNodes(node1: InitedDataNode, node2: typeof node1, logged = false): InitedDataNode {
    let { first, second } = SortByCoords(node1, node2, logged);
    const { borders: b1 } = first;
    const { borders: b2 } = second;
    logged && _log("first: ", first);
    logged && _log("second: ", second)
    // const startBorders = axis.ox ? getRestBorders(b1, 'right') : getRestBorders(b1, 'bottom')
    // const restBorder = axis.ox ? getBorder(b2, 'right') : getBorder(b2, 'bottom')
    const SS = (borders: IDataBorder[]) => borders.map(b => ({ side: b.side, state: b.state }))
    _log(SS(first.borders))
    _log(SS(second.borders))
    const new_coords = Object.values(MMC([first, second])) as unknown as CoordsTuple
    const [X, Y, OX, OY] = new_coords
    // logged && console.log('new_coords', new_coords)

    const new_size = new Size(OX - X, OY - Y)
    // logged && console.log('new_size', new_size)

    // const new_borders = [...startBorders, restBorder]
    // logged && console.log('new_borders', new_borders)

    const result = INIT({
        ...first,
        // borders: new_borders,
        size: new_size,
        coords: new_coords
    })

    // logged && console.log('concated nodes: ', result)
    return result


}
function SortByCoords(node1: InitedDataNode, node2: typeof node1, logging = false) {
    let first = {} as InitedDataNode
    let second = {} as InitedDataNode;
    const { coords: c1 } = node1;
    const { coords: c2 } = node2;
    const [x1, y1, ox1, oy1] = c1;
    const [x2, y2, ox2, oy2] = c2;
    const mmc = MMC([node1, node2]);

    if (mmc.minX === x1 && mmc.minY === y1) { [first, second] = [node1, node2]; }
    if (mmc.minX === x2 && mmc.minY === y2) { [first, second] = [node2, node1]; }

    // const [fOx, fOy] = [first.coords[2], first.coords[3]]
    // const [sX, sY] = [second.coords[0], second.coords[1]]
    // let axis: { ox?: number, oy?: number } = {}
    // if (fOx === sX) {
    //     axis.ox = fOx
    //     // _log("Axis - ox1")
    // }
    // if (fOy === sY) {
    //     axis.oy = fOy
    //     // _log("Axis - oy1")
    // }

    const result = { first, second };
    logging && _log("SortedByCoords: ", result)
    return result
}


export function ChainConcatNodes(...nodes: InitedDataNode[]) {

    const reduced = nodes.reduce((summary, node) => {
        if (!summary.id) {
            summary = node
            return summary
        }
        return ConcatNodes(summary, node, false)
    }, {} as InitedDataNode)
    console.log('reduced', reduced)
    return reduced
}

const getBorder = (borders: IDataBorder[], selected_side: ISides) => borders.find(b => b.side === selected_side)!
const getRestBorders = (borders: IDataBorder[], except_side: ISides) => borders.filter(b => b.side !== except_side)!
const INIT = NodeManager.initNode

ChainConcatNodes(...mockNodesHor)