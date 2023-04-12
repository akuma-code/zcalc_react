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


//** _____________________class CalcNODE */
export class CalcNode implements ICalcModelNode_v1 {
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
export class CalcModel implements ICalcModel_v1 {
    id: string
    type?: IModelVariant
    system?: IProfileSystem
    label?: string
    modelSize?: { width: number; height: number }
    modelPOS?: IPosOffset
    nodes?: CalcNode[]

    constructor(params: IModelParams_v2, nodes?: ICalcModelNode_v1[],) {
        this.id = ID();
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
        this.label = `CModel_v1_${this.id}`
    }

    get delta() {
        const system = this.system
        if (!system) throw new Error('System not exist!')
        const D = GlassDelta[system]
        return D
    }

    get data() {
        const defaultState = {
            id: ID(),
            nodes: [] as CalcNode[],
            system: 'Proline',
            type: 'win',
            label: 'CModel_v1',
            pos: { x: 0, y: 0 }
        }
        return {
            id: this.id || defaultState.id,
            nodes: this.nodes || defaultState.nodes,
            params: {
                system: this.system || defaultState.system,
                type: this.type || defaultState.type,
                label: this.label || defaultState.label,
                glsDelta: this.delta,
            },
            size: this.modelSize,
            pos: this.modelPOS || defaultState.pos
        }
    }

}

