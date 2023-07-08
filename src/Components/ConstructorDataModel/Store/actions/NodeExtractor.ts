import { _mapID, _stringify, _uniueArray } from "../../../../CommonFns/HelpersFn";
import { mockNode_1, mockNode_2, mockNode_3, mockNode_4, mockNodesHor, mockNodes_1_4, nnn1, nnn2 } from "../../../../Frames/mocknodes";
import { Size } from "../../../../Models/CalcModels/Size";
import { ISideStateValues, ISides, WithId } from "../../../../Types/CalcModuleTypes";
import { CoordsEnum, CoordsTuple, IDataBorder, IDataNode } from "../../../../Types/DataModelTypes";
import dto_Convert, { DTO_BorderSide } from "../../../../Types/DataTransferObjectTypes";
import { Merge_State_Change, OPPOSITEenum, SIDE_NEXT, SIDE_PREV } from "../../../../Types/Enums";
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
        }, {} as MinMaxCoords)
        // console.log('MinMaxCoords', MinMaxCoords)
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
        // console.log('minMaxBorders: ', result)
        return result


    }


}

export class ActiveNodesManager {
    //! ***************************  ActiveNodesManager
    activeNodes: InitedDataNode[] | []
    activeIdList!: string[]
    constructor(
        public initNodes: InitedDataNode[]
    ) {
        this.initNodes = initNodes
        this.activeNodes = []
    }

    getActiveNodes(impost_id: string) {
        const isImpostOwner = (node: InitedDataNode) => _mapID(node.borders).includes(impost_id)
        const impostOwner = [...this.initNodes].find(isImpostOwner)
        // _log("owner: ", impostOwner)
        this.activeNodes = impostOwner ? [...this.activeNodes, impostOwner] : this.activeNodes
        this.activeNodes = _uniueArray(this.activeNodes)
        this.activeIdList = _mapID(this.activeNodes)
        _log("Active Nodes ID: ", this.activeIdList)
        return this.activeNodes
    }

    filterActiveRestNodes(node_ids_pool: string[]) {
        const active = [...this.initNodes].filter(n => node_ids_pool.includes(n.id))
        const active_ids_pool = _mapID(active)
        const rest = [...this.initNodes].filter(n => !active_ids_pool.includes(n.id))
        const rest_ids_pool = _mapID(rest)
        this.activeNodes = _uniueArray(active)
        return { active, rest }
    }

    borderInfo(border_id: string, node: InitedDataNode) {
        if (!_mapID(node.borders).includes(border_id)) { _log("node not include border"); return null }
        const info = node.borders.reduce((data, border) => {
            data = border.id === border_id ? {
                id: border_id,
                side: border.side,
                axisCoords: _sideCoords(node.coords)[border.side]
            } : data
            return data
        }, {} as ImpostDataInfo)


        return info
    }

}

export class ActiveNodesStaticFns {
    //! ***************************  Static Methods
    static concat(n1: InitedDataNode, n2: InitedDataNode) {
        return ConcatNodes(n1, n2, false)
    }

    static chainConcat(...nodesGroup: InitedDataNode[]) {
        const [main, ...rest] = nodesGroup.sort(compareNodesByCoords)
        // _log("main id: ", main.id, "\n rest ids: ", _mapID(rest))
        return ChainConcatNodes(main, ...rest)
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
        // checkBeforeConcat(summary, node)
        const cc = ConcatNodes(summary, node,)
        summary = cc
        return summary
    }, {} as InitedDataNode)
    console.log('concat result', { ...reduced })
    return reduced
}

//! Concat Nodes
export function ConcatNodes(node1: InitedDataNode, node2: typeof node1, logged = false): InitedDataNode {
    let { first, second } = GetFirstSecond(node1, node2, logged);
    const { borders: b1, coords: [x1, y1, ox1, oy1] } = first;
    const { borders: b2, coords: [x2, y2, ox2, oy2] } = second;

    const axis: PAxisType = {};
    if (y1 === y2 && oy1 === oy2) {
        axis.coord = 'ox'
        // _log("axis: ", axis)
    }
    if (x1 === x2 && ox1 === ox2) {
        axis.coord = 'oy'
        // _log("axis: ", axis)
    }

    const align = coordsAlign(first.coords, second.coords)
    // _log('ConcatAlign: ', align)
    // if (x1 !== x2 && y1 !== y2) _log("axis error", axis)
    if (align === 'none') {
        _log("Canct Concat, align error!");
        return first
    }
    const firstBorders = align === 'ver' ? getRestBorders(b1, 'right') : getRestBorders(b1, 'bottom')
    const secondBorder = align === 'ver' ? getBorder(b2, 'right') : getBorder(b2, 'bottom')
    // _log(...firstBorders.map(b => ({ side: b.side, state: b.desc })))
    const new_coords = Object.values(MMC([first, second])) as unknown as CoordsTuple
    const [X, Y, OX, OY] = new_coords

    const new_size = new Size(OX - X, OY - Y)

    const isnb = (firstBorders.length > 0 && !!secondBorder)
    const new_borders = isnb ? [...firstBorders, secondBorder] : first.borders


    const result = INIT({
        ...first,
        borders: new_borders,
        size: new_size,
        coords: new_coords
    })

    // logged && console.log('concated nodes: ', result)
    return result


}

type CoordsMapReducer = {
    start: [number, number] | [],
    end: [number, number] | [],
    hasError?: boolean
}
function checkBeforeConcat(...nodes: InitedDataNode[]) {
    const CoordsMap: CoordsTuple[] = nodes.map(n => n.coords)
    const sorted = CoordsMap.sort((a, b) => {
        const align = coordsAlign(a, b)
        const [x1, y1] = a
        const [x2, y2] = b
        // if (align === 'none') return 0
        // if (align === 'hor') return x1 - x2
        if (align === 'ver') return y1 - y2
        return x1 - x2
    })

    return sorted
}

type AlignType = 'hor' | 'ver' | 'none'
//* находит ось, вдоль которой лежат ноды
const coordsAlign = (c1: CoordsTuple, c2: CoordsTuple) => {
    const [x1, y1, ox1, oy1] = c1
    const [x2, y2, ox2, oy2] = c2

    const dir: { align: AlignType } = { align: 'none' }
    if (y1 === y2 || oy1 === oy2) dir.align = 'hor'
    if (x1 === x2 || ox1 === ox2) dir.align = 'ver'
    return dir.align
}

function GetFirstSecond(node1: InitedDataNode, node2: typeof node1, logging = false) {

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
    // _log(`cant sort, no axis!
    // c1: ${c1.join(" ")},
    // c2: ${c2.join(" ")}`)
    return x1 - x2
}

export function _sideCoords(node_coords: CoordsTuple) {
    const [x, y, ox, oy] = node_coords
    const sidePoints: Record<ISides, CoordsTuple> = {
        top: [x, y, ox, y],
        right: [ox, y, ox, oy],
        bottom: [x, oy, ox, oy],
        left: [x, y, x, oy],
    }
    return sidePoints
}

const [n1, n2, n3,] = mockNodesHor
const [nn1, nn2, nn3, nn4, nn5] = mockNodes_1_4 as unknown as InitedDataNode[]
// const new_n = ChainConcatNodes(...[

//     nn2,
//     nn3,
//     nn4,
//     nn5,
// ])

// ActiveNodesStaticFns.chainConcat(
//     nn1,
//     nn4,
//     nn3,
//     nn2,
//     nn1,
// )
type ImpostDataInfo = {
    id: string,
    node_id?: string
    side?: ISides
    axisCoords?: CoordsTuple
}
export function getImpostData(impost_id: string, node: InitedDataNode) {
    const hasImpostId = (node: InitedDataNode) => node.borders.map(b => b.id).includes(impost_id)
    let info: ImpostDataInfo = {
        id: impost_id
    }
    // if (hasImpostId(node)) {
    const border = node.borders.find(b => b.id === impost_id)!

    const axis = _sideCoords(node.coords)[border.side]
    info = {
        ...info,
        node_id: node.id,
        side: border.side,
        axisCoords: axis
    }
    return info
    // } 


}

export function filterActivated(id_pool: string[], all_nodes: InitedDataNode[]) {
    const activatedNodes = id_pool.reduce((activeGroup: InitedDataNode[], impost_id) => {
        const hasImpostId = (node: InitedDataNode) => node.borders.map(b => b.id).includes(impost_id)
        const NODE = all_nodes.find(n => hasImpostId(n))
        if (NODE) activeGroup = [...activeGroup, NODE]
        return activeGroup
    }, [])

    return activatedNodes
}

export const borderInfo = (border_id: string, node: InitedDataNode) => {
    if (!_mapID(node.borders).includes(border_id)) { _log("border not found") }
    const info = node.borders.reduce((data, border) => {
        data = border.id === border_id ? {
            id: border_id,
            side: border.side,
            axisCoords: _sideCoords(node.coords)[border.side]
        } : data
        return data
    }, {} as ImpostDataInfo)
    return info
}


class ConcatError extends Error {
    errorObjects: any
    constructor(msg: string, ...objs: any) {
        super()
        this.name = "Concat Error"
        this.message = msg
        this.errorObjects = objs
        _log(this.errorObjects)
    }
}
type IAxisSides = {
    connect: ISides
    opposite: ISides
    prevSide: ISides
    nextSide: ISides
}
type IAxisInfo = {
    axisCoords?: CoordsTuple,
    n1_sideConnects?: ISides
    n2_sideConnects?: ISides
}
function getConnects(axisSide: ISides) {
    const AxisSides: IAxisSides = {
        connect: axisSide,
        opposite: OPPOSITEenum[axisSide],
        nextSide: SIDE_NEXT[axisSide],
        prevSide: SIDE_PREV[axisSide]
    }
    return AxisSides
}
function getAxisSide(c1: CoordsTuple, c2: CoordsTuple) {
    const [x1, y1, ox1, oy1] = c1
    const [x2, y2, ox2, oy2] = c2
    const axisInfo: IAxisInfo = {}
    let c1Side: ISides, c2Side: ISides

    if (y1 === y2 || oy1 === oy2) {
        c1Side = 'right'
        c2Side = 'left'
        axisInfo.n1_sideConnects = c1Side
        axisInfo.n2_sideConnects = c2Side
        if (ox1 === x2) axisInfo.axisCoords = [ox1, y1, ox1, oy1] as unknown as CoordsTuple
        if (ox2 === x1) axisInfo.axisCoords = [x1, y1, x1, oy1] as unknown as CoordsTuple

    }

    if (x1 === x2 || ox1 === ox2) {
        c1Side = 'bottom'
        c2Side = 'top'
        axisInfo.n1_sideConnects = c1Side
        axisInfo.n2_sideConnects = c2Side
        if (oy1 === y2) axisInfo.axisCoords = [x1, oy1, ox1, oy1] as unknown as CoordsTuple
        if (oy2 === y1) axisInfo.axisCoords = [x1, y1, ox1, y1] as unknown as CoordsTuple

    }
    if (!axisInfo.axisCoords) { _log("Coords Error", "\nc1: ", c1, "\nc2: ", c2); return }

    return axisInfo
}

function findMinMaxBorders(n1: InitedDataNode, n2: InitedDataNode) {
    // const { minX, minY, maxOX, maxOY } = MMC([n1, n2])
    const { first, second } = GetFirstSecond(n1, n2)
    const dto1 = dto_Convert.node_dto(first)
    const dto2 = dto_Convert.node_dto(second)
    const ltb = dto1.borders.reduce((lr, b) => {
        if (b.side === 'left' || b.side === 'top') lr.push(b)
        return lr
    }, [] as DTO_BorderSide[])
    const brb = dto2.borders.reduce((rb, b) => {
        if (b.side === 'bottom' || b.side === 'right') rb.push(b)
        return rb
    }, [] as DTO_BorderSide[])
    const summary = [...ltb, ...brb].map(dto_Convert.dto_border)
    return summary

}


function JoinSideState(state1: ISideStateValues, state2: ISideStateValues) {
    let resultState
    if (state1 === state2) { return resultState = state1 }
    if (state1 === 'rama') {
        if (state2 === 'stv_rama') { return resultState = 'rama' }
        if (state2 === 'stv_imp') { return resultState = 'rama' }
        if (state2 === 'imp_shtulp') { return resultState = 'rama' }
    }
    if (state2 === 'rama') {
        if (state1 === 'stv_rama') { return resultState = 'rama' }
        if (state1 === 'stv_imp') { return resultState = 'rama' }
        if (state1 === 'imp_shtulp') { return resultState = 'rama' }
    }


    if (state1 === 'imp') {
        if (state2 === 'stv_imp') { return resultState = 'imp' }
        if (state2 === 'imp_shtulp') { return resultState = 'imp' }
    }
    if (state2 === 'imp') {
        if (state1 === 'stv_imp') { return resultState = 'imp' }
        if (state1 === 'imp_shtulp') { return resultState = 'imp' }
    }


    if (state1 === 'stv_imp') {
        if (state2 === 'imp') { return resultState = 'imp' }
        if (state2 === 'imp_shtulp') { return resultState = 'imp' }
    }
    if (state2 === 'stv_imp') {
        if (state1 === 'imp') { return resultState = 'imp' }
        if (state1 === 'imp_shtulp') { return resultState = 'stv_imp' }
    }
    if (state1 === 'imp_shtulp') {
        if (state2 === 'imp') { return resultState = 'imp' }
        if (state2 === 'stv_rama') { return resultState = 'stv_rama' }
    }
    if (state2 === 'imp_shtulp') {
        if (state1 === 'imp') { return resultState = 'imp' }
        if (state1 === 'stv_rama') {
            resultState = 'stv_rama'
            return resultState
        }
    }




    _log("connection states error, cant join!\n State 1: ", state1, "\n State 2: ", state2)
    throw new Error("Join states error")
}


// function JoinNodes<T extends IDataNode>(n1: T, n2: T) {
//     const [dto_n1, dto_n2] = [n1, n2].map(dto_Convert.node_dto)
//     const stateMap = (bsides: DTO_BorderSide[]) => bsides.map(bs => ({ side: bs.side, state: bs.state }))
//     const [stm1, stm2] = [dto_n1.borders, dto_n2.borders].map(stateMap)
//     _log(stm1.map(s => ({ side: s.side, new_state: Merge_State_Change[s.state], old_state: s.state })))
//     _log(stm2.map(s => ({ side: s.side, new_state: Merge_State_Change[s.state], old_state: s.state })))
//     const [c1, c2] = [dto_n1.coords, dto_n2.coords]

//     const axis = getAxisSide(c1, c2)
//     console.log('axis', axis)
//     const cs1 = getConnects(axis.n1_sideConnects!)
//     const cs2 = getConnects(axis.n2_sideConnects!)
//     const sidestate1 = dto_n1.borders.find(b => b.side === cs1.nextSide)?.state!
//     const sidestate2 = dto_n1.borders.find(b => b.side === cs2.prevSide)?.state!
//     // _log(JoinSideState(sidestate1, sidestate2))
// }

// JoinNodes(nn2, nn3)
const sortByStartPos = (c1: CoordsTuple, c2: CoordsTuple) => {
    const [x1, y1] = c1
    const [x2, y2] = c2
    if (y1 === y2) return x1 - x2
    if (x1 === x2) return y1 - y2
    else return (y1 - y2) * (x1 - x2)
}
const sortByStartPos1 = (c1: CoordsTuple, c2: CoordsTuple) => {
    const [x1, y1] = c1
    const [x2, y2] = c2

    return 0
}
export function MergeNodes<T extends Required<IDataNode>>(...nodes: T[]) {
    const [first, second] = nodes.sort((a, b) => sortByStartPos(a.coords, b.coords)).map(INIT)
    let axis;
    axis = getAxisSide(first.coords, second.coords)
    try {

    } catch (error: any) {
        throw new Error("msg")

    }
    const changedStatesObj = (borders: IDataBorder[]) => borders.reduce((states, b) => {
        states = { ...states, [b.side]: Merge_State_Change[b.state] }
        return states
    }, {} as Record<ISides, ISideStateValues>)
    // const delBorder = <T extends { side: ISides }>(side: ISides, borders: T[]) => borders.filter(b => b.side !== side);
    // first.borders = delBorder(axis.n1_sideConnects!, first.borders!)
    // second.borders = delBorder(axis.n2_sideConnects!, second.borders!)

    let new_side_states = {} as Record<ISides, ISideStateValues>

    const cso1 = changedStatesObj(first.borders!)
    const cso2 = changedStatesObj(second.borders!)
    if (!axis) {
        _log("axis not found, nodes cant merge!")
        return
    }
    if (axis.n1_sideConnects === 'bottom') {
        new_side_states = { ...cso1, bottom: cso2['bottom'] }
    } else {
        new_side_states = { ...cso1, right: cso2['right'] }
    }
    const new_coords = Object.values(MMC([first, second])) as unknown as CoordsTuple
    const [X, Y, OX, OY] = new_coords

    const new_size = new Size(OX - X, OY - Y)
    const result: InitedDataNode = {
        ...first,
        coords: new_coords,
        size: new_size,
        borders: first.borders.map(b => ({ ...b, state: new_side_states[b.side] }))
    }
    console.log('result', result)
    return result
}

MergeNodes(nnn1, nnn2)
