import { NotNullOBJ } from "../../../../Types/CalcModuleTypes"
import { CoordsTuple, IDataBorder, IDataModel, IDataNode } from "../../../../Types/DataModelTypes"

export enum DMC_ACTION {
    CREATE = 'createModel',
    DELETE = 'deleteModel',
    SELECT = 'selectItem'

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
    payload: { item: IDataModel | IDataNode | IDataBorder | NotNullOBJ }
}




export type DMC_Actions =
    | DMC_Action_Create
    | DMC_Action_Delete
    | DMC_Action_Select