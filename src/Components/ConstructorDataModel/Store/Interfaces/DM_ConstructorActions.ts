import { Size } from "../../../../Models/CalcModels/Size"
import { NotNullOBJ } from "../../../../Types/CalcModuleTypes"
import { CoordsTuple, IDataBorder, IDataModel, IDataNode } from "../../../../Types/DataModelTypes"

export enum DMC_ACTION {
    CREATE = 'createModel',
    DELETE = 'deleteModel',
    SELECT_ITEM = 'selectItem',
    UPDATE = 'update',
    SELECT_NODE = 'selectNode',
    SELECT_BORDER = 'selectBorder',

}
export interface DMC_Action_Create {
    type: DMC_ACTION.CREATE
    payload: { w: number, h: number, x: number, y: number }
}
export interface DMC_Action_Delete {
    type: DMC_ACTION.DELETE
    payload: { id: string }
}
export interface DMC_Action_SelectItem {
    type: DMC_ACTION.SELECT_ITEM
    payload: {
        id?: string
        model_id?: string
        type?: 'node' | 'border'
        item?: IDataNode | IDataBorder
    }
}
export interface DMC_Action_SelectNode {
    type: DMC_ACTION.SELECT_NODE
    payload: { node: IDataNode, node_id: string, variant: 'node' | 'border' | 'none' }
}
export interface DMC_Action_SelectBorder {
    type: DMC_ACTION.SELECT_BORDER
    payload: { border: IDataBorder, border_id: string, variant: 'node' | 'border' | 'none' }
}
export interface DMC_Action_Update {
    type: DMC_ACTION.UPDATE,
    payload: { nodes: IDataNode[], size: Size, coords: CoordsTuple, model_id: string }
}


export type DMC_Actions =
    | DMC_Action_Create
    | DMC_Action_Delete
    | DMC_Action_SelectItem
    | DMC_Action_SelectNode
    | DMC_Action_SelectBorder
    | DMC_Action_Update