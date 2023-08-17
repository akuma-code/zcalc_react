import { _ID } from "../../CommonFns/HelpersFn"
import { ISideStateValues } from "../../Types/CalcModuleTypes"
import { CoordsTuple } from "../../Types/DataModelTypes"
import { _log } from "../../hooks/useUtils"
import { Size } from "../CalcModels/Size"


export type SvgCoordsKeys = 'x' | 'ox' | 'y' | 'oy'
export type InnerCoordsKeys = 'x1' | 'x2' | 'y1' | 'y2'
export type InnerCoords = { [K in InnerCoordsKeys]: number }
export type SvgCoords = { [K in SvgCoordsKeys]: number }

export interface IBalka {
    id: string
    type: ISideStateValues
    position: InnerCoords
    offsetDelta?: number // отступ от балки до стекла (старая дельта, возможно надо больше свойств но хз, или убрать вообще в парамметры, или пользоваться SVGPArams)
}

export interface IBalkaBaseNode {
    id: string
    content: IBalka[]
    svg_coords: SvgCoords
}

export interface IPoint {
    x: number
    y: number

}
export interface IStartPoint {
    x1: number
    y1: number
}
export interface IEndPoint {
    x2: number
    y2: number
}
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



