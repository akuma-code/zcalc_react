import GlassDelta, { IProfileSystem } from "../../CalcModule/GlassDelta"
import { ICalcModelNode_v1, ICalcModel_v1, IModelVariant, IPosOffset, IProfileDelta, INodeBorder, ISizeWH } from "../../Types/CalcModuleTypes"
import { BORDER, DIR, PROFILE } from "../../Types/Enums"
import { ISize } from "../../Types/FrameTypes"
import { useUtils } from "../../hooks/useUtils"
import { CMService } from "./CalcModelControl"
import { TemplateNode, TemplateModel, EmptyBorders } from "./CalcModelTemplates"
import { CalcNode } from "./CalcNode"



export const ID = useUtils.stringID


export interface ICNodeMethods {
    initBorders?: (newBorders?: INodeBorder[]) => void
}
export type IParams_CModel = {
    type?: IModelVariant
    system?: IProfileSystem
    MSize?: { w: number; h: number }
    modelPOS?: IPosOffset
    delta?: IProfileDelta
}
export type IParams_CalcNode = {
    POS?: IPosOffset | undefined
    NSize?: { w: number; h: number } | undefined
}
interface ICalcInitModel extends CalcModel {
    id: string
    type: IModelVariant
    system: IProfileSystem
    MSize: { w: number; h: number }
    mPos: IPosOffset
    nodes: CalcNode[]
}
interface ICalcBaseModel extends CalcModel {
    id: string
    type: IModelVariant
    system: IProfileSystem
    MSize: ISizeWH
}
export type ICalcNode_inited = Required<ICalcModelNode_v1>


//** __________________class CalcModel */
//TODO: 
export class CalcModel implements ICalcModel_v1 {
    id: string
    type?: IModelVariant
    system?: IProfileSystem
    label?: string
    MSize?: ISizeWH
    mPos?: IPosOffset
    nodes?: CalcNode[]

    constructor(system: IProfileSystem, size: ISizeWH, type?: IModelVariant) {
        this.id = ID();
        this.type = type || 'win'
        this.system = system || 'Proline'
        this.label = `CModel_v1_${this.id}`
        this.setSize(size)
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
            size: this.MSize,
            pos: this.mPos || defaultState.pos
        }
    }

    setNodes(nodes: CalcNode[] | CalcNode) {
        if (!Array.isArray(nodes)) nodes = [nodes]
        this.nodes = nodes
        return this
    }
    setSize({ w, h }: ISizeWH) {
        this.MSize = { w, h }
        return this
    }
    setPos(newPos: IPosOffset) {
        if (!this.MSize) return this
        this.mPos = { x: newPos?.x || 0, y: newPos?.y || 0, ox: +this.MSize.w, oy: +this.MSize.h }
        return this
    }



    AddImpost(node_id: string, dir = DIR.vertical) {
        if (!this.nodes) throw new Error('No Nodes')
        // console.log('prevState', ...this.nodes)
        const nodes = this.nodes!
        const idx = nodes.findIndex(n => n.id === node_id)
        const current = [...nodes]?.reduce((find, n) => {
            if (n.id === node_id) find = { ...find, ...n }
            return find as Partial<CalcNode>
        }, {} as Partial<CalcNode>) as CalcNode


        const subNodes = splitNode(current, dir)
        // nodes?.splice(idx, 1, ...subNodes as Required<CalcNode>[])

        this.nodes = nodes

    }
}




function splitNode(Node: CalcNode, dir = DIR.vertical) {
    const { borders, NSize: nodeSize, POS, id } = Node
    if (!nodeSize || !POS) throw new Error("No SIZES or POS");

    const newPOs = {
        left: { x: POS.x, ox: POS.x + nodeSize.w / 2 },
        right: { x: POS.x + nodeSize.w / 2, ox: POS.x + nodeSize.w },
        bot: { oy: POS.y + nodeSize.h / 2, y: POS.y },
        top: { y: POS.y + nodeSize.h / 2, oy: POS.y + nodeSize.h },
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
    }
    const RightNode = {
        id: ID(),
        POS: { ...POS, ...newPOs.right },
        nodeSize: { ...nodeSize, ...newSizeV },
        borders: borders?.map(newBorder.right)
    }
    const TopNode = {
        id: ID(),
        POS: { ...POS, ...newPOs.top },
        nodeSize: { ...nodeSize, ...newSizeH },
        borders: borders?.map(newBorder.top)
    }
    const BotNode = {
        id,
        POS: { ...POS, ...newPOs.bot },
        nodeSize: { ...nodeSize, ...newSizeH },
        borders: borders?.map(newBorder.bot)
    }

    const subNodes = dir === DIR.vertical ? [LeftNode, RightNode] as const : [BotNode, TopNode] as const
    return subNodes

}
function joinNodes({ first, second }: { first: CalcNode, second: CalcNode }): Partial<CalcNode> {
    const sybNodes = [first, second]
    return CMService.joinNodes(sybNodes)


}

