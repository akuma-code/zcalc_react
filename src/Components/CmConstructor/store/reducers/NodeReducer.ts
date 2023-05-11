import { Size } from "../../../../Models/CalcModels/Size";
import { INodeBorder, ISideStateValues, ISides } from "../../../../Types/CalcModuleTypes";
import { CoordsTuple, IDataBorder, IDataNode } from "../../../../Types/DataModelTypes";
import { BorderDescEnum } from "../../../../Types/Enums";
import { useUtils } from "../../../../hooks/useUtils";
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

const coordsMap = <T extends IDataNode>(node: T) => {
    if (!node.borders) return []

    const coordsM = node.borders.map(b => ({ side: b.side!, coords: b.coords! }))
    return coordsM
}
const coordsStringMap = <T extends IDataNode>(node: T) => {
    if (!node.borders) return []

    const coordsM = node.borders.map(b => ({ side: b.side!, coords: b.coords!.join('') }))
    return coordsM
}



function getNodeBorder<T>(key: T, borders: IDataBorder[]) {

    return borders.reduce((border, b) => {
        if (b.side === key) border = b
        return border
    }, {} as IDataBorder)
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

const d1 = coordsStringMap(dn1)
const d2 = coordsStringMap(dn2)
const d3 = coordsStringMap(dn3)

const ddn1 = (side: ISides) => dn1.borders!.reduce((res, b) => {
    if (b.side === side) res = { ...res, ...b }

    return res
}, {} as IDataBorder)

const b = getNodeBorder('side', dn1.borders!)