import { DModelCreator, NodeCreator } from "../actions/DM_Creators";
import { NotNullOBJ } from "../../../../Types/CalcModuleTypes";
import { IDataBorder, IDataModel, IDataNode, IResizeDataModel } from "../../../../Types/DataModelTypes";
import { _log } from "../../../../hooks/useUtils";
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";
import { EDMC_ACTION, DMC_Actions_List } from "../Interfaces/DM_ConstructorActions";
import { DevideSVGNode, resizeModel } from "../actions/ModelGroupActions";
import { DIRECTION, OPPOSITEenum } from "../../../../Types/Enums";
import DMContr from "../actions/ModelManager";
import { NodeManager } from "../actions/NodeManager";
import DataModelController from "../actions/ModelManager";
import { InitedDataNode } from "./DM_ModelReducer";

export type DMC_Data = {
    modelGroup: IResizeDataModel[] | []
    // resizeModelGroup?: IResizeDataModel[] | []
    selectedItem?: IDataModel | IDataNode | IDataBorder | NotNullOBJ
    selectedModel?: IResizeDataModel | null
    selected?: {
        model_id?: string,
        node_id?: string,
        border_id?: string,
        variant?: 'node' | 'border' | 'none' | undefined
        highLighted?: string[]
    }

}




export function DM_ConstructorReducer(state: DMC_Data, action: DMC_Actions_List) {

    const GET_CURRENT_MODEL = (model_id: string) => state.modelGroup.find(m => m.id === model_id)

    switch (action.type) {
        case EDMC_ACTION.CREATE:
            const { w, h, x, y } = action.payload
            // let model = DModelCreator(w, h, x, y)
            // model = { ...model, nodes: model.nodes.map(NodeManager.initNode) }
            let resizeModel = DataModelController.CreateResizeModel(w, h, x, y)
            return {
                ...state,
                modelGroup: [resizeModel],
                // resizeModelGroup: [resizeModel]
            }


        case EDMC_ACTION.DELETE: {
            const model_id = action.payload.id

            return ({
                ...state,
                modelGroup: state.modelGroup.filter(m => m.id !== model_id)
            })
        }

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
                selected: { ...state.selected, node_id: node.id, variant, border_id: "", highLighted: [] },
                selectedItem: node
            }
        }
        case EDMC_ACTION.SELECT_BORDER: {
            const { border, variant } = action.payload
            const current_model = state.modelGroup.find(m => m.nodes.some(n => n.borders?.some(b => b.id === border.id)))
            const current_node = current_model?.nodes.find(n => n.borders?.some(b => b.id === border.id))!
            const restNodes = current_model?.nodes.filter(n => !n.borders?.some(b => b.id === border.id))
                .map(NodeManager.initNode) || []
            // _log("current: ", current_node)
            // _log("rest: ", restNodes)
            const selIDS = [] as string[]

            const current = {
                border_id: border.id,
                state: border.state,
                node_id: current_node.id,
                mp: NodeManager.initNode(current_node).mergePoints[border.side],
                side: border.side,
                oppSide: OPPOSITEenum[border.side]
            }
            if (border.state === 'rama') {
                // selIDS.length = 0
                const sameStateNodes = restNodes.filter(n => n.borders.some(b => b.side === border.side && b.state === 'rama'))
                const bdrs = sameStateNodes.map(n => n.borders.find(b => b.side === border.side)!)
                const bdrsIDS = bdrs.map(b => b.id)
                selIDS.push(border.id, ...bdrsIDS)
            }


            if (border.state === 'imp') {
                selIDS.length = 0
                const selectedImpostIds = getSelectedImpostIDs(restNodes, current_node, border)
                selIDS.push(border.id, ...selectedImpostIds)
            }
            return {
                ...state,
                selected: { ...state.selected, border_id: border.id, variant, highLighted: selIDS },
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
                const CURRENT_MODEL = GET_CURRENT_MODEL(model_id)
                if (!CURRENT_MODEL) {
                    _log("Model is not exist!")
                    return state
                }
                const selectedNode = CURRENT_MODEL.nodes.find(n => n.id === node_id)
                if (!selectedNode) {
                    _log("Node not finded!")
                    return state
                }
                const [F, S] = DevideSVGNode(selectedNode, dir)
                const updatedNodes = [...CURRENT_MODEL.nodes].filter(n => n.id !== node_id)
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
                const updated = DMContr.ResizeModel(selectedModel, new_size)

                // console.log('resized_model: ', updated)
                return {
                    ...state,
                    modelGroup: state.modelGroup.map(m => m.id === model_id ? updated : m)
                }
            }

        default: {
            _log("Executed default state")
            return state
        }
    }
}


function getSelectedImpostIDs(restNodes: InitedDataNode[], current_node: IDataNode, border: IDataBorder) {
    return restNodes.reduce((IDs: string[], node) => {
        const curr_mp = NodeManager.initNode(current_node).mergePoints[border.side];
        const current = {
            border_id: border.id,
            state: border.state,
            node_id: current_node.id,
            mp: curr_mp,
            side: border.side,
            oppSide: OPPOSITEenum[border.side]
        };
        const [startX, startY, endX, endY] = current.mp;
        const [X, Y, OX, OY] = node.coords;


        if (startX === OX || endX === X) {
            if (Y >= startY && OY <= endY) {
                const add = node.borders.find(b => b.side === current.oppSide && b.state === 'imp');
                if (!add)
                    return IDs;
                IDs.push(add.id);
                return IDs;
            }
        }
        if (startY === OY || endY === Y) {
            if (X >= startX && OX <= endX) {
                const add = node.borders.find(b => b.side === current.oppSide && b.state === 'imp');
                if (!add)
                    return IDs;
                IDs.push(add.id);
                return IDs;
            }
        }



        return IDs;
    }, []);
}

function isEqualArray<T extends number[]>(arr1: T, arr2: typeof arr1) {
    if (arr2.length !== arr1.length) {
        _log("Different arrays")
        return false
    }
    // _log(arr1, arr2)
    if (arr1.every((c, idx) => c === arr2[idx])) return true
    else return false

}