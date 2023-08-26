import { IProfileSystem } from "../../CalcModule/GlassDelta"
import { _ID } from "../../CommonFns/HelpersFn"
import { CoordsChainList } from "../../CommonFns/LinkedItems"
import { ISideStateValues, WithId } from "../../Types/CalcModuleTypes"
import { CoordsTuple } from "../../Types/DataModelTypes"
import { ISize } from "../../Types/FrameTypes"
import { _log } from "../../hooks/useUtils"
import { Size } from "../CalcModels/Size"
import { Point } from "../PointsModel/Point"
import { IEndPoint, IPoint, IStartPoint } from "../PointsModel/PointInterface"


export type SvgCoordsKeys = 'x' | 'ox' | 'y' | 'oy'
export type InnerCoordsKeys = 'x1' | 'x2' | 'y1' | 'y2'
export type InnerCoords = { [K in InnerCoordsKeys]: number }
export type SvgCoords = { [K in SvgCoordsKeys]: number }

export interface IBalka_ver1 {
    id: string
    type: ISideStateValues
    pos: InnerCoords
    offsetDelta?: number // отступ от балки до стекла (старая дельта, возможно надо больше свойств но хз, или убрать вообще в парамметры, или пользоваться SVGPArams)
}

export interface IBalkaBaseNode_ver1 {
    id: string
    content: IBalka_ver1[]
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

export interface IBalkaModel_ver2 {
    id: string
    rama: CoordsChainList<IBalka_ver1>
    params: Pick<ICommonParams, 'id' | 'size' | 'system'>
}

export interface IBalka extends WithId {
    pos: InnerCoords
    xy?: IPoint
}