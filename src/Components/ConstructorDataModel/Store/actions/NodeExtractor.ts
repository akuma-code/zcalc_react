import { AddProp } from "../../../../Types/CalcModuleTypes";
import { IDataNode } from "../../../../Types/DataModelTypes";
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";
import { InitedDataNode } from "../Reducers/DM_ModelReducer";
import { NodeManager } from "./NodeManager";




type NodeWithCb = AddProp<Required<IDataNode>, { [name: string]: Function }>

export class NodeExtractor {
    nodes: InitedDataNode[]
    constructor(initNodes: IDataNode[]) {
        this.nodes = initNodes.map(NodeManager.initNode)
    }

    hasImpost(impost_id: string) {
        return this.nodes.filter(n => n.borders?.map(b => b.id).includes(impost_id))
    }

    get mapId() {
        return this.nodes.map(n => n.id)
    }


}

