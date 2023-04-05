import { IProfileSystem, ISideState } from "../CalcModule/GlassDelta"
import { ISide } from "./FrameTypes"

export type ISideStateValues = 'rama' | 'imp' | 'stv_imp' | 'stv_rama' | 'imp_shtulp' | 'svet'
export type INodeState = 'stv' | 'fix' | 'shtulp' | 'stv232'
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


export interface CM_Node {
    id?: string
    sides: ISides
    state?: INodeState
    pos?: INodePos
    size: INodeSize
    system: IProfileSystem

}
type IDict<T extends string> = {
    [K in ISideState[IProfileSystem]]: T
}


export function Const2Desc(constName: ISideState[IProfileSystem]) {
    const desc: IDict<string> = {
        'rama': 'рама',
        'imp': 'импост',
        'stv_imp': 'створка-импост',
        'stv_rama': 'створка-рама',
        "imp_shtulp": 'штульп-импост',
        'svet': 'Свет'
    } as const
    return desc[constName] as ISideStateValues
}