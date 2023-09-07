import { _Pt } from "../../CommonFns/HelpersFn"
import { ChainList, ChainNode } from "../../CommonFns/LinkedItems"
import { _log } from "../../hooks/useUtils"
import { InnerCoords } from "../BalkaModel/InterfaceBalkaModels"
import { Point } from "./Point"
import { IPoint } from "./PointInterface"


interface IPointModel_Impost {
    pts: Point[]
    connectors: {}
}
export class PointModel {

}
export class PointCalculator {
    sum(p1: IPoint, p2: IPoint): IPoint {
        const sumcoords = {
            x: p2.x + p1.x,
            y: p1.y + p2.y
        }
        return { ...p1, ...sumcoords }
    }
    subtract(p1: IPoint, p2: IPoint): IPoint {
        const res = {
            x: p1.x - p2.x,
            y: p1.y - p2.y
        }
        return res
    }
    subtractABS(p1: IPoint, p2: IPoint): IPoint {
        const res = {
            x: Math.abs(p1.x - p2.x),
            y: Math.abs(p1.y - p2.y)
        }
        return res
    }
    devide(p: IPoint, numb: number): IPoint {
        if (numb === 0) {
            _log("Делить на ноль не рекомендуется!")
            return p
        }
        return { ...p, x: p.x / numb, y: p.y / numb }
    }

    mid(p1: IPoint, p2: IPoint, offset: IPoint = { x: 0, y: 0 }): IPoint {
        const razn = this.subtractABS(p2, p1)
        const mid = this.devide(razn, 2)
        return this.sum(mid, offset)
    }

    distance(p1: IPoint, p2: IPoint): number {
        const { x: x1, y: y1 } = p1
        const { x: x2, y: y2 } = p2
        const len = Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2))
        return +len.toExponential(4)
    }

    removeOffset(offset: IPoint, ...pts: IPoint[]) {
        return pts.map(p => this.subtract(p, offset))
    }

    getA(p1: IPoint, p2: IPoint) {
        if (p1.x === p2.x) return p2.y
        if (p1.y === p2.y) return p2.x
        const a = (p1.y - p2.y) / (p1.x - p2.x)
        return a
    }
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





