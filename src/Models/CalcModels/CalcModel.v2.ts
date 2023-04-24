import GlassDelta, { IProfileSystem } from "../../CalcModule/GlassDelta"
import { IModelDelta, IModelVariant, IPosOffset, ISizeWH } from "../../Types/CalcModuleTypes"
import { DIR } from "../../Types/Enums"
import { useUtils } from "../../hooks/useUtils"
import { CNodeService } from "./CNodeService"
import { CalcNode_v2 } from "./CalcNode.v2"

export const ID = useUtils.stringID


export class CalcModel_v2 {
    id: string
    system: IProfileSystem
    Delta: IModelDelta
    nodes: CalcNode_v2[]
    Size?: ISizeWH
    Pos?: { x: number, y: number }
    Offset?: { ox: number, oy: number }
    type?: IModelVariant
    label?: string
    constructor(system = 'Proline') {
        this.id = ID()
        this.system = system as IProfileSystem
        this.label = `CModel_v2_${this.id}`
        this.type = 'win'
        this.Delta = GlassDelta[this.system]
        this.nodes = [] as CalcNode_v2[]
    }

    get Coords() {
        return { ...this.Pos, ...this.Offset }
    }
    setSize(size: ISizeWH) {
        this.Size = size
        this.updateOffset()
        return this
    }
    getDelta(sys: IProfileSystem) {
        const mdelta = GlassDelta[sys]
        this.Delta = mdelta
        return this
    }
    updateDelta() {
        this.nodes = this.nodes.map(n => n.updateDelta(this.Delta))
    }
    changeSize(newSize: Partial<ISizeWH>) {
        if (!this.Size) throw new Error("Size undefined!");
        this.Size = { ...this.Size, ...newSize }
        this.updateOffset()
        return this
    }
    setSystem(sys: IProfileSystem) {
        this.system = sys
        this.getDelta(sys)
        this.updateDelta()
        return this
    }
    setType(type: IModelVariant) {
        this.type = type
        this.getDelta(this.system)
        this.updateDelta()
        return this
    }
    setLabel(text: string) {
        this.label = text
        return this
    }
    setNodes(nodes: CalcNode_v2[] | CalcNode_v2) {
        if (!Array.isArray(nodes)) nodes = [nodes]
        this.nodes = nodes
        this.updateDelta()
        return this
    }
    setPos(x = 0, y = 0) {
        this.Pos = { x, y }
        return this
    }
    changePos(newPos: { x?: number, y?: number }) {
        if (!this.Pos) throw new Error("Position undefined!");
        this.Pos = { ...this.Pos, ...newPos }
        return this
    }
    updateOffset() {
        if (!this.Size) throw new Error("Size undefined, can't update offset");

        const { ox, oy } = { ox: this.Size.w, oy: this.Size.h }
        this.Offset = { ox, oy }
        return this
    }
    getNode(id: string) {
        const node = this.nodes.reduce((current, n) => {
            if (n.id === id) current = n
            return current
        }, {} as CalcNode_v2)
        return node
    }
    devideNode(node_id: string, dir = 'vertical') {
        const current = this.getNode(node_id)
        const delIdx = this.nodes.findIndex(n => n.id === node_id)
        const subNodes = dir === 'vertical' ?
            CNodeService.DevideVertical(current) :
            CNodeService.DevideHorizontal(current)
        this.nodes = this.nodes.splice(delIdx, 1, ...subNodes)
        return this
    }

    joinNodes(node_id1: string, node_id2: string) {
        const N1 = this.getNode(node_id1)
        const N2 = this.getNode(node_id2)
        CNodeService.JoinSubNodes(N1, N2)
        const delIdx = this.nodes.findIndex(n => n.id === node_id2)
        this.nodes = this.nodes.splice(delIdx, 1)
        return this
    }
}

export class CModelService extends CalcModel_v2 {
    static CreateNew(params: { sys: IProfileSystem, size: ISizeWH }) {
        const blankNode = new CalcNode_v2(params.size)

        const model = new CalcModel_v2(params.sys)
            .setSize(params.size)
            .setNodes(blankNode)
            .setPos(0, 0)
        return model
    }




}

