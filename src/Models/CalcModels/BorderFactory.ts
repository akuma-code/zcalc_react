import { _ID } from "../../Components/Constructor/ViewModel/ViewModelConst";
import { ISides } from "../../Types/CalcModuleTypes";
import { IDataBorder, IDataModel, IDataNode, CoordsTuple } from "../../Types/DataModelTypes";
import { BorderDescEnum } from "../../Types/Enums";

class BorderFactory {
    library!: Record<string, IDataBorder[]>
    constructor() {
        this.library = {}
    }

    use(key: string, borders: IDataBorder[]) {
        this.library[key] = borders
        return this
    }


    load(key: keyof typeof this.library) {
        return this.library[key]
    }
    get info() {
        return console.log(this);

    }
}


const fixBorderPack: IDataBorder[] = [
    { id: _ID(), side: 'left', desc: BorderDescEnum['rama'], state: 'rama' },
    { id: _ID(), side: 'top', desc: BorderDescEnum['rama'], state: 'rama' },
    { id: _ID(), side: 'right', desc: BorderDescEnum['rama'], state: 'rama' },
    { id: _ID(), side: 'bottom', desc: BorderDescEnum['rama'], state: 'rama' },
]
const stvBorderPack: IDataBorder[] = [
    { id: _ID(), side: 'left', desc: BorderDescEnum['stv_rama'], state: 'stv_rama' },
    { id: _ID(), side: 'top', desc: BorderDescEnum['stv_rama'], state: 'stv_rama' },
    { id: _ID(), side: 'right', desc: BorderDescEnum['stv_rama'], state: 'stv_rama' },
    { id: _ID(), side: 'bottom', desc: BorderDescEnum['stv_rama'], state: 'stv_rama' },
]


const BF = new BorderFactory()

BF.use('fix', fixBorderPack)
BF.use('stv', stvBorderPack)

export function NodeCreator(mode: string, ...args: any) {
    const [w, h, x = 0, y = 0] = args
    const borders = BF.load(mode)
    const node: IDataNode = {
        id: _ID(),
        borders,
        coords: [x, y, x + w, y + h],
        size: { w, h },
    }
    updateBorderCoords(node)
    return node
}

export function DModelCreator(...args: number[]) {
    const [w, h, x = 0, y = 0] = args
    const baseNode = NodeCreator('fix', ...args)

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
    }

    model.nodes.map(updateBorderCoords)
    return model
}

export function updateBorderCoords(node: IDataNode) {
    const [x, y, ox, oy] = node.coords!


    const bcoords = {
        left: [x, y, x, oy],
        right: [ox, y, ox, oy],
        top: [x, oy, ox, oy],
        bottom: [x, y, ox, y],
    } as Record<ISides, CoordsTuple>


    node.borders = node.borders!.map(b => ({ ...b, coords: bcoords[b.side] }))

    return node
}

const setCoords = (borders: IDataBorder[], ...coords: CoordsTuple) => {
    return borders.map(b => ({ ...b, coords: coords }))

}
export default BF