import { IProfileSystem } from "../../CalcModule/GlassDelta"
import { _ID } from "../../CommonFns/HelpersFn"
import { CoordsChainList } from "../../CommonFns/LinkedItems"
import { ISideStateValues } from "../../Types/CalcModuleTypes"
import { Size } from "../CalcModels/Size"
import { Point } from "../PointsModel/Point"
import { IBalka, IBalkaBaseNode, IBalkaModel_ver1, InnerCoords, SvgCoords } from "./InterfaceBalkaModels"

export class Balka implements IBalka {
    id: string
    pos: InnerCoords
    type: ISideStateValues
    constructor(
        coords: InnerCoords,
        type: ISideStateValues = 'rama',
    ) {
        this.pos = coords
        this.type = type
        this.id = _ID()
    }

}

export class BaseRamaNode implements IBalkaBaseNode {

    id!: string
    content!: IBalka[]
    svg_coords!: SvgCoords
    /**
     * 
     * @param size: {w:number, h:number}
     * @param position: SVGCoords
     */
    constructor(
        size: Size,
        position = { x: 0, y: 0 }
    ) {
        this.CreateBaseRamaNode(size, position)
    }

    getRamaInnerCoords(svg_coords: SvgCoords) {
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

    CreateBaseRamaNode = (size: Size, position = { x: 0, y: 0 }) => {
        const { w, h } = size
        const SvgC: SvgCoords = { //*Node Svg Coords
            x: position.x,
            y: position.y,
            ox: position.x + w,
            oy: position.y + h
        }

        const balkasCoords = this.getRamaInnerCoords(SvgC)
        const rama_contents = balkasCoords.map(c => new Balka(c, 'rama'))
        const newRamaNode: IBalkaBaseNode = {
            id: _ID(),
            content: rama_contents,
            svg_coords: SvgC
        }
        this.content = rama_contents
        this.id = newRamaNode.id
        this.svg_coords = newRamaNode.svg_coords
        return newRamaNode



    }
}