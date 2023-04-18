import { IProfileSystem } from "../../CalcModule/GlassDelta"
import { IModelVariant, INodeBorder, IPosOffset } from "../../Types/CalcModuleTypes"
import { BORDER, DIR } from "../../Types/Enums"
import { useUtils } from "../../hooks/useUtils"
import { TemplateBorders } from "./CalcModelTemplates"
import { CalcModel, IParams_CalcNode } from "./CalcModels"
import { CalcNode } from "./CalcNode"



const ID = useUtils.stringID
export interface ICalcModelActions {
    AddImpost(node_id: string, dir: DIR): void
}


function CreateNewModel({ system = 'Proline' as IProfileSystem, type = 'stv' as keyof typeof TemplateBorders }, size?: { w: number, h: number }) {
    const msize = size ? { w: size.w, h: size.h } : { w: 400, h: 800 }
    const mPos = { x: 0, y: 0, ox: msize.w, oy: msize.h }
    const newNodeParams: IParams_CalcNode = {
        // NSize: { w: msize.w, h: msize.h },
        POS: { x: 0, y: 0, ox: msize.w, oy: msize.h },
    }

    const newNode = new CalcNode().initBorders(TemplateBorders[type]).initSize(msize)
    console.log('newNode', newNode)

    const newModel = new CalcModel(system)
    newModel.label = `template_${type}`
    newModel.setPos(mPos)
        .setNodes(newNode)
        .setSize(msize)


    return newModel

}


export class CMService {
    static createModel(system: IProfileSystem, size?: { w: number, h: number }) {
        return CreateNewModel({ system }, size)
    }


    static splitNode(Node: CalcNode, dir = DIR.vertical) {
        const { borders, NSize: nodeSize, POS, id } = Node
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
            NSize: { ...nodeSize, ...newSizeV },
            borders: borders?.map(newBorder.left)
        }
        const RightNode = {
            id: ID(),
            POS: { ...POS, ...newPOs.right },
            NSize: { ...nodeSize, ...newSizeV },
            borders: borders?.map(newBorder.right)
        }
        const TopNode = {
            id: ID(),
            POS: { ...POS, ...newPOs.top },
            NSize: { ...nodeSize, ...newSizeH },
            borders: borders?.map(newBorder.top)
        }
        const BotNode = {
            id,
            POS: { ...POS, ...newPOs.bot },
            NSize: { ...nodeSize, ...newSizeH },
            borders: borders?.map(newBorder.bot)
        }

        const subNodes = dir === DIR.vertical ? [LeftNode, RightNode] : [BotNode, TopNode]
        return subNodes

    }

    static joinNodes(Nodes2Join: CalcNode[]): Partial<CalcNode> {
        const [first, second] = Nodes2Join
        const RightBorder = second.borders?.find(b => b.side === 'right')
        const TopBorder = second.borders?.find(b => b.side === 'top')
        if (!first.POS || !second.POS) throw new Error('No POSITION VALUES!')
        const direction = checkDirection({ pos1: first?.POS, pos2: second?.POS })
        const result: Partial<CalcNode> = {
            id: first.id,
            POS: direction === DIR.vertical ?
                { ...first, x: first.POS.x, ox: second.POS.ox, y: first.POS.y }
                :
                { ...first, x: first.POS.x, y: first.POS.y, oy: second.POS.oy },
            borders: first.borders?.map(b => b.side === 'right' ?
                { ...b, ...RightBorder }
                :
                b.side === 'top' ? { ...b, ...TopBorder } :
                    b
            )
        }
        console.log('joinResult', result)
        return result
    }
}

function checkDirection({ pos1, pos2 }: { pos1: IPosOffset, pos2: IPosOffset }) {
    if (pos1.y === pos2.y && pos1.oy === pos2.oy) return DIR.horisontal
    if (pos1.x === pos2.x && pos1.ox === pos2.ox) return DIR.vertical
    return DIR.vertical
}

// const _Fix = {
//     "id": "a196",
//     "type": "win",
//     "system": "Proline",
//     "label": "New_Fix",
//     "modelSize": {
//         "w": 800,
//         "h": 1400
//     },
//     "modelPOS": {
//         "x": 0,
//         "y": 0,
//         "ox": 800,
//         "oy": 1400
//     },
//     "nodes": [
//         {
//             "id": "c55a",
//             "POS": {
//                 "x": 0,
//                 "y": 0,
//                 "ox": 800,
//                 "oy": 1400
//             },
//             "nodeSize": {
//                 "w": 800,
//                 "h": 1400
//             },
//             "borders": []
//         }
//     ]
// }