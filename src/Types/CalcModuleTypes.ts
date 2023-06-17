import { IProfileSystem, IBorderState } from "../CalcModule/GlassDelta"
import { Border } from "../Models/CalcModels/Border"
import { CalcNode } from "../Models/CalcModels/CalcNode"
import { BorderDescEnum, ProfileVekaEnum } from "./Enums"
import { ISide } from "./FrameTypes"

export type ISides = 'top' | 'left' | 'right' | 'bottom'
export const Sides2Arr = ['top', 'left', 'right', 'bottom'] as ISides[]
export type ISideStateValues = 'rama' | 'imp' | 'stv_imp' | 'stv_rama' | 'imp_shtulp' | 'svet'
export type INodeState = 'stv' | 'fix' | 'shtulp' | 'stv232'
export type INodeVariant = 'win' | 'door'
export type IModelVariant = 'win' | 'door'
export type ICoords = readonly [number, number]
export type IProfileDelta = Record<ISideStateValues, number>
export type IStates = keyof IProfileDelta
export type IModelDelta = {
    rama: number,
    imp: number,
    stv_rama: number,
    stv_imp: number,
    svet: number
    imp_shtulp?: number,
    porog?: number,
}
export type AddProp<T, P> = T & P
export type WithId = { id: string }
export interface NotNullOBJ { }
export type IPosOffset = { x: number; y: number; ox?: number; oy?: number }
type INodePos = {
    r: number,
    c: number
}
export type ISizeWH = {
    w: number,
    h: number
}
export type ISidesObj = {
    [key in ISide]: IBorderState[IProfileSystem]
}
type IBorder = { state: ISideStateValues, desc?: string }
export type IBorders = Record<ISides, IBorder>
export type IBordersCls = Record<ISides, Border>
export type IBorders3 = {
    [K in ISides]: { state: ISideStateValues, desc?: string }
}

export type ISidesArray<Sys extends keyof typeof ProfileVekaEnum> = {
    side: ISide & string,
    state: ValidState<ISideStateValues, Sys>
}[]

export type ValidState<T, S extends keyof typeof ProfileVekaEnum> = T extends IBorderState[S] ? T : never



export interface CM_Node {
    id?: string
    sides: ISidesObj
    state?: INodeState
    pos?: INodePos
    size: ISizeWH
    system: IProfileSystem

}
export type IDict<T extends string> = {
    [K in IBorderState[IProfileSystem]]: T
}


export type INodeBorder = {
    side: ISide
    state?: ISideStateValues
    desc?: string
    delta?: number
}
export type NodeBorderForm<T extends string> = {
    side: { [K in ISide]: T }
    state: IBorderState[IProfileSystem]
    desc?: T
    delta?: number
}
export type INodeDelta = { [K in ISides]: number }
export type CalcFormBorderExport = {
    system: keyof typeof ProfileVekaEnum,
    state: INodeState,
    nodeType: INodeVariant
    borders: INodeBorder[]
    w: string | number
    h: string | number
}

export type CalcFormDataExport<T extends string> = {
    system: keyof typeof ProfileVekaEnum,
    state: INodeState | T,
    nodeType: 'win' | 'door' | 'shtulp' | T,
    top: IBorderState[IProfileSystem] | T,
    bot: IBorderState[IProfileSystem] | T,
    left: IBorderState[IProfileSystem] | T,
    right: IBorderState[IProfileSystem] | T,
    w: string
    h: string
}
export interface ICalcModelNode_v1 {
    id: string;
    borders?: INodeBorder[];
    POS?: IPosOffset
    NSize?: { w: number; h: number };
    glass?: { gw: number; gh: number }
    nDelta?: INodeDelta
    // offsetPos: { ox: number, oy: number }
}
export interface ICalcModel_v1 {
    id: string
    system?: keyof typeof ProfileVekaEnum
    type?: IModelVariant
    MSize?: { w: number, h: number }
    mPos?: IPosOffset
    delta?: IModelDelta
    nodes?: ICalcModelNode_v1[]


}
