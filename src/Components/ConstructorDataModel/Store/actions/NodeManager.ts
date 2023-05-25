import { ISideStateValues, ISides } from "../../../../Types/CalcModuleTypes";
import { CoordsTuple, IDataNode } from "../../../../Types/DataModelTypes";
import { InitedDataNode } from "../Reducers/DM_ModelReducer";

export class NodeManager {
    initNode(node: IDataNode) {
        if (!node.coords || !node.size || !node.borders) throw new Error("Nothing to init!");
        const [x, y] = node.coords
        const { w, h } = node.size
        const [ox, oy] = [w + x, h + y]
        const borders = node.borders
        // console.log('initNode', node)
        const updatedBorders = borders.map(b => {

            const borderWidth = b.state === 'rama' ? 10 : 6
            const BC: Record<ISides, CoordsTuple> = {
                top: [x, y, ox, y + borderWidth],
                left: [x, y, x + borderWidth, oy],
                bottom: [x, oy - borderWidth, ox, oy],
                right: [ox - borderWidth, y, ox, oy],
            }
            return { ...b, coords: BC[b.side] }
        })

        const Connections: Record<ISides, number[]> = {
            top: [y, x, ox],
            right: [ox, y, oy],
            left: [x, y, oy],
            bottom: [oy, x, ox]
        }
        const result = { ...node, mergePoints: Connections, coords: [x, y, ox, oy], borders: updatedBorders } as InitedDataNode
        // console.log('result', result)
        return result


    }
}