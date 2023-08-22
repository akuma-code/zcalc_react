import { IProfileSystem } from "../../CalcModule/GlassDelta"
import { _ID } from "../../CommonFns/HelpersFn"
import { CoordsChainList } from "../../CommonFns/LinkedItems"
import { ISideStateValues } from "../../Types/CalcModuleTypes"
import { CoordsTuple } from "../../Types/DataModelTypes"
import { ISize } from "../../Types/FrameTypes"
import { _log } from "../../hooks/useUtils"
import { Size } from "../CalcModels/Size"


export type SvgCoordsKeys = 'x' | 'ox' | 'y' | 'oy'
export type InnerCoordsKeys = 'x1' | 'x2' | 'y1' | 'y2'
export type InnerCoords = { [K in InnerCoordsKeys]: number }
export type SvgCoords = { [K in SvgCoordsKeys]: number }

export interface IBalka {
    id: string
    type: ISideStateValues
    pos: InnerCoords
    offsetDelta?: number // отступ от балки до стекла (старая дельта, возможно надо больше свойств но хз, или убрать вообще в парамметры, или пользоваться SVGPArams)
}

export interface IBalkaBaseNode {
    id: string
    content: IBalka[]
    svg_coords: SvgCoords
}

export interface ICommonParams {
    id: string
    system: IProfileSystem
    size: ISize

}

export interface Test_BalkaModel {
    params: Pick<ICommonParams, 'id' | 'size' | 'system'>
    // rama:ChainList<Rama>
    // stvorki:ChainList<STV>
    // imposts:Balka[]
    // zapolneniya:ZAP[]
}

export interface IBalkaModel_ver1 {
    id: string
    rama: CoordsChainList<IBalka>
    params: {

        system: IProfileSystem

    }
}