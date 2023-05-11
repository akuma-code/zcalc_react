import { IDataBorder } from "../../../../Types/DataModelTypes";
import { BorderDescEnum } from "../../../../Types/Enums";
import { useUtils } from "../../../../hooks/useUtils";
import { BORDER_ACTION_TYPES, BorderAction } from "../ReducerTypes";
const _ID = useUtils.stringID

export const initBorderState: IDataBorder = {
    id: _ID(),
    state: 'rama',
    desc: BorderDescEnum.rama
}

export const BorderReducer = (state: typeof initBorderState, action: BorderAction) => {
    switch (action.type) {
        case BORDER_ACTION_TYPES.CHANGE_STATE:
            return { ...state, side: action.payload.side, newState: action.payload.newState }
        default: return state
    }
}