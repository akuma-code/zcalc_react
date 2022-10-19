
export type ISide = 'top' | 'bot' | 'left' | 'right'
export type IFrameType = 'rama' | 'imp' | 'stv_imp' | 'stv_rama' | 'stv232_rama' | string
export type IFrameState = 'stv' | 'fix' | 'shtulp' | 'stv232'


export interface IFrame {
    top: IFrameType,
    bot: IFrameType,
    left: IFrameType,
    right: IFrameType,
    state?: IFrameState,
    posNumb: number,
    id?: number
    row: number,
    title?: string
    fSize?: {
        w: number,
        h: number
    }
}
export interface ISize {
    H: number,
    W: number,
}

export interface IRamaType {
    frames: IFrame[]
    size?: ISize
}

export type IFrameStateFields = Pick<IFrame, 'bot' | 'left' | 'right' | 'top'>
export type IFrameConstruct = Pick<IFrame, 'row' | 'posNumb'>
export type IConstructGrid = { row: number, cols: number }
