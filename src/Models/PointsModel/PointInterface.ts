export interface IPoint {
    x: number
    y: number
    isEqualTo(p: IPoint | [number, number]): boolean
}
export interface IStartPoint {
    x1: number
    y1: number
}
export interface IEndPoint {
    x2: number
    y2: number
}

