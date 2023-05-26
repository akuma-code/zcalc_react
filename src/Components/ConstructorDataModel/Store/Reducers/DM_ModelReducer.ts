import { canConsume } from "../../../../Models/CalcModels/HelperFns";
import { Size } from "../../../../Models/CalcModels/Size";
import { ISideStateValues, ISides } from "../../../../Types/CalcModuleTypes";
import { CoordsEnum, CoordsTuple, IDataBorder, IDataModel, IDataNode } from "../../../../Types/DataModelTypes";
import { BorderDescEnum, DIRECTION, OPPOSITEenum, StateConvertEnum } from "../../../../Types/Enums";
import { _log } from "../../../../hooks/useUtils";
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";

type SwapType = Record<ISideStateValues, ISideStateValues>
export type InitedDataNode = {
    mergePoints: Record<ISides, number[]>
} & Required<IDataNode>
export enum ENUM_DM_ACTIONS {
    DEVIDE_NODE = 'devide_node',
    MERGE_NODES = 'merge_nodes'
}
export type DM_ACTION_DevideNode = {
    type: ENUM_DM_ACTIONS.DEVIDE_NODE
    payload: { node_id: string, dir?: DIRECTION }
}
export type DM_ACTION_Merge_Nodes = {
    type: ENUM_DM_ACTIONS.MERGE_NODES,
    payload: { node_id: string, side: ISides }
}
export type DM_ACTION_LIST = | DM_ACTION_DevideNode | DM_ACTION_Merge_Nodes

export interface DM_DATA {
    // model: IDataModel
    nodes: IDataNode[]
    size: Size
    coords: CoordsTuple
}
export function dataModelReducer(state: DM_DATA, action: DM_ACTION_LIST) {
    switch (action.type) {
        case ENUM_DM_ACTIONS.DEVIDE_NODE: {
            const { node_id, dir = DIRECTION.HOR } = action.payload
            const node = state.nodes.find(n => n.id === node_id)
            if (!node) throw new Error("Invalid node_id");
            const [first, second] = DevideSVGNode(node, dir)
            // _log(first, second)
            const newsize = dir === DIRECTION.VERT ? { w: state.size.w * 1.5, h: state.size.h } : { w: state.size.w, h: state.size.h * 1.5 }
            const insertNodes = [...state.nodes].filter(n => n.id !== node_id)
            insertNodes.push(first, second)
            // _log(insertNodes.map(n => n.coords))
            return {
                ...state,
                nodes: insertNodes,
                size: { ...state.size, ...newsize }
            }
        }
        case ENUM_DM_ACTIONS.MERGE_NODES: {
            const { node_id, side } = action.payload
            const initedNodes = state.nodes.map(initConnectionPoints)
            const node = initedNodes.find(n => n.id === node_id)
            if (!node) throw new Error("Invalid node_id");
            const [mainAxis, offsetMax, offsetMin] = node.mergePoints[side]

            const NodesCanMerge = initedNodes.reduce((canMerge, n) => {
                const mergeSide = OPPOSITEenum[side]
                const [mergeAxis, mergeOffMax, mergeOffMin] = n.mergePoints[mergeSide]
                if (mainAxis === mergeAxis && mergeOffMax <= offsetMax && mergeOffMin >= offsetMin) canMerge.push(n)
                return canMerge
            }, [] as unknown as InitedDataNode[])
            NodesCanMerge.sort((a, b) => a.coords[CoordsEnum.X] - b.coords[CoordsEnum.X] && a.coords[CoordsEnum.Y] - b.coords[CoordsEnum.Y])
            const consumed = NodesCanMerge.reduce((res, current) => {
                if (!res) res = current
                if (CanConsume(res, current)) ConsumeNode(res, current)
                return res
            }, {} as InitedDataNode)

            const MergedNode = ConsumeNode(node, consumed)
            const insertNodes = [...state.nodes].filter(n => n.id !== node_id)
            insertNodes.push(MergedNode)
            _log(MergedNode, insertNodes)
            return {
                ...state,
                nodes: insertNodes,
                size: MergedNode.size
            }
        }
        default:
            return state
    }
}


function DevideNode(node: IDataNode, dir = DIRECTION.VERT): readonly [IDataNode, IDataNode] {
    const { size, coords, borders } = node
    if (!size || !coords || !borders) throw new Error("Cant Devide! No Size or coords");
    const [x, y, ox, oy] = coords
    const newSize = dir === DIRECTION.VERT ? new Size(size.w / 2, size.h) : new Size(size.w, size.h / 2)

    const newCoords: CoordsTuple[] = dir === DIRECTION.VERT ?
        [[x, y, x + newSize.w, oy], [x + newSize.w, y, ox, y]]
        :
        [[x, y, ox, y + newSize.h], [x, y + newSize.h, ox, oy]]

    const newBorders = dir === DIRECTION.VERT ?
        [
            borders.map(b => b.side === 'right' ? { ...b, ...changeState(b) } : b) as IDataBorder[],
            borders.map(b => b.side === 'left' ? { ...b, ...changeState(b) } : b) as IDataBorder[],
        ]
        :
        [
            borders.map(b => b.side === 'bottom' ? { ...b, state: 'imp', desc: BorderDescEnum['imp'] } : b) as IDataBorder[],
            borders.map(b => b.side === 'top' ? { ...b, state: 'imp', desc: BorderDescEnum['imp'] } : b) as IDataBorder[],
        ]

    const [first, second]: IDataNode[] = [
        { ...node, size: newSize, coords: newCoords[0], borders: newBorders[0], id: _ID() },
        { ...node, size: newSize, coords: newCoords[1], borders: newBorders[1], id: _ID() }
    ]

    return [first, second] as const
}
function DevideSVGNode(node: IDataNode, dir = DIRECTION.VERT): readonly [IDataNode, IDataNode] {
    const { size, coords, borders } = node
    if (!size || !coords || !borders) throw new Error("Cant Devide! No Size or coords");


    const [x, y, ox, oy] = coords!
    const newSize = {
        [DIRECTION.VERT]: { w: size!.w / 2, h: size.h },
        [DIRECTION.HOR]: { h: size!.h / 2, w: size.w },
    }
    const newCoords = {
        [DIRECTION.VERT]: {
            main: [x, y, x + (ox - x) / 2, oy] as CoordsTuple,
            second: [x + (ox - x) / 2, y, ox, oy] as CoordsTuple
        },
        [DIRECTION.HOR]: {
            main: [x, y, ox, y + (oy - y) / 2] as CoordsTuple,
            second: [x, y + (oy - y) / 2, ox, oy] as CoordsTuple
        },
    }
    const newBorder = {
        [DIRECTION.VERT]: {
            main: borders.map(b => b.side === 'right' ? { ...b, ...changeState(b), id: _ID() } : { ...b, id: _ID() }) as IDataBorder[],
            second: borders.map(b => b.side === 'left' ? { ...b, ...changeState(b), id: _ID() } : { ...b, id: _ID() }) as IDataBorder[],
        },
        [DIRECTION.HOR]: {
            main: borders.map(b => b.side === 'bottom' ? { ...b, ...changeState(b), id: _ID(), } : { ...b, id: _ID() }) as IDataBorder[],
            second: borders.map(b => b.side === 'top' ? { ...b, ...changeState(b), id: _ID(), } : { ...b, id: _ID() }) as IDataBorder[],
        }
    }
    const first = { ...node, size: newSize[dir], borders: newBorder[dir].main, id: _ID(), coords: newCoords[dir].main }
    const second = { ...node, size: newSize[dir], borders: newBorder[dir].second, id: _ID(), coords: newCoords[dir].second }
    return [first, second] as const

}

const initConnectionPoints = (node: IDataNode): InitedDataNode => {
    if (!node.coords) throw new Error("No Coords for connection points");

    const [x, y, ox, oy] = node.coords
    const Connections: Record<ISides, number[]> = {
        top: [y, x, ox],
        right: [ox, y, oy],
        left: [x, y, oy],
        bottom: [oy, x, ox]
    }
    return { ...node, mergePoints: Connections } as InitedDataNode
}
const initNode = (node: IDataNode): InitedDataNode => {
    if (!node.coords || !node.size) throw new Error("No Coords or Size!");

    const [x, y] = node.coords
    const [ox, oy] = [x + node.size.w, y + node.size.h]

    const Connections: Record<ISides, number[]> = {
        top: [y, x, ox],
        right: [ox, y, oy],
        left: [x, y, oy],
        bottom: [oy, x, ox]
    }
    return { ...node, mergePoints: Connections, coords: [x, y, ox, oy] } as InitedDataNode
}
const ConsumeNode = (main_node: IDataNode, consume_node: typeof main_node): InitedDataNode => {
    const [initMain, initConsume] = [main_node, consume_node].map(initConnectionPoints)
    const CC = CanConsume(initMain, initConsume)
    if (CC.status === false) {
        _log("Nodes Cannot Merge")
        return initNode(main_node)
    } else {
        const consumeBorder = initConsume.borders!.find(b => b.side === CC.side)!

        const consumeSize = ['right', 'left'].includes(CC.side) ?
            { w: initMain.size.w + initConsume.size?.w }
            :
            { h: initMain.size.h + initConsume.size?.h }
        const newNode: InitedDataNode = {
            ...initMain,
            borders: changeBorder(initMain.borders, consumeBorder),
            size: { ...initMain.size, ...consumeSize },
            id: _ID()
        }
        initNode(newNode)
        return newNode
    }


}

const CanConsume = (main_node: InitedDataNode, consume_node: typeof main_node) => {
    if (!main_node.size || !consume_node.size) throw new Error("No Size!");
    if (!main_node.borders || !consume_node.borders) throw new Error("No Borders!");
    const mainMP = main_node.mergePoints
    const consumeMP = consume_node.mergePoints
    const result = {
        status: false,
        side: "" as unknown as ISides
    }
    for (let side in mainMP) {
        const OPPOSITE = OPPOSITEenum[side as ISides]
        if (mainMP[side as ISides].join('-') === consumeMP[OPPOSITE].join('-')) {
            result.status = true
            result.side = side as ISides
        }
        return result
    }

    return result
}
const changeState = (border: IDataBorder) => {
    const swap: SwapType = {
        rama: 'imp',
        imp: 'imp',
        imp_shtulp: 'imp',
        stv_imp: 'stv_imp',
        stv_rama: 'stv_imp',
        svet: 'svet'
    }

    const newStateDesc = { state: swap[border.state], desc: BorderDescEnum[swap[border.state]] }
    // console.log('swap', border.state, "=>", swap[border.state])
    const newBorder = { ...border, ...newStateDesc }
    return newBorder
}

const changeBorder = (borders: IDataBorder[], new_border: IDataBorder) => {
    const ns = new_border.side
    return borders.map(b => b.side === ns ? { ...b, ...new_border } : b)
}