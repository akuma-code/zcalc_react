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

export interface IAnchorPoint {
    x: number | null
    y: number | null
    observers: ITargetPoint['update'][]
    sync: () => void
}

export interface ITargetPoint {
    x: number | null
    y: number | null
    update: (pt: IPoint) => void
}