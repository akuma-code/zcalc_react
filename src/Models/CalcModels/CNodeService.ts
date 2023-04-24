import { CalcNode_v2 } from "./CalcNode.v2";


export class CNodeService extends CalcNode_v2 {
    static cloneNode(Node: CalcNode_v2) {
        const newNode = new CalcNode_v2(Node.NSize);
        newNode.setBorders(Node.borders)
            .setPos(Node.Pos);
        return newNode;
    }

    static DevideVertical(node: CalcNode_v2) {
        const subNodes = splitNode_Ver(node);
        console.log('subNodes_vert', subNodes);
        return subNodes;
    }
    static DevideHorizontal(node: CalcNode_v2) {
        const subNodes = splitNode_Hor(node);
        console.log('subNodes_hor', subNodes);
        return subNodes;
    }

    static JoinSubNodes(node_main: CalcNode_v2, node_second: CalcNode_v2) {
        const joinedNode = joinNodes(node_main, node_second);
        console.log('joinedNodes', joinedNode);
        return joinedNode;

    }
}
function splitNode_Ver(node: CalcNode_v2) {
    const { Pos, PosOffset, NSize } = node;
    const offsetX = (PosOffset!.ox - Pos.x) / 2;
    const changes = {
        left: {
            PosOffset: { ox: offsetX },
            NSize: { w: +NSize!.w / 2 }
        },
        right: {
            NSize: { w: +NSize!.w / 2 },
            Pos: { x: Pos.x + offsetX }
        }
    };

    const LNode = CNodeService.cloneNode(node);
    const RNode = CNodeService.cloneNode(node);

    LNode.changeSize(changes.left.NSize)
        .stateShift('right')
        .changeBorders(RNode.borders);


    RNode.changeSize(changes.right.NSize)
        .stateShift('left')
        .changePos(changes.right.Pos);



    return [LNode, RNode] as const;
}
function splitNode_Hor(node: CalcNode_v2) {
    const { Pos, PosOffset, NSize } = node;
    const offsetY = (PosOffset!.oy - Pos.y) / 2;
    const changes = {
        bottom: {
            PosOffset: { oy: offsetY },
            NSize: { h: +NSize!.h / 2 }
        },
        top: {
            PosOffset: { oy: offsetY },
            NSize: { h: +NSize!.h / 2 }
        }
    };

    const BotNode = CNodeService.cloneNode(node);
    const TopNode = CNodeService.cloneNode(node);

    BotNode.changeSize(changes.bottom.NSize)
        .stateShift('right');
    TopNode.changeSize(changes.top.NSize)
        .stateShift('left');
    return [BotNode, TopNode] as const;
}
function computeDirection(pos1: { x: number; y: number; ox: number; oy: number; }, pos2: typeof pos1) {
    if (pos1.oy === pos2.y)
        return 'horisontal';
    if (pos1.ox === pos2.x)
        return 'vertical';
    // throw new Error("not computed!")
    return { pos1, pos2 };
}
function joinNodes(node_1: CalcNode_v2, node_2: CalcNode_v2) {
    const N1 = CNodeService.cloneNode(node_1);
    const N2 = CNodeService.cloneNode(node_2);


    const sumOfSizes = {
        horisontal: { h: node_1.NSize!.h + node_2.NSize!.h },
        vertical: { w: node_1.NSize!.w + node_2.NSize!.w },
    };
    const changedBorder = {
        horisontal: { top: node_2.borders.top },
        vertical: { right: node_2.borders.right },
    };


    const getDir = (node_1: CalcNode_v2, node_2: typeof node_1) => {
        const coords1 = { ...node_1.Pos, ...node_1.PosOffset! };
        const coords2 = { ...node_2.Pos, ...node_2.PosOffset! };
        if (coords1.ox === coords2.x && coords1.y === coords2.y)
            return 'vertical' as const;
        if (coords1.oy === coords2.y && coords1.x === coords2.x)
            return 'horisontal' as const;
        return false;
    };

    const dir = getDir(N1, N2);

    if (!dir)
        throw new Error("Nodes cannot connect because of coordinates!");

    const newSize = sumOfSizes[dir];
    const newBorder = changedBorder[dir];
    N1.changeSize(newSize)
        .changeBorders(newBorder);
    console.log('node_1', N1);
    return node_1;

}
