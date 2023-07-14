import { _ID } from "../../CommonFns/HelpersFn"
import { ISideStateValues } from "../../Types/CalcModuleTypes"
import { CoordsTuple } from "../../Types/DataModelTypes"
interface InnerNodePosition {
    x1: number
    y1: number
    x2: number
    y2: number
}

interface IBalka {
    id: string
    type: ISideStateValues
    position: InnerNodePosition
    offsetDelta?: number // отступ от балки до стекла (старая дельта, возможно надо больше свойств но хз, или убрать вообще в парамметры, или пользоваться SVGPArams)
}

interface IBalkaBaseNode {
    id: string
    content: IBalka[]
    position: InnerNodePosition
}

interface SVGParams {
    coords: CoordsTuple
    borderOffset: CoordsTuple
}

function newBalka(type: IBalka['type'], position: IBalka['position']): IBalka {
    return { id: _ID(), type, position }
}

const new_rama = newBalka('rama', { x1: 0, x2: 0, y1: 0, y2: 10 })