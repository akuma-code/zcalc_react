import { CNodeService } from "./CNodeService";
import { IBordersCls, ICoords, ISides2 } from "../../Types/CalcModuleTypes";
import { DIRECTION, OPPOSITEenum } from "../../Types/Enums";
import { Border, FixBorderPreset, Impost } from "./Border";
import { CalcNode_v2 } from "./CalcNode.v2";
import { EndPoint } from "./EndPoint";
import { Size } from "./Size";

type EP = { start: ICoords, end: ICoords }



export function isEqualCoordsStartEnd(c1: ICoords, c2: typeof c1) {
    const [x1, y1] = c1
    const [x2, y2] = c2
    if (x1 === x2 && y1 === y2) return true
    return false
}

export const isEqualCoords = (c1: readonly [number, number, number, number], c2: typeof c1) => c1.every((c, idx) => c === c2[idx])
export function isEqualEndPoints(ep1: EP, ep2: typeof ep1) {
    const isEqStart = isEqualCoordsStartEnd(ep1.start, ep2.start)
    const isEqEnd = isEqualCoordsStartEnd(ep1.end, ep2.end)

    if (isEqStart && isEqEnd) return true
    return false
}

export function ArrBorders<T extends IBordersCls>(borders: T) {
    return Object.entries(borders).map(([k, v]) => ({ ...v, side: k }))
}

export function findBorderByEndPoint(ep: EP, borders: IBordersCls) {
    const bdrs = ArrBorders(borders)
    const obj = bdrs.reduce((border, b) => {
        if (isEqualEndPoints(ep, b.endPoints!)) border = b
        return border
    }, {})
    const arr = bdrs.find(b => isEqualEndPoints(ep, b.endPoints!))
    return obj
}

// export function getBorderSideByEndPoint(ep: EP, node: CalcNode_v2) {
//     const { borders } = node
//     const [border] = node.getBordersArray().filter(b => isEqualEndPoints(ep, b.endPoints!))
//     if (!border.side) return false
//     return border.side as ISides2
// }

// export function getNodeImposts(node: CalcNode_v2) {
//     const brds = node.getBordersArray()


//     return brds.filter(border => ['imp', 'stv_imp', 'imp_shtulp'].includes(border.state)) as unknown as Array<Border & { side: ISides2, direction: DIRECTION }>
// }

export function MakeNode(params: { size?: Size, pos?: ICoords, borders?: IBordersCls }) {
    if (!params.size) throw new Error("Set Size for new node!");
    const s = new Size(params.size.w, params.size.h)
    const node = new CalcNode_v2(s)
    params.borders && node.setBorders(params.borders)
    params.pos && node.setPos(...params.pos)
    // console.log('node', node)
    return node
}

export function isMainImpost<T extends { endPoints?: EndPoint, direction?: DIRECTION }>(impost: T, node: CalcNode_v2) {
    // const borders = node.getBordersArray()
    // const connectedSides = impost.direction === DIRECTION.VERT ? ['top', 'bottom'] : ['left', 'right']
    // const connectedBorders = borders.filter(b => connectedSides.includes(b.side))
    const { start: [x, y], end: [ox, oy] } = impost.endPoints!
    if (x === node.Pos[0] && ox === node.PosOffset[0]) return true
    if (y === node.Pos[1] && oy === node.PosOffset[1]) return true
    return false


}

export function findConnectedNodes(impost: Border, nodes: CalcNode_v2[]): CalcNode_v2[] {
    const result = [] as CalcNode_v2[]
    if (impost.direction === DIRECTION.VERT) {
        const filtered = nodes.filter(n =>
            n.borders.left.endPoints?.start[0] === impost.endPoints?.start[0] || n.borders.right.endPoints?.start[0] === impost.endPoints?.start[0])
        result.push(...filtered)
    }


    return result
}
export function getAxisAndOffsetIdx<T extends readonly [number, number]>(...endpoints: T[]) {
    const [x, y, ox, oy] = endpoints
    const [mainAxisIdx, offsetAxisIdx] = (x === ox && y !== oy) ? [1, 0] : [0, 1]
    return [mainAxisIdx, offsetAxisIdx] as const
}

export function filterConnectedNodes(nodes: CalcNode_v2[], impost: Border) {
    // console.log('nodes', nodes)
    const ImpStart = impost.endPoints.start
    const ImpOffset = impost.endPoints.end
    const [maIdx, offIdx] = getAxisAndOffsetIdx(impost.endPoints.start, impost.endPoints.end)
    const connectedNodes = nodes.filter(node => (node.Pos[maIdx] === ImpStart[maIdx] || node.PosOffset[maIdx] === ImpStart[maIdx]))
    const filtered = connectedNodes.reduce((nodesForJoin, node) => {
        const pos = node.Pos
        const offset = node.PosOffset
        if (pos[offIdx] >= ImpStart[offIdx] && offset[offIdx] <= ImpOffset[offIdx]) nodesForJoin.push(node)
        return nodesForJoin
    }, [] as CalcNode_v2[])

    return filtered
}

export function joinConnectedNodes(...nodes: CalcNode_v2[]) {
    const summary = nodes.reduce((result_node, node) => {
        if (!result_node.id) return result_node = cloneNode(node)

        result_node.absorbNode(node)
        return result_node
    }, {} as CalcNode_v2)
    console.log('joinedResutl: ', summary)

    return summary
}

function cloneNode(Node: CalcNode_v2): CalcNode_v2 {
    const newNode = new CalcNode_v2(Node.size);
    newNode.setPos(...Node.Pos)
        .setBorders(Node.borders);
    return newNode as CalcNode_v2
}

export function consumeNode(mainNode: CalcNode_v2, consumeNode: CalcNode_v2) {
    const { side, error_msg } = canConsume(mainNode, consumeNode)
    if (!side) throw new Error(error_msg);

    const sumSize = side === 'top' || side === 'bottom' ?
        [mainNode, consumeNode].reduce((sum, node) => {
            sum.h += node.size.h
            sum.w = node.size.w
            return sum
        }, { w: 0, h: 0 })
        :
        [mainNode, consumeNode].reduce((sum, node) => {
            sum.h = node.size.h
            sum.w += node.size.w
            return sum
        }, { w: 0, h: 0 })
    const consumeBorder = consumeNode.borders[side]

    mainNode.changeSize(sumSize).setBorder(side, consumeBorder)
    return mainNode

}

export function canConsume(...nodes: Parameters<typeof consumeNode>): { result: boolean, side?: ISides2, error_msg?: string } {
    const [main, consume] = nodes
    const mainCoords = dataExtract(main).coords

    let can_consume: boolean = false
    // can_consume = main.size.w !== consume.size.w && main.size.h !== consume.size.h ? false : true
    const side_consume = mainCoords.reduce((s, mc) => {
        const oppSide = OPPOSITEenum[mc.side as ISides2]
        const [c1, c2] = [consume.borders[oppSide].coords, mc.coords]
        if (isEqualCoords(c1, c2)) {
            s = mc.side as ISides2
            can_consume = true
        }
        return s
    }, '' as ISides2)
    const error_msg = "Nodes cannot join! Check borders coordinates!"
    const res = can_consume ? {
        result: can_consume,
        side: side_consume,

    } : {
        result: can_consume,
        error_msg: error_msg,

    }
    console.log(res);

    return res
}


export function dataExtract(node: CalcNode_v2) {
    const node_borders = Object.entries(node.borders).map(([side, border]) => ({ side, border }))
    const coords = node_borders.map(nb => ({ side: nb.side as ISides2, coords: nb.border.coords }))
    const data = {
        node_id: node.id,
        array: node_borders,
        coords: coords
    }
    return data


}
// const n1 = MakeNode({ size: new Size(20, 100), pos: [0, 0] })
// const n2 = MakeNode({ size: new Size(20, 40), pos: [20, 0], })
// n2.changeBorderState('top', 'imp')
// const n3 = MakeNode({ size: new Size(20, 60), pos: [20, 40], })
// n3.changeBorderState('bottom', 'imp')
// export const testnodes = [n1, n2, n3]

