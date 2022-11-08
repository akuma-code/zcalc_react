import { useUtils } from "../hooks/useUtils";
import { IHook_Model, IHOOK_Node } from "../Types/ModelsTypes";

const ID = useUtils.stringID

export class HookNode {
    id: string
    row_lvl: number
    row_id?: string
    constructor(lvl = 0, row_id: string = "") {
        this.id = ID()
        this.row_lvl = lvl
        this.row_id = row_id
    }
}

export class HookModel implements IHook_Model {
    id: string
    nodes: IHOOK_Node[]
    grid: { row_lvl: number, row_id: string, cols: number }[]
    constructor(nodes?: IHOOK_Node[]) {
        this.id = ID()
        this.nodes = nodes || [this.initNode()]
        this.grid = [this.initGrid()]
    }

    initNode() {
        const NN = new HookNode(0, .row_id)
        return NN
    }

    initGrid() {
        const initialCell = {
            id: ID(),
            row_lvl: 0,
            row_id: ID(),

        }
        return initialCell
    }

}