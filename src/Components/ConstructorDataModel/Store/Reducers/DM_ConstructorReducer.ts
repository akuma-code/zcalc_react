import { DModelCreator, NodeCreator, NodeSvgCreator } from "../actions/DM_Creators";
import { ISideStateValues, ISides, NotNullOBJ } from "../../../../Types/CalcModuleTypes";
import { CoordsTuple, IDataBorder, IDataModel, IDataNode, IResizeDataModel } from "../../../../Types/DataModelTypes";
import { _log } from "../../../../hooks/useUtils";
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";
import { EDMC_ACTION, DMC_Actions_List } from "../Interfaces/DM_ConstructorActions";
import { DevideSVGNode, _compareItem, _nodeHasBorderId, _nodesHasImpost } from "../actions/ModelGroupActions";
import { DIRECTION, OPPOSITEenum } from "../../../../Types/Enums";
import DMContr from "../actions/ModelManager";
import { NodeManager } from "../actions/NodeManager";
import DataModelController from "../actions/ModelManager";
import { InitedDataNode } from "./DM_ModelReducer";
import { NodesGroupController } from "../actions/NodeExtractor";
import { Size } from "../../../../Models/CalcModels/Size";

export type DMC_Data = {
    modelGroup: IResizeDataModel[] | []
    // resizeModelGroup?: IResizeDataModel[] | []
    selectedNodes?: InitedDataNode[]
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



type CurrentSelectParams = {
    border_id: string
    state: ISideStateValues
    node_id: string
    mp: number[]
    side: ISides
    oppSide: ISides
}
export function DM_ConstructorReducer(state: DMC_Data, action: DMC_Actions_List) {

    const GET_CURRENT_MODEL = (model_id: string) => state.modelGroup.find(m => m.id === model_id)
    const CONTROLLED_NODES = (model_id: string) => new NodesGroupController(GET_CURRENT_MODEL(model_id)?.nodes!)
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
            const next = getNext(node as InitedDataNode,
                state.modelGroup.find(m => m.id === state.selected?.model_id)?.nodes.filter(n => n.id !== node.id) as InitedDataNode[] || [])

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

            const current: CurrentSelectParams = {
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
                const getNodes = (border_id: string) => [...current_model?.nodes!].filter(n => _nodeHasBorderId(n as InitedDataNode, border_id)).map(n => n.id)
                const [selNodes] = selIDS.map(getNodes)
                // console.log('selNodes', selNodes)
            }


            if (border.state === 'imp') {
                selIDS.length = 0
                const selectedImpostIds = getSelectedImpostIDs(restNodes, current)
                selIDS.push(...selectedImpostIds)
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
        case EDMC_ACTION.DELETE_IMPOST: {
            const current_model = GET_CURRENT_MODEL(state.selected?.model_id || "")
            const id_pool = state.selected?.highLighted
            if (!current_model || !id_pool) {
                _log("Model NOT FINDED!")
                return { ...state }
            }

            //*   model => get selected nodes, axis  */
            //*   [...nodes]=> first, second   */
            //*      */
            // const controller = new NodesGroupController(current_model.nodes)
            // controller.filterSelectedNodes(id_pool)
            // const { minX, minY, maxOX, maxOY } = controller.findMinMaxCoords()
            // const { w, h } = new Size(maxOX - minX, maxOY - minY)

            // const summaryNode = NodeManager.initNode(NodeSvgCreator('fix', [w, h], [minX, minY]))
            // // controller.spliceNodes(id_pool, summaryNode)
            // const new_nodes = controller.nodes.map(NodeManager.initNode)
            // // console.log('controller', controller)
            return {
                ...state,
                modelGroup: state.modelGroup.map(model => model.id === current_model.id ?
                    {
                        ...model,
                        // nodes: [...new_nodes, summaryNode]
                    } :
                    model)
            }
        }
        default: {
            _log("Executed default state")
            return state
        }
    }
}


function getSelectedImpostIDs(restNodes: InitedDataNode[], current: CurrentSelectParams) {

    restNodes.forEach(NodeManager.initNode)


    const IDLIST = restNodes.reduce((IDs: string[], node) => {

        const isEqualOppositeCoords = _compareItem(current.mp as unknown as CoordsTuple, isNextNode)
        // _log(`compare ${current.mp.join("-")} and ${node.coords.join("-")} => ${compareC(node.coords)}`)
        if (isEqualOppositeCoords(node.coords)) {
            const add = node.borders.find(b => b.side === current.oppSide);
            if (!add) return IDs;
            IDs.push(add.id, current.border_id);
            return IDs;
        }

        return IDs;
    }, []);

    return IDLIST
}

function getNext(target_node: InitedDataNode, model_nodes: typeof target_node[]) {

    const result = {} as { [K in ISides]?: InitedDataNode[] }

    const ss: ISides[] = ['top', 'right', 'left', 'bottom']
    ss.forEach(side => {
        const currAxis = (n: InitedDataNode) => findConnectionSide(n, target_node).axis === side
        const nodes = model_nodes.filter(currAxis)
        if (nodes.length >= 1) result[side] = nodes
    })
    return result



}

const findConnectionSide = (target: InitedDataNode, node: typeof target) => {
    const [X, Y, OX, OY] = target.coords
    const [x, y, ox, oy] = node.coords
    const result = { axis: "none" }
    //* менял наоборот... может и не то поменял
    if (OX === x) result.axis = "left" as ISides
    if (X === ox) result.axis = "right" as ISides
    if (Y === oy) result.axis = "bottom" as ISides
    if (OY === y) result.axis = "top" as ISides
    return result
}

export const getMergePoints = (node_coords: CoordsTuple) => {
    const [x, y, ox, oy] = node_coords
    const endpoints: Record<ISides, CoordsTuple> = {
        top: [x, y, ox, y],
        bottom: [x, oy, ox, oy],
        left: [x, y, x, oy],
        right: [ox, y, ox, oy],
    }
    return endpoints
}

export function isNextNode(base_coords: CoordsTuple, target_coords: CoordsTuple) {
    const [startX, startY, endX, endY] = base_coords
    const [X, Y, OX, OY] = target_coords


    if (startX === OX || endX === X) {
        if (Y >= startY && OY <= endY) return true

    }
    if (startY === OY || endY === Y) {
        if (OX <= endX && X >= startX) return true
    }
    return false
}