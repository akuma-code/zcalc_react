import { IProfileSystem } from "../../../../CalcModule/GlassDelta";
import { Size } from "../../../../Models/CalcModels/Size";
import { ICoords, IProfileDelta, ISideStateValues, ISides, NotNullOBJ } from "../../../../Types/CalcModuleTypes";
import { IDataBorder, IDataModel, IDataNode, SideBorderProps } from "../../../../Types/DataModelTypes";
import { BorderDescEnum } from "../../../../Types/Enums";
import { useUtils } from "../../../../hooks/useUtils";
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";
import { Constructor_Actions, Constructor_Actions_Types } from "../ReducerTypes";



export type ConstructorData = {
    data_models: IDataModel[]
    current_model: IDataModel
    formData: {
        size: Size
        system: IProfileSystem,
        type: 'win' | 'door'

    }
}
export const initConstructorData: ConstructorData = {
    data_models: [],
    current_model: {} as IDataModel,
    formData: {
        size: new Size(8, 12),
        system: 'Proline',
        type: 'win'
    }
}
const defaultNode: IDataNode = {
    id: _ID(),
    // sideBorders: [
    //     { side: 'left', border: { id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] } },
    //     { side: 'top', border: { id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] } },
    //     { side: 'right', border: { id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] } },
    //     { side: 'bottom', border: { id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] } },
    // ],
    borders: [
        { side: 'left', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] },
        { side: 'top', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] },
        { side: 'right', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] },
        { side: 'bottom', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] },
    ],

}

const initModelState: IDataModel = {
    id: useUtils.stringID(),
    coords: [0, 0, 0, 0],
    nodes: [defaultNode],
    params: { system: 'Proline', type: 'win' },
    size: { w: 0, h: 0 }
}


export function ConstructorReducer(state: ConstructorData, action: Constructor_Actions) {

    switch (action.type) {
        case Constructor_Actions_Types.ADD_MODEL: {
            if (state.data_models.length >= 1) return state

            const { size, coords } = action.payload
            const [x, y] = coords
            const newCoords = setCoords([x, y], size)
            const model: IDataModel = {
                id: useUtils.stringID(),
                size: size,
                params: { type: 'win' },
                nodes: [defaultNode],
                coords: newCoords
            }

            return { ...state, data_models: [model] }
        }

        case Constructor_Actions_Types.REMOVE_MODEL: {
            return { ...state, data_models: state.data_models.filter(m => m.id !== action.payload.id) }
        }
        case Constructor_Actions_Types.CHANGE_INPUT: {
            return {
                ...state,
                formData: { ...state.formData, [action.payload.field]: action.payload.value }
            }
        }
        case Constructor_Actions_Types.SUBMIT: {
            const model: IDataModel = {
                id: useUtils.stringID(),
                size: action.payload.size,
                params: action.payload.params,
                nodes: action.payload.nodes,
                coords: action.payload.coords
            }

            return {
                ...state,
                current_model: model
            }
        }
        default: return state
    }

}


const updateCoords = (model: IDataModel) => {
    const [x, y] = model.coords!
    const { w, h } = model.size
    const [ox, oy] = [x + w, y + h]
    model.coords = [x, y, ox, oy]
    return model
}

const setCoords = (start: ICoords, size: Size) => {
    const [x, y] = start
    const { w, h } = size
    const [ox, oy] = [x + w, y + h]
    const coords = [x, y, ox, oy] as const
    return coords
}