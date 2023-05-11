import { ISideStateValues, ISides } from "../../../../Types/CalcModuleTypes"
import { IDataNode } from "../../../../Types/DataModelTypes"
import { BORDER_ACTION_TYPES, ChangeBorderAction } from "../ReducerTypes"

export const changeBorderState = (side: ISides, prevState: Extract<ISideStateValues, 'rama' | 'imp'>): ChangeBorderAction => {

    const convert = {
        rama: 'imp' as Extract<ISideStateValues, 'rama' | 'imp'>,
        imp: 'rama' as Extract<ISideStateValues, 'rama' | 'imp'>,
    }
    return { type: BORDER_ACTION_TYPES.CHANGE_STATE, payload: { newState: convert[prevState], side } }
}






