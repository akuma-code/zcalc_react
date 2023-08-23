import { _ID } from "../../CommonFns/HelpersFn"
import { CoordsChainList } from "../../CommonFns/LinkedItems"
import { _log } from "../../hooks/useUtils"
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
export function _Pt(...n: [number, number, number, number]): [StartPoint, EndPoint]
export function _Pt(...n: [number, number]): Point
export function _Pt(...numbers: number[]) {
    if (numbers.length % 2 === 1) {
        _log("неверное число членов")
        return []
    }

    if (numbers.length === 2) {
        const [x, y] = numbers
        return new Point(x, y)
    }

    if (numbers.length === 4) {
        const [x1, y1, x2, y2] = numbers
        return [new StartPoint(x1, y1), new EndPoint(x2, y2)] as const
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

const ShapeModel = (w: number, h: number) => ({
    id: _ID(),
    rama: new CoordsChainList(),
    stvs: [],
    imps: [],
    nodes: [],
    shapeSize: new Size(w, h),
    startPos: new Point(0, 0)

})