import { _ID, _Pt } from "../../CommonFns/HelpersFn"
import { ChainList, CoordsChainList } from "../../CommonFns/LinkedItems"
import { CoordsTuple } from "../../Types/DataModelTypes"
import { _log } from "../../hooks/useUtils"
import { InnerCoords } from "../BalkaModel/InterfaceBalkaModels"
import { Size } from "../CalcModels/Size"
import { IAnchorPoint, IEndPoint, IStartPoint, ITargetPoint } from "./PointInterface"

class IPoint {
    public x: number
    public y: number
    constructor(initX: number, initY: number) {
        this.x = initX
        this.y = initY
    }
}

export class Point implements IPoint {
    public x: number = 0
    public y: number = 0
    constructor(initX: number, initY: number) {
        this.x = initX
        this.y = initY
    }
    public get asStart() {
        return new StartPoint(this.x, this.y)
    }
    public get asEnd() {
        return new EndPoint(this.x, this.y)
    }
    public isEqualTo(point: Point | [number, number]) {
        if (Array.isArray(point)) {
            const [a, b] = point
            return this.x - a === 0 && this.y - b === 0
        }
        return (point.x - this.x === 0 && point.y - this.y === 0)
    }
}
export class StartPoint implements IStartPoint {
    public x1: number = 0
    public y1: number = 0
    constructor(initX: number, initY: number) {
        this.x1 = initX
        this.y1 = initY
    }
    public get asPoint() {
        return new Point(this.x1, this.y1)
    }
}
export class EndPoint implements IEndPoint {
    public x2: number = 0
    public y2: number = 0
    constructor(initX: number, initY: number) {
        this.x2 = initX
        this.y2 = initY
    }
    public get asPoint() {
        return new Point(this.x2, this.y2)
    }
}

export function CreatePoints(...numbers: number[]) {
    if (numbers.length % 2 !== 0) {
        _log("неверное число членов")
        return []
    }
    const arr: Point[] = []
    for (let i = 0; i <= numbers.length - 2; i = i + 2) {
        arr.push(_Pt(numbers[i], numbers[i + 1]))
    }
    return arr
}
export class PointFactory {
    square(w: number, h: number, offset?: IPoint) {
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
}

const ShapeModel = (w: number, h: number) => ({
    id: _ID(),
    rama: new CoordsChainList(),
    stvs: [],
    imps: [],
    nodes: [],
    shapeSize: new Size(w, h),
    startPos: new Point(0, 0)

})

export class AnchorPoint extends Point {

    public observers: ((pt: IPoint) => void)[] = []

    constructor(x: number, y: number) {
        super(x, y)
        this.x = x
        this.y = y

    }

    sync() {
        if (!this.x || !this.y) return
        this.observers.forEach(o => o({ x: this.x!, y: this.y! }))
    }

    push(observerFn: (pt: IPoint) => void) {
        this.observers.push(observerFn)

        return this.observers
    }
}

export class TargetPoint extends Point implements ITargetPoint {

    constructor(pt: Point) {
        super(pt.x, pt.y)


    }

    public update(pt: IPoint) {
        _log("Old value: ", this.x, this.y)
        this.x = pt.x
        this.y = pt.y
        _log("New value: ", this.x, this.y)
    }
}

