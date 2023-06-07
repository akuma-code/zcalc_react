import { Size } from "../../../../Models/CalcModels/Size";
import { ISideStateValues, ISides } from "../../../../Types/CalcModuleTypes";
import { CoordsEnum, CoordsTuple, IDataNode } from "../../../../Types/DataModelTypes";
import { InitedDataNode } from "../Reducers/DM_ModelReducer";
type Inew_coords = {
    nx?: number
    ny?: number
    nox?: number
    noy?: number
}
export class NodeManager {
    static initNode(node: IDataNode) {
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
            top: [x, y, ox, y],
            right: [ox, y, ox, oy],
            left: [x, y, x, oy],
            bottom: [x, oy, ox, oy]
        }
        const result = { ...node, mergePoints: Connections, coords: [x, y, ox, oy], borders: updatedBorders } as InitedDataNode
        // console.log('result', result)
        return result


    }

    static changeCoords(node: IDataNode, new_coords: Inew_coords) {
        const { nx = node.coords![0], nox = node.coords![2], noy = node.coords![3], ny = node.coords![1] } = new_coords
        const [nw, nh] = [nox - nx, noy - ny]
        const updated: IDataNode = { ...node, size: { w: nw, h: nh }, coords: [nx, ny, nox, noy] }
        return this.initNode(updated)
    }

    static resizeNode(node: IDataNode, new_size: Size) {
        const [nx, ny, nox, noy] = node.coords!
        const { w, h } = node.size!
        const [NW, NH] = [new_size.w = w, new_size.h = h]
        const [offX, offY] = [NW - w, NH - h]
        return { ...node, size: new Size(w + offX, h + offY), coords: [nx, ny, nox + offX, noy + offY] }
    }

    static resizeNode2(node: IDataNode, new_size: Size) {
        const AN = new ActionNode(node)
        return AN.resize(new_size)
    }
}

export class ActionNode {
    node: IDataNode
    constructor(node: IDataNode) {
        this.node = node
        this.updateCoords()
    }

    updateCoords() {
        if (!this.node.coords || !this.node.size || !this.node.borders) throw new Error("Nothing to init!");
        const [x, y] = this.node.coords
        const { w, h } = this.node.size
        const [ox, oy] = [w + x, h + y]
        const borders = this.node.borders

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

        const MergeCoords: Record<ISides, number[]> = {
            top: [y, x, ox],
            right: [ox, y, oy],
            left: [x, y, oy],
            bottom: [oy, x, ox]
        }
        const result = { ...this.node, mergePoints: MergeCoords, coords: [x, y, ox, oy], borders: updatedBorders } as InitedDataNode
        this.node = result
        console.log('actionNode: ', result)
        return this.node
    }

    resize(new_size: Size) {

        const prevState = {
            x: this.node.coords![CoordsEnum.X],
            y: this.node.coords![CoordsEnum.Y],
            ox: this.node.coords![CoordsEnum.OX],
            oy: this.node.coords![CoordsEnum.OY],
            w: this.node.size!.w,
            h: this.node.size!.h,
        }

        const offset = { offX: new_size.w - prevState.w, offY: new_size.h - prevState.h }
        const new_coords: CoordsTuple = [
            prevState.x,
            prevState.y,
            prevState.ox + offset.offX,
            prevState.oy + offset.offY,
        ]

        this.node.size = new_size
        this.node.coords = new_coords
        this.updateCoords()
        return this.node

    }
}