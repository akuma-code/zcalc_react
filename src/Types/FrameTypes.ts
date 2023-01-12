
export type ISide = 'top' | 'bot' | 'left' | 'right'
export type IFrameBalkaType = 'rama' | 'imp' | 'stv_imp' | 'stv_rama' | 'stv232_rama' | string
export type IFrameState = 'stv' | 'fix' | 'shtulp' | 'stv232'
export type StrNum = string | number

export interface IFramez {
    top: IFrameBalkaType,
    bot: IFrameBalkaType,
    left: IFrameBalkaType,
    right: IFrameBalkaType,
    state?: IFrameState,
    posNumb: number,
    id?: string
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
    frames: IFramez[]
    size?: ISize
}


export type IWinFramePart = {
    part_id?: StrNum
    row_id?: StrNum
}
export type IWinFrameRow = {

    id?: number
    wf_id?: number
    isActive?: boolean
    isMin?: boolean
    level?: number
    wf_parts?: IWinFramePart[]
    onClickFn?: () => void
}
export type IWinFrame = {
    id: string
    wf_group_id?: StrNum
    wf_rows: IWinFrameRow[]
}

export type IFrameStateFields = Pick<IFramez, 'bot' | 'left' | 'right' | 'top'>
export type IFrameConstruct = Pick<IFramez, 'row' | 'posNumb'>
export type IConstructGrid = { row: number | string, cols: number }
