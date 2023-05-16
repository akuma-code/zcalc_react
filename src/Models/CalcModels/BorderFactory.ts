import { _ID } from "../../Components/Constructor/ViewModel/ViewModelConst";
import { IDataBorder, IDataNode } from "../../Types/DataModelTypes";
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
    return node
}

export default BF