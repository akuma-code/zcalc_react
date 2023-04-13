import GlassDelta, { IProfileSystem } from "../CalcModule/GlassDelta"
import { ICalcModelNode_v1, ICalcModel_v1, IModelVariant, IPosOffset, IProfileDelta, INodeBorder } from "../Types/CalcModuleTypes"
import { BORDER, PROFILE } from "../Types/Enums"
import { useUtils } from "../hooks/useUtils"
import { CMService } from "./CalcModelControl"


const ID = useUtils.stringID
export enum DIR {
    'vertical', 'horisontal'
}


export type IModelParams = {
    type?: IModelVariant
    system?: IProfileSystem
    modelSize?: { w: number; h: number }
    modelPOS?: IPosOffset
    delta?: IProfileDelta
}
export type ICalcNodeParams = {
    POS?: IPosOffset | undefined
    nodeSize?: { w: number; h: number } | undefined
}


//** _____________________class CalcNODE */
export class CalcNode implements ICalcModelNode_v1 {
    id: string
    POS?: IPosOffset | undefined
    nodeSize?: { w: number; h: number } | undefined
    borders?: INodeBorder[] | []
    constructor(params: ICalcNodeParams, borders?: INodeBorder[]) {
        this.id = ID()
        this.nodeSize = {
            w: params.nodeSize!.w,
            h: params.nodeSize!.h,
        }
        this.POS = {
            x: params.POS!.x, y: params.POS!.y,
            ox: params.POS!.x + this.nodeSize!.w, oy: params.POS!.y + this.nodeSize!.h
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
    modelSize?: { w: number; h: number }
    modelPOS?: IPosOffset
    nodes?: CalcNode[]

    constructor(system: IProfileSystem, type?: IModelVariant) {
        this.id = ID();
        this.type = type || 'win'
        this.system = system || 'Proline'
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

            size: this.modelSize,
            pos: this.modelPOS || defaultState.pos
        }
    }
    initNodes(nodes: ICalcModelNode_v1[]) {
        return this.nodes = nodes
    }
    initSize({ w, h }: { w: number, h: number }) {
        this.modelSize = { w, h }
    }
    initPos(newPos: { x: number, y: number }) {
        if (!this.modelSize) return
        this.modelPOS = { ...newPos, ox: this.modelSize.w, oy: this.modelSize.h }
    }
    AddImpost(node_id: string, dir = DIR.vertical) {
        if (!this.nodes) throw new Error('No Nodes')
        // console.log('prevState', ...this.nodes)
        const nodes = this.nodes!
        const idx = nodes.findIndex(n => n.id === node_id)
        const current = nodes?.reduce((find, n) => {
            if (n.id === node_id) find = { ...find, ...n }
            return find
        }, {} as CalcNode) as CalcNode


        const subNodes = splitNode(current, dir)
        nodes?.splice(idx, 1, ...subNodes)

        this.nodes = nodes

    }
}

function splitNode(Node: CalcNode, dir = DIR.vertical) {
    const { borders, nodeSize, POS, id } = Node
    if (!nodeSize) return [Node]
    const newPOs = {
        left: { x: POS!.x, ox: POS!.x + nodeSize?.w / 2 },
        right: { x: POS!.x + nodeSize?.w / 2, ox: POS!.x + nodeSize!.w },
        bot: { oy: POS!.y + nodeSize!.h / 2, y: POS!.y },
        top: { y: POS!.y + nodeSize!.h / 2, oy: POS!.y + nodeSize!.h },
    }
    const newSizeV = {
        nw: nodeSize!.w / 2,
    }
    const newSizeH = {
        nh: nodeSize!.h / 2,
    }
    const newState = (initState: INodeBorder['state']) => {
        if (initState === 'rama') return 'imp'
        if (initState === 'stv_rama') return 'stv_imp'
        return initState
    }
    const newBorder = {
        left: (b: INodeBorder) => b.side === 'right' ? { ...b, state: newState(b.state) } : b,
        right: (b: INodeBorder) => b.side === 'left' ? { ...b, state: newState(b.state) } : b,
        top: (b: INodeBorder) => b.side === 'bot' ? { ...b, state: newState(b.state) } : b,
        bot: (b: INodeBorder) => b.side === 'top' ? { ...b, state: newState(b.state) } : b,
    }
    const LeftNode = {
        id,
        POS: { ...POS, ...newPOs.left },
        nodeSize: { ...nodeSize, ...newSizeV },
        borders: borders?.map(newBorder.left)
    } as CalcNode
    const RightNode = {
        id: ID(),
        POS: { ...POS, ...newPOs.right },
        nodeSize: { ...nodeSize, ...newSizeV },
        borders: borders?.map(newBorder.right)
    } as CalcNode
    const TopNode = {
        id: ID(),
        POS: { ...POS, ...newPOs.top },
        nodeSize: { ...nodeSize, ...newSizeH },
        borders: borders?.map(newBorder.top)
    } as CalcNode
    const BotNode = {
        id,
        POS: { ...POS, ...newPOs.bot },
        nodeSize: { ...nodeSize, ...newSizeH },
        borders: borders?.map(newBorder.bot)
    } as CalcNode

    const subNodes = dir === DIR.vertical ? [LeftNode, RightNode] : [BotNode, TopNode]
    return subNodes

}
function joinNodes({ first, second }: { first: CalcNode, second: CalcNode }): CalcNode {
    const sybNodes = [first, second]
    return CMService.joinNodes(sybNodes)


}
