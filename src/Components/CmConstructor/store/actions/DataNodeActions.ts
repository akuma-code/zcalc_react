import { NotNullOBJ } from "../../../../Types/CalcModuleTypes";
import { IDataNode } from "../../../../Types/DataModelTypes";
import { NodeActionsType } from "../../../../hooks/useViewNode";
import { NODE_ACTION } from "../reducers/NodeReducer";

export class DataNodeActions {
    data: IDataNode
    actions: Record<NodeActionsType, NODE_ACTION> | NotNullOBJ
    constructor(node: IDataNode) {
        this.data = node
        this.actions = {}
    }

    use(action: NODE_ACTION) {
        this.actions = ({ ...this.actions, [action.type]: action })
    }
}