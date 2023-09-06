import { _Pt } from "../../CommonFns/HelpersFn"
import { ChainList, ChainNode } from "../../CommonFns/LinkedItems"
import { InnerCoords } from "../BalkaModel/InterfaceBalkaModels"
import { Point } from "./Point"
import { IPoint } from "./PointInterface"

export class PointModel {

}


function SquarePointsList(w: number, h: number, offset?: IPoint) {
    const { x, y } = offset ?? { x: 0, y: 0 }
    const [ox, oy] = [x + w, y + h]
    const pts = [
        _Pt(x, y),
        _Pt(ox, y),
        _Pt(ox, oy),
        _Pt(x, oy),
    ]
    const list = new ChainList<Point>()
    pts.forEach(p => list.push(p))
    console.log('PointList: ', list)
    return list
}
const getFirst = <T>(node: ChainNode<T>): ChainNode<T> => node.prev ? getFirst(node.prev) : node
function transformToVector(node: ChainNode<Point>): ChainNode<InnerCoords> {
    const start = node.data.asStart
    const end = node.next ? node.next.data.asEnd : getFirst(node).data.asEnd
    const vnode = new ChainNode({ ...start, ...end })

    return node.next ? transformToVector(node.next) : vnode
}

const sql = SquarePointsList(40, 20)


