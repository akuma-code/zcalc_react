import { DModelCreator, NodeCreator } from "../actions/DM_Creators";
import { NotNullOBJ } from "../../../../Types/CalcModuleTypes";
import { IDataBorder, IDataModel, IDataNode } from "../../../../Types/DataModelTypes";
import { _log } from "../../../../hooks/useUtils";
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";
import { EDMC_ACTION, DMC_Actions_List } from "../Interfaces/DM_ConstructorActions";
import { DevideSVGNode, resizeModel } from "../actions/ModelGroupActions";
import { DIRECTION } from "../../../../Types/Enums";

export type DMC_Data = {
    modelGroup: IDataModel[] | []
    selectedItem?: IDataModel | IDataNode | IDataBorder | NotNullOBJ
    selectedModel?: IDataModel | null
    selected?: {
        model_id?: string,
        node_id?: string,
        border_id?: string,
        variant?: 'node' | 'border' | 'none' | undefined
    }
}




export function DM_ConstructorReducer(state: DMC_Data, action: DMC_Actions_List) {
    switch (action.type) {
        case EDMC_ACTION.CREATE:
            const { w, h, x, y } = action.payload
            let model = DModelCreator(w, h, x, y)
            return {
                ...state,
                modelGroup: [model]
            }


        case EDMC_ACTION.DELETE:
            const model_id = action.payload.id

            return ({
                ...state,
                modelGroup: state.modelGroup.filter(m => m.id !== model_id)
            })

        case EDMC_ACTION.SELECT_MODEL: {
            const { model, id } = action.payload
            if (!model) return state

            return ({
                ...state,
                selected: { ...state.selected, model_id: id },
                selectedModel: { ...state.selectedModel, ...model }
            })
        }
        case EDMC_ACTION.SELECT_NODE: {
            const { node, variant } = action.payload

            return {
                ...state,
                selected: { ...state.selected, node_id: node.id, variant, border_id: "" },
                selectedItem: node
            }
        }
        case EDMC_ACTION.SELECT_BORDER: {
            const { border, variant } = action.payload

            return {
                ...state,
                selected: { ...state.selected, border_id: border.id, variant },
                selectedItem: border
            }
        }

        case EDMC_ACTION.UPDATE:
            {
                const { nodes, coords, size, model_id } = action.payload
                return {
                    ...state,
                    modelGroup: state.modelGroup.map(m => m.id === model_id ? { ...m, nodes, coords, size } : m)
                }
            }
        case EDMC_ACTION.NODE_DEVIDE:
            {
                const { model_id, node_id, dir } = action.payload
                const selectedModel = state.modelGroup.find(m => m.id === model_id)
                if (!selectedModel) {
                    _log("Model is not exist!")
                    return state
                }
                const selectedNode = selectedModel.nodes.find(n => n.id === node_id)
                if (!selectedNode) {
                    _log("Node not finded!")
                    return state
                }
                const [F, S] = DevideSVGNode(selectedNode, dir)
                const updatedNodes = [...selectedModel.nodes].filter(n => n.id !== node_id)
                updatedNodes.push(F, S)
                // _log("Succesful!", updatedNodes)
                return {
                    ...state,
                    modelGroup: state.modelGroup.map(model => model.id === model_id ?
                        {
                            ...model,
                            nodes: updatedNodes
                        } :
                        model)
                }
            }
        case EDMC_ACTION.RESIZE_MODEL:
            {
                const { model_id, new_size } = action.payload
                const selectedModel = state.modelGroup.find(m => m.id === model_id)
                if (!selectedModel) {
                    _log("Model not found!")
                    return state
                }
                const updated = resizeModel(selectedModel, new_size)
                _log("model!")

                return {
                    ...state,
                    modelGroup: state.modelGroup.map(m => m.id === model_id ? { ...m, ...updated } : m)
                }
            }

        default: {
            _log("Executed default state")
            return state
        }
    }
}


