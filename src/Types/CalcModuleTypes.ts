import { IProfileSystem, IBorderState } from "../CalcModule/GlassDelta"
import { BORDER } from "./Enums"
import { PROFILE } from "./Enums"
import { ISide } from "./FrameTypes"

export type ISideStateValues = 'rama' | 'imp' | 'stv_imp' | 'stv_rama' | 'imp_shtulp' | 'svet'
export type INodeState = 'stv' | 'fix' | 'shtulp' | 'stv232'
export type INodeVariant = 'win' | 'door'
export type IProfileDelta = {
    rama: number,
    imp: number,
    stv_rama: number,
    stv_imp: number,
    svet: number
    imp_shtulp?: number,
    porog?: number,
}
type INodePos = {
    r: number,
    c: number
}
export type INodeSize = {
    w: number,
    h: number
}
export type ISides = {
    [key in ISide]: IBorderState[IProfileSystem]
}
export type ISides2<T extends keyof IBorderState> = {
    [key in ISide]: IBorderState[T]
}

export type ISidesArray<Sys extends keyof typeof PROFILE> = {
    side: ISide & string,
    state: ValidState<ISideStateValues, Sys>
}[]

export type ValidState<T, S extends keyof typeof PROFILE> = T extends IBorderState[S] ? T : never



export interface CM_Node {
    id?: string
    sides: ISides
    state?: INodeState
    pos?: INodePos
    size: INodeSize
    system: IProfileSystem

}
export type IDict<T extends string> = {
    [K in IBorderState[IProfileSystem]]: T
}


export type NodeBorder = {
    side: ISide
    state: ISideStateValues
    desc?: string
    delta?: number
}
export type NodeBorderForm<T extends string> = {
    side: { [K in ISide]: T }
    state: IBorderState[IProfileSystem]
    desc?: T
    delta?: number
}

export type CalcFormBorderExport = {
    system: keyof typeof PROFILE,
    state: INodeState,
    nodeType: INodeVariant
    borders: NodeBorder[]
    w: string | number
    h: string | number
}

export type CalcFormDataExport<T extends string> = {
    system: keyof typeof PROFILE,
    state: INodeState | T,
    nodeType: 'win' | 'door' | 'shtulp' | T,
    top: IBorderState[IProfileSystem] | T,
    bot: IBorderState[IProfileSystem] | T,
    left: IBorderState[IProfileSystem] | T,
    right: IBorderState[IProfileSystem] | T,
    w: string
    h: string
}
