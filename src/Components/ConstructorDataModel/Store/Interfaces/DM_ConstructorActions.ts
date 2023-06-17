import { Size } from "../../../../Models/CalcModels/Size"
import { NotNullOBJ } from "../../../../Types/CalcModuleTypes"
import { CoordsTuple, IDataBorder, IDataModel, IDataNode, IResizeDataModel } from "../../../../Types/DataModelTypes"
import { DIRECTION } from "../../../../Types/Enums"

export enum EDMC_ACTION {
    CREATE = 'createModel',
    DELETE = 'deleteModel',
    SELECT_MODEL = 'selectModel',
    UPDATE = 'update',
    SELECT_NODE = 'selectNode',
    SELECT_BORDER = 'selectBorder',
    NODE_DEVIDE = 'nodeDevideVert',
    NODE_DEVIDE_HOR = 'nodeDevideHOR',
    RESIZE_MODEL = 'resizeModel',
    DELETE_IMPOST = 'delete_impost'

}
export interface DMC_Action_Create {
    type: EDMC_ACTION.CREATE
    payload: { w: number, h: number, x: number, y: number }
}
export interface DMC_Action_Delete {
    type: EDMC_ACTION.DELETE
    payload: { id: string }
}
export interface DMC_Action_SelectModel {
    type: EDMC_ACTION.SELECT_MODEL
    payload: { id?: string, model?: IResizeDataModel }
}
export interface DMC_Action_SelectNode {
    type: EDMC_ACTION.SELECT_NODE
    payload: { node: IDataNode, node_id: string, variant: 'node' | 'border' | 'none' }
}
export interface DMC_Action_SelectBorder {
    type: EDMC_ACTION.SELECT_BORDER
    payload: { border: IDataBorder, border_id: string, variant: 'node' | 'border' | 'none' }
}
export interface DMC_Action_Update {
    type: EDMC_ACTION.UPDATE,
    payload: { nodes: IDataNode[], size: Size, coords: CoordsTuple, model_id: string }
}
export interface DMC_Action_Node_Devide {
    type: EDMC_ACTION.NODE_DEVIDE,
    payload: { model_id: string, node_id: string, dir: DIRECTION.VERT | DIRECTION.HOR }
}
export interface DMC_Action_Resize_Model {
    type: EDMC_ACTION.RESIZE_MODEL,
    payload: { model_id: string, new_size: Size }
}
export interface DMC_Action_Delete_Impost {
    type: EDMC_ACTION.DELETE_IMPOST,

}


export type DMC_Actions_List =
    | DMC_Action_Create
    | DMC_Action_Delete
    | DMC_Action_SelectModel
    | DMC_Action_SelectNode
    | DMC_Action_SelectBorder
    | DMC_Action_Update
    | DMC_Action_Node_Devide
    | DMC_Action_Resize_Model
    | DMC_Action_Delete_Impost