import { ISides } from "../../../../Types/CalcModuleTypes"
import { CoordsTuple, IDataNode } from "../../../../Types/DataModelTypes"
import { DIRECTION } from "../../../../Types/Enums"

type ACTION_Node_CONSUME = (node_main: IDataNode, node_consume?: typeof node_main) => IDataNode
type ACTION_Node_DEVIDE = (node_main: IDataNode) => readonly [IDataNode, IDataNode]
type ACTION_Node_CLONE = (node_main: IDataNode) => IDataNode
type ACTION_Node_Coords = (node_main: IDataNode) => { side: ISides, coords: CoordsTuple }
type ACTION_Node_CoordsStr = (node_main: IDataNode) => { side: ISides, coords: string }

export enum NODE_ACTION {
    CONSUME = 'consume',
    DEVIDE = 'devide',
    CLONE = 'clone',
    REMOVE = 'remove',
    SET_PARAMS = 'setParams'
}

type Action_NodeDevide = {
    type: NODE_ACTION.DEVIDE
    payload: { node_main: IDataNode, dir: DIRECTION }
}

export type NODE_ACTIONS_LIST = |
    Action_NodeDevide