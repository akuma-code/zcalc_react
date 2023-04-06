import { IProfileSystem, ISideState } from "../CalcModule/GlassDelta"
import { PROFILE } from "./Enums"
import { ISide } from "./FrameTypes"

export type ISideStateValues = 'rama' | 'imp' | 'stv_imp' | 'stv_rama' | 'imp_shtulp' | 'svet'
export type INodeState = 'stv' | 'fix' | 'shtulp' | 'stv232'
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
    state: PickAviable<ISideStateValues, Sys>
}[]

export type PickAviable<T, S extends keyof typeof PROFILE> = T extends ISideState[S] ? T : string



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
