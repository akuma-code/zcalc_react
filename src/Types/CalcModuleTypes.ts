import { IProfileSystem, ISideState } from "../CalcModule/GlassDelta"
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
    [key in ISide]: ISideState[IProfileSystem]
}
export type ISides2<T extends keyof ISideState> = {
    [key in ISide]: ISideState[T]
}

export type ISidesArray<Sys extends keyof typeof PROFILE> = {
    side: ISide & string,
    state: ValidState<ISideStateValues, Sys>
}[]

export type ValidState<T, S extends keyof typeof PROFILE> = T extends ISideState[S] ? T : never



export interface CM_Node {
    id?: string
    sides: ISides
    state?: INodeState
    pos?: INodePos
    size: INodeSize
    system: IProfileSystem

}
export type IDict<T extends string> = {
    [K in ISideState[IProfileSystem]]: T
}


export type NodeBorder = {
    side: ISide
    state: ISideStateValues
    desc?: string
    delta?: number
}
export type NodeBorderForm<T extends string> = {
    side: { [K in ISide]: T }
    state: ISideState[IProfileSystem]
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
    top: ISideState[IProfileSystem] | T,
    bot: ISideState[IProfileSystem] | T,
    left: ISideState[IProfileSystem] | T,
    right: ISideState[IProfileSystem] | T,
    w: string
    h: string
}
