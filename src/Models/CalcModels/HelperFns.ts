import { IBordersCls, ICoords, ISides2 } from "../../Types/CalcModuleTypes";
import { Border } from "./Border";
import { CalcNode_v2 } from "./CalcNode.v2";

type EP = { start: ICoords, end: ICoords }



export function isEqualCoords(c1: ICoords, c2: typeof c1) {
    const [x1, y1] = c1
    const [x2, y2] = c2
    if (x1 === x2 && y1 === y2) return true
    return false
}


export function isEqualEndPoints(ep1: EP, ep2: typeof ep1) {
    const isEqStart = isEqualCoords(ep1.start, ep2.start)
    const isEqEnd = isEqualCoords(ep1.end, ep2.end)

    if (isEqStart && isEqEnd) return true
    return false
}

export function ArrBorders<T extends IBordersCls>(borders: T) {
    return Object.entries(borders).map(([k, v]) => ({ ...v, side: k }))
}

export function findBorderByEndPoint(ep: EP, borders: IBordersCls) {
    const bdrs = ArrBorders(borders)
    const obj = bdrs.reduce((border, b) => {
        if (isEqualEndPoints(ep, b.endPoints!)) border = b
        return border
    }, {})
    const arr = bdrs.find(b => isEqualEndPoints(ep, b.endPoints!))
    return obj
}

export function getBorderSideByEndPoint(ep: EP, node: CalcNode_v2) {
    const { borders } = node
    const [border] = node.getBordersArray().filter(b => isEqualEndPoints(ep, b.endPoints!))
    if (!border.side) return false
    return border.side as ISides2
}