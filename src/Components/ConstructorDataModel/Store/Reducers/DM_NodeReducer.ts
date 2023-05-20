import { Size } from "../../../../Models/CalcModels/Size";
import { INodeBorder, ISideStateValues, ISides } from "../../../../Types/CalcModuleTypes";
import { CoordsTuple, IDataBorder, IDataNode } from "../../../../Types/DataModelTypes";
import { BorderDescEnum } from "../../../../Types/Enums";
import { useUtils } from "../../../../hooks/useUtils";
import { DataNodeActions } from "../../../CmConstructor/store/actions/DataNodeActions";
import { NODE_ACTION, NODE_ACTIONS_LIST } from "../Interfaces/DataNodeActionsType";
const _ID = useUtils.stringID

const initState: IDataNode = {
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


const dn1: IDataNode = {
    id: _ID(),

    borders: [
        { side: 'left', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'], coords: [0, 0, 0, 10] },
        { side: 'top', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'], coords: [0, 10, 5, 10] },
        { side: 'right', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'], coords: [5, 0, 5, 10] },
        { side: 'bottom', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'], coords: [0, 0, 5, 0] },
    ],

}

export function dataNodeReducer(node: IDataNode, action: NODE_ACTIONS_LIST): IDataNode {

    switch (action.type) {
        case NODE_ACTION.DEVIDE:

            return {
                ...node,

            }


        default: { return node }

    }
}

function getNodeBorder<T>(key: T, borders: IDataBorder[]) {

    return borders.reduce((border, b) => {
        if (b.side === key) border = b
        return border
    }, {} as IDataBorder)
}








const dn2: IDataNode = {
    id: _ID(),

    borders: [
        { side: 'left', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'], coords: [0 + 5, 0, 0 + 5, 10] },
        { side: 'top', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'], coords: [0 + 5, 10, 5 + 5, 10] },
        { side: 'right', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'], coords: [5 + 5, 0, 5 + 5, 10] },
        { side: 'bottom', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'], coords: [0 + 5, 0, 5 + 5, 0] },
    ],

}
const dn3: IDataNode = {
    id: _ID(),

    borders: [
        { side: 'left', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'], coords: [0, 0 + 10, 0, 10 + 10] },
        { side: 'top', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'], coords: [0, 10 + 10, 5, 10 + 10] },
        { side: 'right', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'], coords: [5, 0 + 10, 5, 10 + 10] },
        { side: 'bottom', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'], coords: [0, 0 + 10, 5, 0 + 10] },
    ],

}

// const DNA = new DataNodeActions()

// DNA.actions.coordsMap(dn2)
// DNA.actions.coordsMapString(dn2)