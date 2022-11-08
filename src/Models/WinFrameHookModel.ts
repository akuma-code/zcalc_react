import { useUtils } from "../hooks/useUtils";
import { IHook_Model, IHOOK_Node } from "../Types/ModelsTypes";

const ID = useUtils.stringID

export class HookNode {
    id: string
    row_lvl: number
    row_id?: string
    constructor(lvl = 0) {
        this.id = ID()
        this.row_lvl = lvl
    }
}

export class HookModel implements IHook_Model {
    id: string
    nodes: IHOOK_Node[]
    constructor(nodes?: IHOOK_Node[]) {
        this.id = ID()
        this.nodes = nodes || [this.initNode()]
    }

    initNode() {
        const NN = new HookNode()
        return NN
    }

}