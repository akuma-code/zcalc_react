import { _ID } from "../../CommonFns/HelpersFn"
import { ISideStateValues } from "../../Types/CalcModuleTypes"
import { Size } from "../CalcModels/Size"
import { Balka_ver1 } from "./BalkaModels"
import { IBalka_ver1, IBalkaBaseNode_ver1, InnerCoords, SvgCoords } from "./InterfaceBalkaModels"

export const CreateBalka = (coords: InnerCoords, type: ISideStateValues = 'rama'): IBalka_ver1 => ({ id: _ID(), pos: coords, type: type })

export const CreateBaseNode = (size: Size, position = { x: 0, y: 0 }) => {
    const { w, h } = size
    const SvgC: SvgCoords = { //*Node Svg Coords
        x: position.x,
        y: position.y,
        ox: position.x + w,
        oy: position.y + h
    }

    const balkasCoords = getInnerRamaCoords(SvgC)
    const rama_contents = balkasCoords.map(c => new Balka_ver1(c, 'rama'))
    const newNode: IBalkaBaseNode_ver1 = {
        id: _ID(),
        content: rama_contents,
        svg_coords: SvgC
    }
    return newNode

}

function getInnerRamaCoords(svg_coords: SvgCoords) {
    const { x, y, ox, oy } = svg_coords
    const balkasCoords: InnerCoords[] = [
        {
            x1: x,
            y1: y,
            x2: ox,
            y2: y
        },
        {
            x1: ox,
            y1: y,
            x2: ox,
            y2: oy
        },
        {
            x1: ox,
            y1: oy,
            x2: x,
            y2: oy
        },
        {
            x1: x,
            y1: oy,
            x2: x,
            y2: y
        },
    ]
    return balkasCoords
}

export function addImpost(coords: InnerCoords, content: IBalka_ver1[]) {
    const SvgBalkaCoords: SvgCoords = {
        x: coords.x1,
        y: coords.y1,
        ox: coords.x2,
        oy: coords.y2,
    }
    const newImp = new Balka_ver1(coords, 'imp')
    return [...content, newImp]
}


