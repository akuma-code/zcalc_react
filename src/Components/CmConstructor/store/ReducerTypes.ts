import { Size } from "../../../Models/CalcModels/Size"
import { ISideStateValues, ISides } from "../../../Types/CalcModuleTypes"
import { CoordsTuple, IDataBorder, IDataModel } from "../../../Types/DataModelTypes"

export enum BORDER_ACTION_TYPES {
    CHANGE_STATE = 'changeState',
    CONVERT_TO = 'convertTo'
}
export type NodeActionsType = |
    'join' |
    'devide' |
    'clone' |
    'remove' |
    'changeType' |
    'changeSize' |
    'changeCoords' |
    'consume'
export enum NODE_ACTIONS_Enum {
    CONSUME = 'consume',
    DEVIDE = 'devide',
    CLONE = 'clone',
    REMOVE = 'remove',
    SET_PARAMS = 'setParams'
}
export type ModelActionsType = |
    'addImpost' |
    'removeImpost' |
    'connectToModel' |
    'changeSize' |
    'changeCoords' |
    'changeParams'


export enum Constructor_Actions_Types {
    ADD_MODEL = 'addModel',
    REMOVE_MODEL = 'remove',
    CHANGE_INPUT = 'changeInput',
    SUBMIT = 'onSubmitFn'
}
export interface ChangeBorderAction {
    type: BORDER_ACTION_TYPES.CHANGE_STATE
    payload: { newState: Extract<ISideStateValues, 'rama' | 'imp'>, side: ISides }
}

export interface ConvertBorderAction {
    type: BORDER_ACTION_TYPES.CONVERT_TO
    payload: { newState: ISideStateValues, side: ISides }
}

export type BorderAction = |
    ChangeBorderAction |
    ConvertBorderAction


export interface ConstAddModelAction {
    type: Constructor_Actions_Types.ADD_MODEL,
    payload: { size: Size, coords: CoordsTuple }
}

export interface ConstrRemoveModelAction {
    type: Constructor_Actions_Types.REMOVE_MODEL,
    payload: { id: string }
}
export interface ConstrChangeInputAction {
    type: Constructor_Actions_Types.CHANGE_INPUT,
    payload: { field: keyof IDataModel, value: any }
}
export interface ConstrSubmitAction {
    type: Constructor_Actions_Types.SUBMIT,
    payload: IDataModel
}



export type Constructor_Actions = |
    ConstAddModelAction |
    ConstrChangeInputAction |
    ConstrRemoveModelAction |
    ConstrSubmitAction