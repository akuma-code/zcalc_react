import { _stringify, addPropFn } from "../../../../CommonFns/HelpersFn";
import { mockNode_1, mockNode_2, mockNode_3, mockNode_3_1, mockNode_3_2, mockNode_4 } from "../../../../Frames/mocknodes";
import { Size } from "../../../../Models/CalcModels/Size";
import { ISides, WithId } from "../../../../Types/CalcModuleTypes";
import { CoordsTuple, IDataBorder, IDataModel, IDataNode } from "../../../../Types/DataModelTypes";
import { BorderDescEnum, DIRECTION } from "../../../../Types/Enums";
import { _log } from "../../../../hooks/useUtils";
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";
import { InitedDataNode, SwapType } from "../Reducers/DM_ModelReducer";
import { MinMaxCoords } from "./NodeExtractor";
import { NodeManager } from "./NodeManager";

type IDirection = DIRECTION.VERT | DIRECTION.HOR

export function DevideSVGNode(node: IDataNode, dir: IDirection): readonly [IDataNode, IDataNode] {
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




export function findEqualNumbersIdx<T extends number>(arr: T[], ...args: T[][]) {

    const target = _stringify(...arr)
    const compareStrings = args.map(a => _stringify(...a))
    if (!compareStrings.some(str => str === target)) return -1
    else return compareStrings.findIndex(str => str === target)
}


export function _compareItem<T>(target_item: T, compareFn: (...args: any[]) => boolean) {
    return (compare_target: any) => compareFn(target_item, compare_target)
}

export function _nodeHasBorderId(node: InitedDataNode, target_id: string) {
    return node.borders.map(b => b.id).includes(target_id)
}

export function _nodesHasImpost(nodes: InitedDataNode[]) {
    const fn_nodes = nodes.map(n => addPropFn(n, 'hasImpost', (impost_id: string) => n.borders.map(b => b.id).includes(impost_id)))


    return (id: string) => fn_nodes.some(fn => fn.hasImpost(id))
}

const stateMap = <T, P extends keyof T>(items: T[], prop: P) => items.map(i => ({ [prop]: i[prop] }))




// ChainConcatNodes(mockNode_3_1, mockNode_3_2, mockNode_4)
// ConcatNodes(mockNode_1, mockNode_2, false)