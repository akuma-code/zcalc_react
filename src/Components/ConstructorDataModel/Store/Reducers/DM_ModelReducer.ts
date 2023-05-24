import { Size } from "../../../../Models/CalcModels/Size";
import { ISideStateValues } from "../../../../Types/CalcModuleTypes";
import { CoordsTuple, IDataBorder, IDataModel, IDataNode } from "../../../../Types/DataModelTypes";
import { BorderDescEnum, DIRECTION, StateConvertEnum } from "../../../../Types/Enums";
import { _log } from "../../../../hooks/useUtils";
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";


export enum ENUM_DM_ACTIONS {
    DEVIDE_NODE = 'devide_node'
}
export type DM_ACTION_DevideNode = {
    type: ENUM_DM_ACTIONS.DEVIDE_NODE
    payload: { node_id: string, dir?: DIRECTION }
}
export type DM_ACTION_LIST = | DM_ACTION_DevideNode

export interface DM_DATA {
    // model: IDataModel
    nodes: IDataNode[]
    size: Size
    coords: CoordsTuple
}
export function dataModelReducer(state: DM_DATA, action: DM_ACTION_LIST) {
    switch (action.type) {
        case ENUM_DM_ACTIONS.DEVIDE_NODE:
            const { node_id, dir = DIRECTION.HOR } = action.payload
            const node = state.nodes.find(n => n.id === node_id)
            // if (!node) return state
            const [first, second] = DevideSVGNode(node!, dir)
            const newsize = dir === DIRECTION.VERT ? { w: state.size.w * 1.5, h: state.size.h } : { w: state.size.w, h: state.size.h * 1.5 }
            const insertNodes = [...state.nodes].filter(n => n.id !== node_id)
            insertNodes.push(first, second)
            _log(insertNodes.map(n => n.coords))
            return {
                ...state,
                nodes: insertNodes,
                size: { ...newsize }
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
        [DIRECTION.VERT]: { w: size!.w / 2 },
        [DIRECTION.HOR]: { h: size!.h / 2 },
    }
    const newCoords = {
        [DIRECTION.VERT]: {
            main: [x, y, ox / 2, oy],
            second: [ox / 2, y, ox, oy]
        },
        [DIRECTION.HOR]: {
            main: [x, y, ox, oy / 2],
            second: [x, oy / 2, ox, oy]
        },
    }
    const newBorder = {
        [DIRECTION.VERT]: {
            main: borders.map(b => b.side === 'right' ? { ...b, ...changeState(b) } : b) as IDataBorder[],
            second: borders.map(b => b.side === 'left' ? { ...b, ...changeState(b) } : b) as IDataBorder[],
        },
        [DIRECTION.HOR]: {
            main: borders.map(b => b.side === 'bottom' ? { ...b, ...changeState(b) } : b) as IDataBorder[],
            second: borders.map(b => b.side === 'top' ? { ...b, ...changeState(b) } : b) as IDataBorder[],
        }
    }
    const first = { ...node, ...newSize[dir], ...newCoords[dir].main, borders: newBorder[dir].main }
    const second = { ...node, ...newSize[dir], ...newCoords[dir].second, borders: newBorder[dir].second }
    return [first, second] as const

}



type SwapType = Record<ISideStateValues, ISideStateValues>
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
    console.log('swap', border.state, "=>", swap[border.state])
    const newBorder = { ...border, ...newStateDesc }
    return newBorder
}