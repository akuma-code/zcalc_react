import { _ID } from "../Constructor/ViewModel/ViewModelConst";
import { ISides } from "../../Types/CalcModuleTypes";
import { IDataModel, IDataNode, CoordsTuple } from "../../Types/DataModelTypes";
import { BF } from "../../Models/CalcModels/BorderFactory";


export function NodeCreator(mode: string, ...args: any) {
    const [w, h, x = 0, y = 0] = args;
    const borders = BF.load(mode);
    const node: IDataNode = {
        id: _ID(),
        borders,
        coords: [x, y, x + w, y + h],
        size: { w, h },
    };
    updateBorderCoords(node);
    return node;
}

export function DModelCreator(...args: number[]) {
    const [w, h, x = 0, y = 0] = args;
    const baseNode = NodeCreator('fix', ...args);

    const model: IDataModel = {
        id: _ID(),
        nodes: [],
        baseNode: updateBorderCoords(baseNode),
        size: { w, h },
        coords: [x, y, w + x, h + y],
        params: {
            system: 'Proline',
            type: 'win'
        }
    };

    model.nodes.map(updateBorderCoords);
    return model;
}

export function updateBorderCoords(node: IDataNode) {
    const [x, y, ox, oy] = node.coords!;


    const bcoords = {
        left: [x, y, x, oy],
        right: [ox, y, ox, oy],
        top: [x, oy, ox, oy],
        bottom: [x, y, ox, y],
    } as Record<ISides, CoordsTuple>;


    node.borders = node.borders!.map(b => ({ ...b, coords: bcoords[b.side] }));

    return node;
}
