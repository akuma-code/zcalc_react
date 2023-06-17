import { AddProp } from "../../../../Types/CalcModuleTypes";
import { IDataNode } from "../../../../Types/DataModelTypes";
import { _log } from "../../../../hooks/useUtils";
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";
import { InitedDataNode } from "../Reducers/DM_ModelReducer";
import { NodeManager } from "./NodeManager";
export type MinMaxCoords = {
    minX: number,
    minY: number,
    maxOX: number,
    maxOY: number
}





export class NodesGroupController {
    nodes: InitedDataNode[]
    constructor(initNodes: IDataNode[]) {
        this.nodes = initNodes.map(NodeManager.initNode)
        _log("nodes:", this.nodes)
    }

    get mapId() {
        return [...this.nodes].map(n => n.id)
    }


    hasImpost(impost_id: string) {
        const hasImp = (node: InitedDataNode) => node.borders.map(b => b.id).includes(impost_id)
        const filtered = [...this.nodes].find(hasImp) || null
        _log("filtered: ", filtered)
        return filtered
    }
    getSelected(impost_id_pool: string[]) {
        const selected = impost_id_pool.map(this.hasImpost)
        console.log('selected: ', selected)
        return selected
    }
    // insertNodes(...args: InitedDataNode[]) {
    //     this.nodes.push(...args)
    //     return this.nodes
    // }

    ejectNodes(...args: InitedDataNode['id'][]) {
        this.nodes.filter(n => !args.includes(n.id))
        return this.nodes
    }


    spliceNodes(removeIdList: string | string[], ...new_nodes: InitedDataNode[]): InitedDataNode[] {
        const id_pool = (Array.isArray(removeIdList)) ? removeIdList : [removeIdList]
        const rest = this.ejectNodes(...id_pool)

        this.nodes = [...rest, ...new_nodes]
        return this.nodes
    }

    findMinMaxCoords(nodes = this.nodes) {
        const MinMaxCoords = nodes.reduce((minmax, node) => {
            const [x, y, ox, oy] = node.coords
            const minX = minmax.minX ? minmax.minX <= x ? minmax.minX : x : x
            const minY = minmax.minY ? minmax.minY <= y ? minmax.minY : y : y
            const maxOX = minmax.maxOX ? minmax.maxOX >= ox ? minmax.maxOX : ox : ox
            const maxOY = minmax.maxOY ? minmax.maxOY >= oy ? minmax.maxOY : oy : oy
            return { ...minmax, minX, minY, maxOX, maxOY }
        }, {} as MinMaxCoords)
        return MinMaxCoords

    }
}

