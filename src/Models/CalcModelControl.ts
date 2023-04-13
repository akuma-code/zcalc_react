import { IProfileSystem } from "../CalcModule/GlassDelta"
import { IModelVariant, INodeBorder } from "../Types/CalcModuleTypes"
import { BORDER } from "../Types/Enums"
import { useUtils } from "../hooks/useUtils"
import { CalcModel, CalcNode, DIR, ICalcNodeParams_v1 } from "./CalcModels"
const ID = useUtils.stringID
export function CreateNewModel(system = 'Proline' as IProfileSystem, size?: { w: number, h: number }) {
    const msize = size ? { width: size.w, height: size.h } : { width: 400, height: 800 }

    const newNodeParams: ICalcNodeParams_v1 = {
        nodeSize: { nw: msize.width, nh: msize.height },
        POS: { x: 0, y: 0, ox: msize.width, oy: msize.height },
    }
    const newNodeBorders: INodeBorder[] = [
        { side: "bot", state: "rama", desc: BORDER.rama },
        { side: "top", state: "rama", desc: BORDER.rama },
        { side: "left", state: "rama", desc: BORDER.rama },
        { side: "right", state: "rama", desc: BORDER.rama },
    ]
    const newModel = new CalcModel(
        { system, modelSize: msize, modelPOS: { x: 0, y: 0 }, type: "win" },
        [new CalcNode(newNodeParams, newNodeBorders)]
    )
    newModel.label = 'New_Fix'
    // console.log('newModel', newModel.data)
    return new CalcModel(
        { system, modelSize: msize, modelPOS: { x: 0, y: 0 }, type: "win" },
        [new CalcNode(newNodeParams, newNodeBorders)]
    )
}

function NodeDevideVertical(Node: CalcNode) {
    const { borders, nodeSize, POS, id } = Node
    const newPOs = {
        left: { ox: nodeSize!.nw / 2 },
        right: { x: nodeSize!.nw / 2, ox: nodeSize!.nw }
    }
    const newSize = {
        nw: nodeSize!.nw / 2
    }

    const newBorder = {
        left: (b: INodeBorder) => b.side === 'right' ? { ...b, state: 'imp' } : b,
        right: (b: INodeBorder) => b.side === 'left' ? { ...b, state: 'imp' } : b
    }
    const LeftNode = {
        id,
        POS: { ...POS, ...newPOs.left },
        nodeSize: { ...nodeSize, ...newSize },
        borders: borders?.map(newBorder.left)
    } as CalcNode
    const RightNode = {
        id: ID(),
        POS: { ...POS, ...newPOs.right },
        nodeSize: { ...nodeSize, ...newSize },
        borders: borders?.map(newBorder.right)
    } as CalcNode
    return [LeftNode, RightNode] as const

}
export interface ICalcModelActions {
    AddImpost(node_id: string, dir: 'vert' | 'hor'): void
    AddImpost_hor(node_id: string): void
}
export class CalcModelService {

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
    { side: "right", state: "rama", delta: 26.5, desc: BORDER.imp },
]
const fixBorders: INodeBorder[] = [
    { side: "bot", state: "rama", delta: 48, desc: BORDER.rama },
    { side: "top", state: "rama", delta: 48, desc: BORDER.rama },
    { side: "left", state: "rama", delta: 48, desc: BORDER.rama },
    { side: "right", state: "rama", delta: 48, desc: BORDER.rama },
]
const stvBorders: INodeBorder[] = [
    { side: "bot", state: "stv_rama", delta: 48, desc: BORDER.stv_rama },
    { side: "top", state: "stv_rama", delta: 48, desc: BORDER.stv_rama },
    { side: "left", state: "stv_rama", delta: 48, desc: BORDER.stv_rama },
    { side: "right", state: "stv_rama", delta: 48, desc: BORDER.stv_rama },
]
const tstBorders2: INodeBorder[] = [
    { side: "bot", state: "rama", delta: 48, desc: BORDER.rama },
    { side: "top", state: "rama", delta: 48, desc: BORDER.rama },
    { side: "right", state: "rama", delta: 48, desc: BORDER.rama },
    { side: "left", state: "imp", delta: 26.5, desc: BORDER.imp },
]

const tstNode1 = new CalcNode({ nodeSize: { nw: 400, nh: 800 }, POS: { x: 0, y: 0 } }, tstBorders1)
const tstNode2 = new CalcNode({ nodeSize: { nw: 400, nh: 800 }, POS: { x: 400, y: 0 } }, tstBorders2)
const fixNode = new CalcNode({ nodeSize: { nw: 400, nh: 800 }, POS: { x: 0, y: 0 } }, fixBorders)
const stvNode = new CalcNode({ nodeSize: { nw: 400, nh: 800 }, POS: { x: 0, y: 0 } }, stvBorders)

// const tstModel = new CalcModel(tstParams, [stvNode])
// console.log('tstModel.data: ', tstModel.data)
// tstModel.AddImpost(stvNode.id, Directions.horisontal)

