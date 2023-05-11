import { Size } from "../../../../Models/CalcModels/Size";
import { INodeBorder, ISideStateValues, ISides } from "../../../../Types/CalcModuleTypes";
import { CoordsTuple, IDataBorder, IDataNode } from "../../../../Types/DataModelTypes";
import { BorderDescEnum } from "../../../../Types/Enums";
import { useUtils } from "../../../../hooks/useUtils";
const _ID = useUtils.stringID

const initState: IDataNode = {
    id: _ID(),
    sideBorders: [
        { side: 'left', border: { id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] } },
        { side: 'top', border: { id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] } },
        { side: 'right', border: { id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] } },
        { side: 'bottom', border: { id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] } },
    ],
    borders: [
        { side: 'left', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] },
        { side: 'top', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] },
        { side: 'right', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] },
        { side: 'bottom', id: _ID(), state: 'rama', desc: BorderDescEnum['rama'] },
    ],

}
export type NODE_ACTION = |

{ type: 'changeBorderState', data: { side: ISides, border: IDataBorder } } |
{ type: 'changeSize', data: { newSize: Size } } |
{ type: 'changeCoords', data: { newCoords: CoordsTuple } }



export function dataNodeReducer(node: IDataNode, action: NODE_ACTION): IDataNode {

    switch (action.type) {
        case "changeBorderState": {
            return node
        }

        case "changeSize": {
            const { newSize } = action.data
            return { ...node, size: newSize }
        }
        case "changeCoords": {
            return { ...node, coords: action.data.newCoords }
        }


        default: { return node }

    }
}