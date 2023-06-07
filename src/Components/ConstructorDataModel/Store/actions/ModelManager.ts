import BF from "../../../../Models/CalcModels/BorderFactory";
import { Size } from "../../../../Models/CalcModels/Size"
import { ISides } from "../../../../Types/CalcModuleTypes";
import { CoordsEnum, CoordsTuple, IDataBorder, IDataModel, IDataNode, IResizeDataModel } from "../../../../Types/DataModelTypes"
import { ISide } from "../../../../Types/FrameTypes";
import { _log } from "../../../../hooks/useUtils";
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";
import { InitedDataNode } from "../Reducers/DM_ModelReducer";
import { initModelNodes } from "./DM_Creators";
import { ActionNode, NodeManager } from "./NodeManager";
import { mFn_100 } from "./mathFn";
export type InitedDataModel = Required<IDataModel>
class DataModelManager {

    CreateResizeModel(...args: number[]) {
        const [w, h, x = 0, y = 0, ...rest] = args
        const [ox, oy] = [w + x, h + y]
        const new_basenode: IDataNode = {
            id: _ID(),
            coords: [x, y, ox, oy],
            size: new Size(w, h),
            borders: BF.load('fix'),
        }
        const new_model: IResizeDataModel = {
            id: _ID(),
            nodes: [],
            baseNode: NodeManager.initNode(new_basenode)
        }
        return new_model
    }
    ResizeModel(model: IResizeDataModel, new_size: Size): IResizeDataModel {
        const { baseNode, nodes } = model
        const old_size = baseNode.size!
        const { rX, rY } = getRateOffset(old_size, new_size)

        const applyScaleFn = applyScale(rX, rY)
        const resize_basenode_props = getBasenodeParams(baseNode, new_size)
        const resized_nodes = upscale_nodes(nodes, applyScaleFn)
        const new_basenode = { ...baseNode, ...resize_basenode_props }

        const resized_model: IResizeDataModel = {
            ...model,
            baseNode: NodeManager.initNode(new_basenode),
            nodes: resized_nodes.map(NodeManager.initNode)
        }


        const MinMax = getMinMaxCoords(new_basenode)
        return DataModelManager.AdjustNodesSize(resized_model, MinMax)
    }


    static AdjustNodesSize(resized_model: IResizeDataModel, minmax: ReturnType<typeof getMinMaxCoords>) {
        const { min, max } = minmax
        const applyMinMaxToNode = <T extends IDataNode>(node: T) => {
            const new_coords = node.coords!.reduce((new_coords, c, idx) => {
                let tmp = 0
                if (idx < 2) tmp = c <= min[idx] ? max[idx] : c
                if (idx > 1) tmp = c >= min[idx] ? max[idx] : c
                new_coords.push(tmp)

                return new_coords
            }, [] as number[])
            const [x, y, ox, oy] = new_coords

            const result = {
                ...node,
                coords: new_coords,
                size: new Size(ox - x, oy - y)
            } as IDataNode

            return result
        }

        const adjusted = resized_model.nodes.map(applyMinMaxToNode)
        resized_model = {
            ...resized_model,
            nodes: adjusted.map(NodeManager.initNode)
        }

        return resized_model
    }

}

function applyScale<T extends number[]>(rx: number, ry: number) {

    const [RX, RY] = mFn_100('ceil', rx, ry)
    return (arr: T) => arr.map((c, idx) => idx % 2 === 0 ? c * RX : c * RY)
}

const getBasenodeParams = (baseNode: IDataNode, new_size: Size) => {
    const [x, y] = baseNode.coords!
    const [ox, oy] = [x + new_size.w, y + new_size.h]
    const ns = new Size(new_size.w, new_size.h)
    return { size: ns, coords: [x, y, ox, oy] as CoordsTuple }
}

const upscale_nodes = (nodes: IDataNode[], scaleFn: (arr: number[]) => number[]) => {
    const upscale_node_params = (coords: CoordsTuple) => {
        // const coords = node.coords! as unknown as number[]
        const scaled_coords = scaleFn(coords as unknown as number[]) as unknown as CoordsTuple
        const [sx, sy, sox, soy] = scaled_coords
        const scaled_size = new Size(sox - sx, soy - sy)
        return { scaled_coords, scaled_size }

    }
    const resized: IDataNode[] = nodes.map((n) => {
        const { scaled_coords, scaled_size } = upscale_node_params(n.coords!)
        return { ...n, coords: scaled_coords, size: scaled_size }
    })
    return resized
}

const getRateOffset = (old_size: Size, new_size: typeof old_size) => {
    const { w: ow, h: oh } = old_size
    const { w: nw, h: nh } = new_size
    const [rX, rY] = [nw / ow, nh / oh]
    const [offX, offY] = [nw - ow, nh - oh]
    return { rX, rY, offX, offY }
}


function getMinMaxCoords(resized_base: IDataNode, delta = 10) {
    const [maxX, maxY, maxOX, maxOY] = resized_base.coords!
    const [minX, minY, minOX, minOY] = [
        maxX + delta,
        maxY + delta,
        maxOX - delta,
        maxOY - delta,
    ]
    const minmax = {
        max: [maxX, maxY, maxOX, maxOY],
        min: [minX, minY, minOX, minOY]
    }
    return minmax
}
const getBorder = (side: ISides, borders: IDataBorder[]) => borders.find(b => b.side === side)
function findRightBotNodes(data_model: Required<IDataModel>) {
    const { nodes, coords: m_coords } = data_model
    if (!m_coords) throw new Error("Coords Error");



    const SideNodes = { right: [] as IDataNode[], bot: [] as IDataNode[] }
    nodes.forEach(n => {
        const rn = getBorder('right', n.borders!)
        const bn = getBorder('bottom', n.borders!)
        if (rn?.state === 'rama') SideNodes.right.push(n)
        if (bn?.state === 'rama') SideNodes.bot.push(n)

    })
    return SideNodes
}





const DataModelController = new DataModelManager()
export default DataModelController
