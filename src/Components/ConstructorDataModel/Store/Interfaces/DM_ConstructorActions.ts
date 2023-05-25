import { Size } from "../../../../Models/CalcModels/Size"
import { NotNullOBJ } from "../../../../Types/CalcModuleTypes"
import { CoordsTuple, IDataBorder, IDataModel, IDataNode } from "../../../../Types/DataModelTypes"

export enum DMC_ACTION {
    CREATE = 'createModel',
    DELETE = 'deleteModel',
    SELECT = 'selectItem',
    UPDATE = 'update'

}
export interface DMC_Action_Create {
    type: DMC_ACTION.CREATE
    payload: { w: number, h: number, x: number, y: number }
}
export interface DMC_Action_Delete {
    type: DMC_ACTION.DELETE
    payload: { id: string }
}
export interface DMC_Action_Select {
    type: DMC_ACTION.SELECT
    payload: {
        id?: string
        model_id?: string
        type?: 'node' | 'border'
        item?: IDataNode | IDataBorder
    }
}

export interface DMC_Action_Update {
    type: DMC_ACTION.UPDATE,
    payload: { nodes: IDataNode[], size: Size, coords: CoordsTuple, model_id: string }
}


export type DMC_Actions =
    | DMC_Action_Create
    | DMC_Action_Delete
    | DMC_Action_Select
    | DMC_Action_Update