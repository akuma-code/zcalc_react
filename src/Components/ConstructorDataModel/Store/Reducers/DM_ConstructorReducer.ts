import { NodeCreator } from "../../../../Models/CalcModels/BorderFactory";
import { NotNullOBJ } from "../../../../Types/CalcModuleTypes";
import { IDataBorder, IDataModel, IDataNode } from "../../../../Types/DataModelTypes";
import { _log } from "../../../../hooks/useUtils";
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";
import { DMC_ACTION, DMC_Actions } from "../actions/DM_ConstructorActions";

export type DMC_Data = {
    modelGroup: IDataModel[] | []
    selectedItem: IDataModel | IDataNode | IDataBorder | NotNullOBJ
}




export function DM_ConstructorReducer(state: DMC_Data, action: DMC_Actions) {
    switch (action.type) {
        case DMC_ACTION.CREATE:
            if (state.modelGroup.length >= 1) return state

            const { w, h, x, y } = action.payload
            const defaultNode = NodeCreator('fix', w, h, x, y)
            const model: IDataModel = {
                id: _ID(),
                size: { w, h },
                params: { type: 'win' },
                nodes: [defaultNode],
            }
            return {
                ...state,
                modelGroup: [model]
            }


        case DMC_ACTION.DELETE:
            const model_id = action.payload.id

            return ({
                ...state,
                modelGroup: state.modelGroup.filter(m => m.id !== model_id)
            })


        case DMC_ACTION.SELECT:
            return ({
                ...state,
                selectedItem: action.payload.item
            })



        default: {
            _log("Executed default state")
            return state
        }
    }
}