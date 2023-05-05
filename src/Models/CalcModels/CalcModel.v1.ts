import GlassDelta, { IProfileSystem } from "../../CalcModule/GlassDelta"
import { ICalcModelNode_v1, ICalcModel_v1, IModelVariant, IPosOffset, IModelDelta, INodeBorder, ISizeWH } from "../../Types/CalcModuleTypes"
import { BorderDesc, DIR, PROFILE } from "../../Types/Enums"
import { ISize } from "../../Types/FrameTypes"
import { useUtils } from "../../hooks/useUtils"
import { CModel_v1Service } from "./CalcModelControl"
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
    delta?: IModelDelta
}
export type IParamsDraftModel = {
    system?: IProfileSystem,
    type?: IModelVariant
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

    constructor(system?: IProfileSystem) {
        this.id = ID();
        this.label = `CModel_v1_${this.id}`
        this.type = 'win'
        this.system = 'Proline'
        this.setParams({ system, type: this.type })
        // if (this.nodes?.length) this.createFirstNode()
        // this.setSize(size)
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
    setParams({ system, type }: IParamsDraftModel) {
        if (system) this.system = system
        if (type) this.type = type
        return this
    }
    setNodes(nodes: CalcNode[] | CalcNode) {
        if (!Array.isArray(nodes)) nodes = [nodes]
        nodes.map(n => n.initDelta(this.delta))



        this.nodes = nodes
        if (this.nodes.length === 1) this.nodes = [...this.nodes].map(n => n.initPos({ x: 0, y: 0 }))
        return this
    }
    setSize({ w, h }: ISizeWH) {
        try {
            this.MSize = { w, h }
            return this
        } catch (error) {
            throw new Error("No Size!");

        }
        // if (!w || !h)


    }
    setPos(newPos: IPosOffset) {
        if (!this.MSize) return this
        this.mPos = { ...this.mPos, x: newPos?.x || 0, y: newPos?.y || 0 }
        if (this.mPos) this.mPos = { ...this.mPos, ox: this.mPos.x + this.MSize.w, oy: this.mPos.y + this.MSize.h }

        // if (this.nodes) this.nodes = [...this.nodes].map(n => n.initPos({ x: n.POS!.x + newPos.x, y: n.POS!.y + newPos.y }))
        return this
    }
    createFirstNode() {
        console.log("firstNode!");

        try {
            const newNode = new CalcNode()
            newNode.initBorders()
            newNode.initSize(this.MSize)
            if (this.nodes && this.nodes?.length >= 1) throw new Error("Nodes not emty! This method must be first!");
            this.nodes = []
            this.nodes.push(newNode)
            this.nodes.map(n => n.initDelta(this.delta))
            return this
        } catch (error) {
            console.log('error', error)
        }
        return this
    }


    AddImpost(node_id: string, dir = DIR.vertical) {
        if (!this.nodes) throw new Error('No Nodes')
        // console.log('prevState', ...this.nodes)
        const nodes = this.nodes
        const current = [...nodes]?.reduce((find, n) => {
            if (n.id === node_id) find = { ...find, ...n }
            return find as Partial<CalcNode>
        }, {} as Partial<CalcNode>) as Required<CalcNode>


        const idx = nodes.findIndex(n => n.id === node_id)
        const subNodes = splitNode(current, dir)
        const sb = spN(current)

        console.log('subNodes', sb)
        nodes?.splice(idx, 1, ...sb as unknown as CalcNode[])
        this.nodes = [...nodes]



    }
}




function splitNode(Node: CalcNode, dir = DIR.vertical) {
    const { borders, NSize, POS, id } = Node
    if (!NSize || !POS) throw new Error("No SIZES or POS");

    const newPOs = {
        left: { x: POS.x, ox: POS.x + NSize.w / 2 },
        right: { x: POS.x + NSize.w / 2, ox: POS.x + NSize.w },
        bot: { oy: POS.y + NSize.h / 2, y: POS.y },
        top: { y: POS.y + NSize.h / 2, oy: POS.y + NSize.h },
    }
    const newSizeV = {
        w: NSize!.w / 2,
    }
    const newSizeH = {
        h: NSize!.h / 2,
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
        NSize: { ...NSize, ...newSizeV },
        borders: borders?.map(newBorder.left)
    }
    const RightNode = {
        id: ID(),
        POS: { ...POS, ...newPOs.right },
        NSize: { ...NSize, ...newSizeV },
        borders: borders?.map(newBorder.right)
    }
    const TopNode = {
        id: ID(),
        POS: { ...POS, ...newPOs.top },
        NSize: { ...NSize, ...newSizeH },
        borders: borders?.map(newBorder.top)
    }
    const BotNode = {
        id,
        POS: { ...POS, ...newPOs.bot },
        NSize: { ...NSize, ...newSizeH },
        borders: borders?.map(newBorder.bot)
    }

    const subNodes = dir === DIR.vertical ? [LeftNode, RightNode] as const : [BotNode, TopNode] as const
    return subNodes

}
function joinNodes({ first, second }: { first: CalcNode, second: CalcNode }): Partial<CalcNode> {
    const subNodes = [first, second]
    return CModel_v1Service.joinNodes(subNodes)


}

function spN(Node: Required<CalcNode>) {
    const nS = (initState: INodeBorder['state']) => {
        if (initState === 'rama') return 'imp'
        if (initState === 'stv_rama') return 'stv_imp'
        return initState
    }

    const offsetX = +Node.POS.ox! / 2

    const LNode: CalcNode = new CalcNode()
        .initSize({ w: Node.NSize?.w / 2, h: Node.NSize.h })
        .initPos({ x: Node.POS.x, y: Node.POS.y, ox: offsetX, oy: Node.POS?.oy })
        .setBorder('right', 'imp') as CalcNode

    const RNode = new CalcNode()
        .initSize({ w: Node.NSize?.w / 2, h: Node.NSize.h })
        .initPos({ x: offsetX, y: Node.POS.y, ox: Node.POS.ox, oy: Node.POS?.oy })
        .initBorders(Node.borders)
        .setBorder('left', 'imp')

    // const changhesL = {
    //     POS: { ox: Node.POS!.x + offsetX },
    //     NSize: { w: +Node.NSize!.w / 2 },
    //     borders: Node.borders!.map(b => b.side === 'right' ? { ...b, state: nS(b.state) } : b)
    // }
    // const LNode = { ...Node, ...changhesL } as CalcNode
    // const changhesR = {
    //     POS: { x: offsetX },
    //     NSize: { w: +Node.NSize!.w / 2 },
    //     borders: Node.borders!.map(b => b.side === 'left' ? { ...b, state: nS(b.state) } : b)
    // }
    // const RNode = { ...Node, ...changhesR } as CalcNode


    return [LNode, RNode] as const
}