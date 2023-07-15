import { _ID } from "../../CommonFns/HelpersFn"
import { ISideStateValues } from "../../Types/CalcModuleTypes"
import { CoordsTuple } from "../../Types/DataModelTypes"
import { Size } from "../CalcModels/Size"


export type SvgCoordsKeys = 'x' | 'ox' | 'y' | 'oy'
export type InnerCoordsKeys = 'x1' | 'x2' | 'y1' | 'y2'
export type InnerCoords = { [K in InnerCoordsKeys]: number }
export type SvgCoords = { [K in SvgCoordsKeys]: number }
export interface IBalka {
    id: string
    type: ISideStateValues
    position: InnerCoords
    offsetDelta?: number // отступ от балки до стекла (старая дельта, возможно надо больше свойств но хз, или убрать вообще в парамметры, или пользоваться SVGPArams)
}

export interface IBalkaBaseNode {
    id: string
    content: IBalka[]
    svg_coords: SvgCoords
}

export interface SVGParams {
    coords: CoordsTuple
    borderOffset: CoordsTuple
}



