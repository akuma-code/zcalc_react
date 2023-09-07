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

type IVector = {
    start: IPoint
    end: IPoint
}
export class PointCalculator {
    add(p1: IPoint, p2: IPoint): IPoint {
        const sumcoords = {
            x: p2.x + p1.x,
            y: p1.y + p2.y
        }
        return { ...p1, ...sumcoords }
    }
    sub(p1: IPoint, p2: IPoint): IPoint {
        const res = {
            x: p1.x - p2.x,
            y: p1.y - p2.y
        }
        return res
    }
    subABS(p1: IPoint, p2: IPoint): IPoint {
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
        const razn = this.subABS(p2, p1)
        const mid = this.devide(razn, 2)
        return this.add(mid, offset)
    }

    distance(p1: IPoint, p2: IPoint): number {
        const { x: x1, y: y1 } = p1
        const { x: x2, y: y2 } = p2
        const len = Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2))
        return +len.toExponential(4)
    }

    removeOffset(offset: IPoint, ...pts: IPoint[]) {
        return pts.map(p => this.sub(p, offset))
    }

    getAxisRate(p1: IPoint, p2: IPoint) {
        if (p1.x === p2.x) return p2.y
        if (p1.y === p2.y) return p2.x
        const a = (p1.y - p2.y) / (p1.x - p2.x)
        return a
    }

    angle<T extends IVector>(v1: T, v2: T) {
        let zeroPoint: IPoint;
        if (this.distance(v1.start, v2.end) === 0) zeroPoint = v1.start
        else if (this.distance(v1.end, v2.start) === 0) zeroPoint = v1.end
        else return _log("vector have not zeropoint!")
        _log(v1, v2)
        _log("zero point: ", zeroPoint)
        const a = this.distance(zeroPoint, v1.start)
        const b = this.distance(zeroPoint, v2.start)
        console.log('a: ', a)
        console.log('b:', b)
        const cos = Math.pow(a, 2) / Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
        console.log('cos: ', cos)
        return cos
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





