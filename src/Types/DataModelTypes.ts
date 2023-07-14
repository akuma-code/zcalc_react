import { IProfileSystem } from "../CalcModule/GlassDelta"
import { CalcNode_v2 } from "../Models/CalcModels/CalcNode.v2"
import { Size } from "../Models/CalcModels/Size"
import { ISides } from "./CalcModuleTypes"
import { ISideStateValues } from "./CalcModuleTypes"
import { ICoords } from "./CalcModuleTypes"
import { IModelDelta } from "./CalcModuleTypes"
import { BorderDescEnum } from "./Enums"


// export type CoordsTuple = readonly [...ICoords, ...ICoords]
export interface CoordsTuple extends Array<number> {
    length: 4
    0: number
    1: number
    2: number
    3: number
}
export enum CoordsEnum {
    'X', 'Y', 'OX', 'OY'
}
export type WithIdProp = { id: string }
export type SideBorderProps = { side: ISides, border: IDataBorder }
export interface IDataModel {
    id: string
    nodes: IDataNode[]
    size: Size
    coords?: CoordsTuple
    baseNode?: IDataNode
    params?: {
        system?: IProfileSystem
        type?: 'win' | 'door'
        glass_delta?: IModelDelta
    }
}
export interface IResizeDataModel {
    id: string
    nodes: IDataNode[] | []
    primeNode: IDataNode
    params?: {
        system?: IProfileSystem
        type?: 'win' | 'door'
        glass_delta?: IModelDelta
    }
}
export interface IDataNode {
    id: string
    size?: Size
    sideBorders?: SideBorderProps[]
    borders?: IDataBorder[]
    coords?: CoordsTuple
}
export interface IDataBorder {
    id: string,
    state: ISideStateValues,
    desc: BorderDescEnum,
    side: ISides,
    coordsSVG?: CoordsTuple
}

export interface IDataSideBorderPack {
    id: string
    size?: Size
    sideStates: Record<ISides, ISideStateValues>
    borders?: IDataBorder[]
    coords?: CoordsTuple
}