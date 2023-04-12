import GlassDelta, { IProfileSystem } from "../CalcModule/GlassDelta"
import { ICalcModelNode_v1, ICalcModel_v1, IModelVariant, IPosOffset, IProfileDelta, INodeBorder } from "../Types/CalcModuleTypes"
import { BORDER, PROFILE } from "../Types/Enums"
import { useUtils } from "../hooks/useUtils"
const ID = useUtils.stringID



export type IModelParams_v2 = {
    type?: IModelVariant
    system?: IProfileSystem
    modelSize?: { width: number; height: number }
    modelPOS?: IPosOffset
    delta?: IProfileDelta
}
export type ICalcNodeParams_v1 = {
    POS?: IPosOffset | undefined
    nodeSize?: { nw: number; nh: number } | undefined
}


//** _____________________class NODE */
export class tstCalcNode implements ICalcModelNode_v1 {
    id: string
    POS?: IPosOffset | undefined
    nodeSize?: { nw: number; nh: number } | undefined
    borders?: INodeBorder[] | []
    constructor(params: ICalcNodeParams_v1, borders?: INodeBorder[]) {
        this.id = ID()
        this.nodeSize = {
            nw: params.nodeSize!.nw,
            nh: params.nodeSize!.nh,
        }
        this.POS = {
            x: params.POS!.x, y: params.POS!.y,
            ox: params.POS!.x + this.nodeSize!.nw, oy: params.POS!.y + this.nodeSize!.nh
        }
        this.borders = borders || []
    }

}


//** __________________class CalcModel */
export class tstCalcModelv2 implements ICalcModel_v1 {
    id: string
    type?: IModelVariant
    system?: IProfileSystem
    modelSize?: { width: number; height: number }
    modelPOS?: IPosOffset
    nodes?: tstCalcNode[]
    constructor(
        params: IModelParams_v2,
        nodes: ICalcModelNode_v1[],
        id?: string,
    ) {
        this.id = id || ID();
        this.type = params.type
        this.system = params.system
        this.modelSize = { width: params.modelSize!.width, height: params.modelSize!.height }
        this.modelPOS = {
            x: params.modelPOS!.x,
            y: params.modelPOS!.y,
            ox: params.modelPOS!.x + this.modelSize.width,
            oy: params.modelPOS!.y + this.modelSize.height,
        }
        this.nodes = nodes || [];

    }

    get delta() {
        const system = this.system
        if (!system) throw new Error('System not exist!')
        const D = GlassDelta[system]
        return D
    }

}

const tstParams = {
    modelPOS: { x: 0, y: 0 },
    modelSize: { width: 400, height: 800 },
    system: 'Proline',
    type: "win"
} as { type: IModelVariant }

const tstBorders1: INodeBorder[] = [
    { side: "bot", state: "rama", delta: 48, desc: BORDER.rama },
    { side: "top", state: "rama", delta: 48, desc: BORDER.rama },
    { side: "left", state: "rama", delta: 48, desc: BORDER.rama },
    { side: "right", state: "imp", delta: 26.5, desc: BORDER.imp },
]
const tstBorders2: INodeBorder[] = [
    { side: "bot", state: "rama", delta: 48, desc: BORDER.rama },
    { side: "top", state: "rama", delta: 48, desc: BORDER.rama },
    { side: "right", state: "rama", delta: 48, desc: BORDER.rama },
    { side: "left", state: "imp", delta: 26.5, desc: BORDER.imp },
]

const tstNode1 = new tstCalcNode({ nodeSize: { nw: 400, nh: 800 }, POS: { x: 0, y: 0 } }, tstBorders1)
const tstNode2 = new tstCalcNode({ nodeSize: { nw: 400, nh: 800 }, POS: { x: 400, y: 0 } }, tstBorders2)
export const tstCMv2 = new tstCalcModelv2(tstParams, [tstNode1, tstNode2])



tstCMv2.nodes = [tstNode1, tstNode2]


