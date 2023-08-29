import { IProfileSystem } from "../../CalcModule/GlassDelta"
import { _ID, _Pt } from "../../CommonFns/HelpersFn"
import { ChainList, CoordsChainList } from "../../CommonFns/LinkedItems"
import { ISideStateValues } from "../../Types/CalcModuleTypes"
import { Size } from "../CalcModels/Size"
import { EndPoint, Point, StartPoint } from "../PointsModel/Point"
import { IPoint } from "../PointsModel/PointInterface"
import { IBalka, IBalka_ver1, IBalkaBaseNode_ver1, IBalkaModel_ver2, InitState_Create, InnerCoords, SvgCoords } from "./InterfaceBalkaModels"

export class Balka_ver1 implements IBalka_ver1 {
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

export class BaseRamaNode implements IBalkaBaseNode_ver1 {

    id!: string
    content!: IBalka_ver1[]
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
        const rama_contents = balkasCoords.map(c => new Balka_ver1(c, 'rama'))
        const newRamaNode: IBalkaBaseNode_ver1 = {
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
export type inferR<T> = T extends infer R ? R : never
export const createModelInitState = {
    size: new Size(110, 130),
    // startPos: _Pt(0, 0) as IPoint,
    system: 'Proline',
    node_state: 'fix',

}
export class ZapNode {

}
export class Balka implements IBalka {
    public id: string
    public pos: InnerCoords
    constructor(
        start: StartPoint,
        end: EndPoint
    ) {
        this.id = _ID()
        this.pos = { ...start, ...end }
    }

    get xy() {
        const { x1, x2, y1, y2 } = this.pos
        return new Point(x1 + Math.abs(x1 - x2) / 2, y1 + Math.abs(y1 - y2) / 2)
    }

}

const initModelData = {
    rama: new ChainList<Point>(),
    nodes: [
        {
            count: 1,
            size: { w: 300, h: 600 },
            anchors: new ChainList<Point>()
        },
    ],
    imps: [],
    params: {
        id: 'init_model_1',
        size: { w: 300, h: 600 },
        system: 'Proline',

    }
}

const sortByX = (pts: ChainList<Point>) => {
    const first = []
    const second = []
    const compX = (X: number) => (pt: Point) => pt.x < X ? true : false
}