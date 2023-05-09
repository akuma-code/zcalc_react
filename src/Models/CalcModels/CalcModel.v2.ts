import GlassDelta, { IProfileSystem } from "../../CalcModule/GlassDelta"
import { IModelDelta, IModelVariant, IPosOffset, ISizeWH } from "../../Types/CalcModuleTypes"
import { DIR, DIRECTION } from "../../Types/Enums"
import { useUtils } from "../../hooks/useUtils"
import { CNodeService } from "./CNodeService"
import { CalcNode_v2 } from "./CalcNode.v2"
import { Size } from "./Size"

export const ID = useUtils.stringID


export class CalcModel_v2 {
    id: string
    system: IProfileSystem
    Delta: IModelDelta
    nodes!: CalcNode_v2[]
    // baseNode!: CalcNode_v2
    size!: Size
    Pos: { x: number, y: number }
    Offset!: { ox: number, oy: number }
    type!: IModelVariant
    label?: string
    constructor(system = 'Proline') {
        this.id = ID()
        this.system = system as IProfileSystem
        this.label = `CModel_v2_${this.id}`
        this.type = 'win'
        this.Delta = GlassDelta[this.system]
        this.nodes = [] as CalcNode_v2[]
        this.Pos = { x: 0, y: 0 }

        // if (this.nodes.length === 0) this.setNodes()
    }

    get Coords() {
        return { ...this.Pos, ...this.Offset }
    }
    get baseNode() {
        if (!this.size) return null

        const baseNode = new CalcNode_v2(this.size)
        this.Pos && baseNode.setPos(this.Pos.x, this.Pos.y).loadBordersPreset('FixBorders')

        return baseNode
    }
    setSize(w: number, h: number) {
        this.size = new Size(w, h)
        // this.baseNode = this.BaseRamaNode()
        this.updateOffset()
        return this
    }
    getDelta(sys: IProfileSystem) {
        const mdelta = GlassDelta[sys]
        this.Delta = mdelta
        return this
    }
    updateDelta() {
        // this.nodes = this.nodes.map(n => n.updateDelta(this.Delta))
    }
    changeSize(newSize: Partial<ISizeWH>) {
        if (!this.size) throw new Error("Size undefined!");
        this.size = { ...this.size, ...newSize }
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
    setNodes(nodes?: CalcNode_v2[] | CalcNode_v2) {
        if (!nodes) nodes = []
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
        if (!this.size) throw new Error("Size undefined, can't update offset");

        const { ox, oy } = { ox: this.size.w, oy: this.size.h }
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
    BaseRamaNode() {
        if (!this.size) throw new Error("Define Size");

        const baseNode = new CalcNode_v2(this.size)
        this.Pos && baseNode.setPos(this.Pos.x, this.Pos.y).loadBordersPreset('FixBorders')

        return baseNode

    }

    addImpost(node_id: string, dir: DIRECTION) {
        console.log('node_id', node_id)
        const main = this.getNode(node_id)
        console.log('main', main)
        const idx = this.nodes.findIndex(n => n.id === node_id)
        const subnodes = dir === DIRECTION.VERT ? CNodeService.DevideVertical(main) : CNodeService.DevideHorisontal(main)
        console.log('subNodes', subnodes)
        const nn = [...this.nodes].splice(idx, 1, ...subnodes)
        this.setNodes(nn)
        return this
    }
}

export class CModelService extends CalcModel_v2 {
    static CreateNew(params: { sys: IProfileSystem, size: ISizeWH }) {
        const blankNode = new CalcNode_v2(params.size)

        const model = new CalcModel_v2(params.sys)
            .setSize(params.size.w, params.size.h)
            .setNodes()
            .setPos(0, 0)
        return model
    }




}

