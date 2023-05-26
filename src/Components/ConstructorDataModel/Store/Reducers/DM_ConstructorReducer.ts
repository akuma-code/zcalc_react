import { DModelCreator, NodeCreator } from "../../DM_Creators";
import { NotNullOBJ } from "../../../../Types/CalcModuleTypes";
import { IDataBorder, IDataModel, IDataNode } from "../../../../Types/DataModelTypes";
import { _log } from "../../../../hooks/useUtils";
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";
import { DMC_ACTION, DMC_Actions } from "../Interfaces/DM_ConstructorActions";

export type DMC_Data = {
    modelGroup: IDataModel[] | []
    selectedItem?: IDataModel | IDataNode | IDataBorder | NotNullOBJ
    selected?: {
        model_id?: string,
        node_id?: string,
        border_id?: string,
        variant?: 'node' | 'border' | 'none' | undefined
    }
}




export function DM_ConstructorReducer(state: DMC_Data, action: DMC_Actions) {
    switch (action.type) {
        case DMC_ACTION.CREATE:
            const { w, h, x, y } = action.payload
            let model = DModelCreator(w, h, x, y)
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

        case DMC_ACTION.SELECT_ITEM: {
            const { item, type, model_id } = action.payload
            const param = `${type}_id`
            const SEL_MODEL = state.modelGroup.find(m => m.id === model_id)
            const SEL_NODE = SEL_MODEL?.nodes.find(n => n.id === item!.id)

            return ({
                ...state,
                selected: {
                    ...state.selected, [param]: item!.id, model_id
                },
                selectedItem: item
            })
        }
        case DMC_ACTION.SELECT_NODE: {
            const { node, variant } = action.payload

            return {
                ...state,
                selected: { ...state.selected, node_id: node.id, variant },
                selectedItem: node
            }
        }
        case DMC_ACTION.SELECT_BORDER: {
            const { border, variant } = action.payload

            return {
                ...state,
                selected: { ...state.selected, border_id: border.id, variant },
                selectedItem: border
            }
        }

        case DMC_ACTION.UPDATE:
            {
                const { nodes, coords, size, model_id } = action.payload
                return {
                    ...state,
                    modelGroup: state.modelGroup.map(m => m.id === model_id ? { ...m, nodes, coords, size } : m)
                }
            }


        default: {
            _log("Executed default state")
            return state
        }
    }
}


