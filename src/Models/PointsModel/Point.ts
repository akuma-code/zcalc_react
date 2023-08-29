import { _ID, _Pt } from "../../CommonFns/HelpersFn"
import { CoordsChainList } from "../../CommonFns/LinkedItems"
import { CoordsTuple } from "../../Types/DataModelTypes"
import { _log } from "../../hooks/useUtils"
import { InnerCoords } from "../BalkaModel/InterfaceBalkaModels"
import { Size } from "../CalcModels/Size"
import { IEndPoint, IPoint, IStartPoint } from "./PointInterface"



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
    square(w: number, h: number, ...args: number[]) {

        const square = [

        ]
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