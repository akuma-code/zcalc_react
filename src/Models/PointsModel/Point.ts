import { _log } from "../../hooks/useUtils"
import { IEndPoint, IPoint, IStartPoint } from "./PointInterface"


export interface PointConstructor {
    new(initX: number, initY: number): IPoint
}
export interface StartPointConstructor {
    new(initX: number, initY: number): IStartPoint
}
export interface EndPointConstructor {
    new(initX: number, initY: number): IEndPoint
}
class Point implements IPoint {
    public x: number = 0
    public y: number = 0
    constructor(initX: number, initY: number) {
        this.x = initX
        this.y = initY
    }

    public isEqualTo(point: Point | [number, number]) {
        if (Array.isArray(point)) {
            const [a, b] = point
            return this.x - a === 0 && this.y - b === 0
        }
        return (point.x - this.x === 0 && point.y - this.y === 0)
    }
}
class StartPoint implements IStartPoint {
    public x1: number = 0
    public y1: number = 0
    constructor(initX: number, initY: number) {
        this.x1 = initX
        this.y1 = initY
    }
}
class EndPoint implements IEndPoint {
    public x2: number = 0
    public y2: number = 0
    constructor(initX: number, initY: number) {
        this.x2 = initX
        this.y2 = initY
    }
}
export function PointCreator(...numbers: number[]): Point
export function PointCreator(...numbers: number[]): [StartPoint, EndPoint]
export function PointCreator(...numbers: number[]) {
    if (numbers.length % 2 === 1) return _log("неверное число членов")
    if (numbers.length === 2) {
        const [x, y] = numbers
        return new Point(x, y)
    }

    if (numbers.length === 4) {
        const [x1, y1, x2, y2] = numbers
        return [new StartPoint(x1, y1), new EndPoint(x2, y2)] as const
    }
}

function _Pt<T>(
    pointConstructor: PointConstructor,
    x: number,
    y: number

): IPoint {
    return new pointConstructor(x, y)
}
