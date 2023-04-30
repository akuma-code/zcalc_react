import { Impost } from "./Border";
import { CalcNode_v2 } from "./CalcNode.v2";


export class CNodeService extends CalcNode_v2 {
    static cloneNode(Node: Required<CalcNode_v2>): Required<CalcNode_v2> {
        const newNode = new CalcNode_v2(Node.NSize);
        newNode.setPos(...Node.Pos)
            .setBorders(Node.borders);
        return newNode as Required<CalcNode_v2>
    }

    static DevideVertical(node: Required<CalcNode_v2>) {
        const subNodes = splitNode_Ver(node);
        // console.log('subNodes_vert', subNodes);
        return subNodes;
    }


    static JoinSubNodes(node_main: Required<CalcNode_v2>, node_second: typeof node_main) {
        const joinedNode = joinNodes(node_main, node_second);
        console.log('joinedNodes', joinedNode);
        return joinedNode;

    }
}
function splitNode_Ver(node: Required<CalcNode_v2>) {

    const newSize = node.NSize.w / 2
    const newPosRight = newSize
    const LNode = CNodeService.cloneNode(node).changeSize({ w: newSize });

    const RNode = CNodeService.cloneNode(node).changeSize({ w: newSize });
    RNode.changePos({ x: newPosRight }).setBorder("left", new Impost())
    LNode.setBorder("right", new Impost())




    console.log(LNode.borders, RNode.borders);

    return [LNode, RNode] as const;
}


function joinNodes(node_1: Required<CalcNode_v2>, node_2: typeof node_1) {
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


    const getDir = (node_1: Required<CalcNode_v2>, node_2: typeof node_1) => {
        const [x1, y1] = node_1.Pos
        const [ox1, oy1] = node_1.PosOffset
        const [x2, y2] = node_2.Pos


        if (ox1 === x2 && y1 === y2)
            return 'vertical' as const;
        if (oy1 === y2 && x1 === x2)
            return 'horisontal' as const;
        return false;
    };

    const dir = getDir(N1, N2);
    const side = dir === 'vertical' ? 'right' : 'top'
    if (!dir)
        throw new Error("Nodes cannot connect because of coordinates!");

    const newSize = sumOfSizes[dir];
    const newBorder = changedBorder[dir];
    N1.changeSize(newSize)

    console.log('node_1', N1);
    return node_1;

}

// function splitNode_Hor(node: CalcNode_v2) {
//     const { Pos, PosOffset, NSize } = node;
//     const offsetY = (PosOffset!.oy - Pos.y) / 2;
//     const changes = {
//         bottom: {
//             PosOffset: { oy: offsetY },
//             NSize: { h: +NSize!.h / 2 }
//         },
//         top: {
//             PosOffset: { oy: offsetY },
//             NSize: { h: +NSize!.h / 2 }
//         }
//     };

//     const BotNode = CNodeService.cloneNode(node);
//     const TopNode = CNodeService.cloneNode(node);

//     BotNode.changeSize(changes.bottom.NSize)
//         .stateShift('right');
//     TopNode.changeSize(changes.top.NSize)
//         .stateShift('left');
//     return [BotNode, TopNode] as const;
// }
//  const { Pos, PosOffset, NSize } = node;
//     const offsetX = (PosOffset!.ox - Pos.x) / 2;
//     const changes = {
//         left: {
//             PosOffset: { ox: offsetX },
//             NSize: { w: +NSize!.w / 2 }
//         },
//         right: {
//             NSize: { w: +NSize!.w / 2 },
//             Pos: { x: Pos.x + offsetX }
//         }
//     };

//     const LNode = CNodeService.cloneNode(node);
//     const RNode = CNodeService.cloneNode(node);

//     LNode.changeSize(changes.left.NSize)
//         .stateShift('right')
//         .changeBorders(RNode.borders);


//     RNode.changeSize(changes.right.NSize)
//         .stateShift('left')
//         .changePos(changes.right.Pos);

// function joinNodes(node_1: Required<CalcNode_v2>, node_2: typeof node_1) {
//     const N1 = CNodeService.cloneNode(node_1);
//     const N2 = CNodeService.cloneNode(node_2);


//     const sumOfSizes = {
//         horisontal: { h: node_1.NSize!.h + node_2.NSize!.h },
//         vertical: { w: node_1.NSize!.w + node_2.NSize!.w },
//     };
//     const changedBorder = {
//         horisontal: { top: node_2.borders.top },
//         vertical: { right: node_2.borders.right },
//     };


//     const getDir = (node_1: Required<CalcNode_v2>, node_2: typeof node_1) => {
//         const [x1, y1] = node_1.Pos
//         const [ox1, oy1] = node_1.PosOffset
//         const [x2, y2] = node_2.Pos


//         if (ox1 === x2 && y1 === y2)
//             return 'vertical' as const;
//         if (oy1 === y2 && x1 === x2)
//             return 'horisontal' as const;
//         return false;
//     };

//     const dir = getDir(N1, N2);

//     if (!dir)
//         throw new Error("Nodes cannot connect because of coordinates!");

//     const newSize = sumOfSizes[dir];
//     const newBorder = changedBorder[dir];
//     N1.changeSize(newSize)
//         .changeBorders(newBorder);
//     console.log('node_1', N1);
//     return node_1;

// }
