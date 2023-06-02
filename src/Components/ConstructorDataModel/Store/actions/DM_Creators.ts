import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";
import { ISides } from "../../../../Types/CalcModuleTypes";
import { IDataModel, IDataNode, CoordsTuple, IDataBorder, CoordsEnum as CE } from "../../../../Types/DataModelTypes";
import { BF } from "../../../../Models/CalcModels/BorderFactory";


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
    const [w, h, x = 0, y = 0] = args!.map(c => c / 1);
    const baseNode = NodeSvgCreator('fix', [w, h], [x, y]);

    const model: IDataModel = {
        id: _ID(),
        nodes: [],
        baseNode: baseNode,
        size: { w, h },
        coords: [x, y, w + x, h + y],
        params: {
            system: 'Proline',
            type: 'win'
        }
    };

    // model.nodes.map(n => n.borders!.map(b => setBorderSVGCoords(b, n.coords!)));
    initModelNodes(model)
    return model;
}
export function initModelNodes(model: IDataModel) {
    const updated = model.nodes.map(n => n.borders!.map(b => setBorderSVGCoords(b, n.coords!)));
    return updated
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

export function NodeSvgCreator(mode: string, size: [w: number, h: number], startPos = [0, 0]) {
    const [x, y] = startPos
    const [ox, oy] = [size[CE.X] + x, size[CE.Y] + y]
    const borders = BF.load(mode);
    const node: IDataNode = {
        id: _ID(),
        borders: borders.map(b => setBorderSVGCoords(b, [x, y, ox, oy])),
        coords: [x, y, ox, oy],
        size: { w: size[CE.X], h: size[CE.Y] },
    };
    return node;
}

function setBorderSVGCoords(border: IDataBorder, node_coords: CoordsTuple) {
    const [x, y, ox, oy] = node_coords
    const { side, state } = border
    const borderWidth = state === 'rama' ? 10 : 6
    const BC: Record<ISides, CoordsTuple> = {
        top: [x, y, ox, y + borderWidth],
        left: [x, y, x + borderWidth, oy],
        bottom: [x, oy - borderWidth, ox, oy],
        right: [ox - borderWidth, y, ox, oy],

    }
    return { ...border, coords: BC[side] }
}