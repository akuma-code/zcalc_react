import { DModelCreator, NodeCreator } from "../../../../Models/CalcModels/BorderFactory";
import { NotNullOBJ } from "../../../../Types/CalcModuleTypes";
import { IDataBorder, IDataModel, IDataNode } from "../../../../Types/DataModelTypes";
import { _log } from "../../../../hooks/useUtils";
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";
import { DMC_ACTION, DMC_Actions } from "../actions/DM_ConstructorActions";

export type DMC_Data = {
    modelGroup: IDataModel[] | []
    selectedItem?: IDataModel | IDataNode | IDataBorder | NotNullOBJ
}




export function DM_ConstructorReducer(state: DMC_Data, action: DMC_Actions) {
    switch (action.type) {
        case DMC_ACTION.CREATE:

            const { w, h, x, y } = action.payload
            let model = DModelCreator(w, h, x, y)

            // if (state.modelGroup.length >= 1) {
            //     const gr = state.modelGroup
            //     const offset = gr.map(m => m.coords).reduce((sum, curr) => {
            //         const [x, y, ox, oy] = curr!
            //         sum = { ...sum, ox: x, oy: sum.oy + oy }
            //         return sum
            //     }, { ox: 0, oy: 0 })
            //     const offsetX = gr[gr.length - 1].size.w + gr[gr.length - 1].coords![0]

            //     return {
            //         ...state,
            //         modelGroup: [...state.modelGroup, model]
            //     }
            // }
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


