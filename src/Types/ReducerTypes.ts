export interface ConstructState {
    models: any[]
}

export enum ActionsType {
    ADD_NODE = 'ADD_NODE',
    REM_NODE = 'REM-NODE',
    ADD_ROW = 'ADD_ROW',
    REM_ROW = 'REM_ROW'
}

export interface AddNodeAction {
    type: ActionsType.ADD_NODE,
    payload: any[]
}
export interface RemNodeAction {
    type: ActionsType.REM_NODE
    payload: any
}
export interface AddRowAction {
    type: ActionsType.ADD_ROW,
    payload: any[]
}
export interface RemRowAction {
    type: ActionsType.REM_ROW,
    payload: any
}

export type ModelActions = AddNodeAction | RemNodeAction | AddRowAction | RemRowAction